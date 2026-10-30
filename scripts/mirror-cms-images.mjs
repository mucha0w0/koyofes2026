/**
 * microCMS の画像をビルド時に public/cms-images へ保存する。
 * 来場者のブラウザは images.microcms-assets.io を叩かず、Vercel の静的ファイルを読む。
 * 画像最適化（/_next/image）は通さない。転送先を Image Optimization の従量課金に移さないため。
 *
 * 認証情報が無いときは空のマニフェストを書き、従来どおり microCMS 直配信に落とす。
 * 一覧 API が失敗したとき、または URL があるのに 1 件も保存できなかったときは終了コード 1。
 * 一部の画像だけ失敗したときはマニフェストから外し、その URL だけ直配信のままビルドを続ける。
 */
import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { canonicalMicroCmsImageKey, decodeHtmlImageUrl } from '../lib/microcms/image-url.ts';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_IMAGE_DIR = path.join(ROOT, 'public/cms-images');
const DEFAULT_MANIFEST_PATH = path.join(ROOT, 'lib/microcms/image-manifest.json');

const ENDPOINTS = ['events', 'news', 'parts', 'sponsors'];
const PAGE_LIMIT = 100;
const ICON_WIDTH = 320;
const LARGE_WIDTH = 1920;
const QUALITY = 75;
const CONCURRENCY = 4;
const MAX_ATTEMPTS = 3;
const MAX_BYTES = 20 * 1024 * 1024;

const URL_PATTERN_SOURCE = String.raw`(?:https?:)?\/\/images\.microcms-assets\.io\/[^\s"'<>\\]+`;

const EXT_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
};

/**
 * @param {unknown} value
 * @param {string} key
 * @param {Map<string, 'icon' | 'large'>} roles
 */
function walkContent(value, key, roles) {
  if (typeof value === 'string') {
    if (!value.includes('images.microcms-assets.io')) return;
    const pattern = new RegExp(URL_PATTERN_SOURCE, 'gi');
    for (const match of value.matchAll(pattern)) {
      markImage(decodeHtmlImageUrl(match[0]), 'large', roles);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) walkContent(item, key, roles);
    return;
  }

  if (!value || typeof value !== 'object') return;

  const record = /** @type {Record<string, unknown>} */ (value);
  if (typeof record.url === 'string' && key === 'icon') {
    markImage(record.url, 'icon', roles);
  }
  if (typeof record.url === 'string' && key === 'images') {
    markImage(record.url, 'large', roles);
  }

  for (const [childKey, child] of Object.entries(record)) {
    if (childKey === 'url' && (key === 'icon' || key === 'images')) continue;
    walkContent(child, childKey, roles);
  }
}

/**
 * @param {string} url
 * @param {'icon' | 'large'} role
 * @param {Map<string, 'icon' | 'large'>} roles
 */
function markImage(url, role, roles) {
  const key = canonicalMicroCmsImageKey(url);
  if (!key) return;
  const current = roles.get(key);
  if (current === 'large') return;
  if (role === 'large' || !current) roles.set(key, role);
}

/**
 * @param {unknown[]} documents
 * @returns {Map<string, 'icon' | 'large'>}
 */
export function collectImageRoles(documents) {
  const roles = new Map();
  for (const document of documents) walkContent(document, '', roles);
  return roles;
}

/**
 * @param {string} canonical
 * @param {'icon' | 'large'} role
 */
export function buildDownloadUrl(canonical, role) {
  const url = new URL(canonical);
  const ext = path.extname(url.pathname).toLowerCase();
  if (ext === '.gif' || ext === '.svg') return canonical;
  url.searchParams.set('w', String(role === 'icon' ? ICON_WIDTH : LARGE_WIDTH));
  url.searchParams.set('q', String(QUALITY));
  return url.toString();
}

/**
 * @param {string} contentType
 * @param {string} canonical
 */
function extensionFor(contentType, canonical) {
  const type = contentType.split(';')[0]?.trim().toLowerCase() ?? '';
  if (EXT_BY_TYPE[type]) return EXT_BY_TYPE[type];
  const fromPath = path.extname(new URL(canonical).pathname).toLowerCase();
  if (fromPath === '.jpeg') return '.jpg';
  if (['.jpg', '.png', '.webp', '.gif', '.svg', '.avif', '.ico'].includes(fromPath)) return fromPath;
  return null;
}

/**
 * @param {string} canonical
 * @param {string} downloadUrl
 * @param {string} ext
 */
function fileNameFor(canonical, downloadUrl, ext) {
  const hash = createHash('sha256').update(`${canonical}\n${downloadUrl}`).digest('hex').slice(0, 16);
  return `${hash}${ext}`;
}

/**
 * @param {string} manifestPath
 * @param {Record<string, string>} images
 */
async function writeManifest(manifestPath, images) {
  await mkdir(path.dirname(manifestPath), { recursive: true });
  const body = `${JSON.stringify({ images }, null, 2)}\n`;
  await writeFile(manifestPath, body);
}

