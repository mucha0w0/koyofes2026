import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { canonicalMicroCmsImageKey, lookupDeliveredImage, rewriteMicroCmsUrls } from '../lib/microcms/image-url.ts';

import { buildDownloadUrl, collectImageRoles, mirrorCmsImages } from './mirror-cms-images.mjs';

const ICON = 'https://images.microcms-assets.io/assets/svc/icon-id/icon.png';
const PHOTO = 'https://images.microcms-assets.io/assets/svc/photo-id/photo.jpg';
const INLINE = 'https://images.microcms-assets.io/assets/svc/inline-id/inline.png?w=4000';

test('canonical key drops query and keeps the path', () => {
  assert.equal(canonicalMicroCmsImageKey(`${PHOTO}?w=1920&q=75`), PHOTO);
  assert.equal(canonicalMicroCmsImageKey('https://example.com/a.png'), null);
  assert.equal(canonicalMicroCmsImageKey('/cms-images/abc.png'), null);
});

test('rewrite replaces only mirrored urls', () => {
  const images = {
    [canonicalMicroCmsImageKey(INLINE)]: '/cms-images/abcdef0123456789.png',
  };
  const html = `<p><img src="${INLINE.replace(/&/g, '&amp;')}"><img src="https://example.com/a.png"></p>`;
  const rewritten = rewriteMicroCmsUrls(html, images);
  assert.match(rewritten, /src="\/cms-images\/abcdef0123456789.png"/);
  assert.match(rewritten, /example\.com\/a\.png/);
  assert.equal(lookupDeliveredImage(PHOTO, images), null);
});

test('icon and inline image roles', () => {
  const roles = collectImageRoles([
    {
      icon: { url: ICON },
      images: [{ url: PHOTO }],
      description: `<img src="${INLINE}">`,
    },
  ]);
  assert.equal(roles.get(ICON), 'icon');
  assert.equal(roles.get(PHOTO), 'large');
  assert.equal(roles.get(canonicalMicroCmsImageKey(INLINE)), 'large');
  assert.match(buildDownloadUrl(ICON, 'icon'), /[?&]w=320/);
  assert.match(buildDownloadUrl(PHOTO, 'large'), /[?&]w=1920/);
  assert.match(buildDownloadUrl(PHOTO, 'large'), /[?&]q=75/);
  assert.equal(
    buildDownloadUrl('https://images.microcms-assets.io/assets/svc/a/anim.gif', 'large'),
    'https://images.microcms-assets.io/assets/svc/a/anim.gif',
  );
});

test('mirror downloads resized files and writes a manifest', async () => {
  const png = Buffer.from('png-icon');
  const jpeg = Buffer.from('jpeg-photo-resized');
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (url.pathname === '/api/v1/events') {
      res.setHeader('content-type', 'application/json');
      res.end(
        JSON.stringify({
          contents: [
            {
              icon: { url: ICON },
              images: [{ url: PHOTO }],
              description: `<img src="${INLINE}">`,
            },
          ],
          totalCount: 1,
          offset: 0,
          limit: 100,
        }),
      );
      return;
    }
    if (url.pathname.startsWith('/api/v1/')) {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ contents: [], totalCount: 0, offset: 0, limit: 100 }));
      return;
    }
    if (url.pathname.endsWith('/icon.png')) {
      assert.equal(url.searchParams.get('w'), '320');
      res.setHeader('content-type', 'image/png');
      res.end(png);
      return;
    }
    if (url.pathname.endsWith('/photo.jpg') || url.pathname.endsWith('/inline.png')) {
      assert.equal(url.searchParams.get('w'), '1920');
      res.setHeader('content-type', 'image/jpeg');
      res.end(jpeg);
      return;
    }
    res.statusCode = 404;
    res.end('missing');
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const origin = `http://127.0.0.1:${address.port}`;
  const dir = await mkdtemp(path.join(os.tmpdir(), 'cms-images-'));
  const imageDir = path.join(dir, 'cms-images');
  const manifestPath = path.join(dir, 'image-manifest.json');

  const fetchImpl = (input, init) => {
    const target = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const rewritten = target
      .replace('https://test.microcms.io', origin)
      .replace('https://images.microcms-assets.io', origin);
    return fetch(rewritten, init);
  };

  try {
    const result = await mirrorCmsImages({
      apiKey: 'test-key',
      serviceDomain: 'test',
      fetchImpl,
      imageDir,
      manifestPath,
    });
    assert.equal(result.mirrored, 3);
    assert.equal(result.failed.length, 0);

    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    assert.equal(Object.keys(manifest.images).length, 3);
    const iconPath = manifest.images[ICON];
    assert.match(iconPath, /^\/cms-images\/[a-f0-9]{16}\.png$/);
    const saved = await readFile(path.join(imageDir, path.basename(iconPath)));
    assert.equal(saved.toString(), 'png-icon');
  } finally {
    server.close();
    await rm(dir, { recursive: true, force: true });
  }
});