/**
 * @param {string} endpoint
 * @param {string} apiKey
 * @param {string} serviceDomain
 * @param {typeof fetch} fetchImpl
 */
async function fetchEndpoint(endpoint, apiKey, serviceDomain, fetchImpl) {
  const all = [];
  let offset = 0;

  while (true) {
    const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${endpoint}`);
    url.searchParams.set('limit', String(PAGE_LIMIT));
    url.searchParams.set('offset', String(offset));

    const response = await fetchImpl(url, {
      headers: { 'X-MICROCMS-API-KEY': apiKey },
    });
    if (!response.ok) {
      throw new Error(`${endpoint} の取得に失敗しました (${response.status})`);
    }

    const data = await response.json();
    const contents = Array.isArray(data.contents) ? data.contents : [];
    all.push(...contents);

    const total = typeof data.totalCount === 'number' ? data.totalCount : all.length;
    if (contents.length === 0 || all.length >= total) break;
    const nextOffset = offset + contents.length;
    if (nextOffset <= offset) break;
    offset = nextOffset;
  }

  return all;
}

/**
 * @param {string} downloadUrl
 * @param {typeof fetch} fetchImpl
 */
async function downloadImage(downloadUrl, fetchImpl) {
  let lastError = 'unknown';
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchImpl(downloadUrl, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
      } else {
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length === 0) {
          lastError = 'empty body';
        } else if (bytes.length > MAX_BYTES) {
          lastError = `${bytes.length} bytes は上限を超えています`;
        } else {
          const ext = extensionFor(response.headers.get('content-type') ?? '', downloadUrl);
          if (!ext) {
            lastError = `未対応の Content-Type: ${response.headers.get('content-type') ?? ''}`;
          } else {
            return { bytes, ext };
          }
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }
  }

  throw new Error(lastError);
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T) => Promise<void>} worker
 */
async function runPool(items, limit, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index]);
    }
  });
  await Promise.all(runners);
}

/**
 * @param {{
 *   apiKey: string;
 *   serviceDomain: string;
 *   fetchImpl?: typeof fetch;
 *   imageDir?: string;
 *   manifestPath?: string;
 * }} options
 */
export async function mirrorCmsImages({
  apiKey,
  serviceDomain,
  fetchImpl = globalThis.fetch,
  imageDir = DEFAULT_IMAGE_DIR,
  manifestPath = DEFAULT_MANIFEST_PATH,
}) {
  const documents = [];
  for (const endpoint of ENDPOINTS) {
    const contents = await fetchEndpoint(endpoint, apiKey, serviceDomain, fetchImpl);
    documents.push(...contents);
  }

  const roles = collectImageRoles(documents);
  await rm(imageDir, { recursive: true, force: true });
  await mkdir(imageDir, { recursive: true });

  /** @type {Record<string, string>} */
  const images = {};
  /** @type {string[]} */
  const failures = [];
  let bytes = 0;

  const jobs = [...roles.entries()];
  await runPool(jobs, CONCURRENCY, async ([canonical, role]) => {
    const downloadUrl = buildDownloadUrl(canonical, role);
    try {
      const downloaded = await downloadImage(downloadUrl, fetchImpl);
      const name = fileNameFor(canonical, downloadUrl, downloaded.ext);
      await writeFile(path.join(imageDir, name), downloaded.bytes);
      images[canonical] = `/cms-images/${name}`;
      bytes += downloaded.bytes.length;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${canonical} (${message})`);
    }
  });

  if (jobs.length > 0 && Object.keys(images).length === 0) {
    await writeManifest(manifestPath, {});
    throw new Error(`画像を1件も保存できませんでした。例: ${failures[0] ?? 'unknown'}`);
  }

  const sorted = Object.fromEntries(Object.entries(images).sort(([left], [right]) => left.localeCompare(right)));
  await writeManifest(manifestPath, sorted);
  return {
    mirrored: Object.keys(images).length,
    failed: failures,
    bytes,
    total: jobs.length,
  };
}

async function main() {
  const apiKey = process.env.MICROCMS_API_KEY;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    await writeManifest(DEFAULT_MANIFEST_PATH, {});
    await rm(DEFAULT_IMAGE_DIR, { recursive: true, force: true });
    console.warn(
      'microCMS images: MICROCMS_API_KEY / MICROCMS_SERVICE_DOMAIN が無いためミラーをスキップします。画像は microCMS から直接配信されます。',
    );
    return;
  }

  const result = await mirrorCmsImages({ apiKey, serviceDomain });
  const megabytes = (result.bytes / (1024 * 1024)).toFixed(1);
  console.info(
    `microCMS images: ${result.mirrored}/${result.total} 件を静的ファイルに保存しました (${megabytes} MB)。アイコンは幅 ${ICON_WIDTH}px、写真と本文画像は幅 ${LARGE_WIDTH}px・q=${QUALITY}。`,
  );
  if (result.failed.length > 0) {
    console.warn(
      `microCMS images: ${result.failed.length} 件は保存できなかったため、その URL だけ microCMS 直配信のままです。`,
    );
    for (const failure of result.failed) console.warn(`  ${failure}`);
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
