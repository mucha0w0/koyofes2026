/**
 * 公開中の microCMS を data/cms/*.json に書き出す。
 * 形は一覧 API のレスポンス {"contents":[...],"totalCount":N}。depth=3。
 * 画像ファイルは別途 `npm run cms:mirror-local`。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data/cms');
const ENDPOINTS = ['events', 'news', 'parts', 'sponsors'];
const PAGE_LIMIT = 100;

async function fetchEndpoint(endpoint, apiKey, serviceDomain) {
  const all = [];
  let offset = 0;

  while (true) {
    const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${endpoint}`);
    url.searchParams.set('limit', String(PAGE_LIMIT));
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('depth', '3');

    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': apiKey } });
    if (!response.ok) {
      throw new Error(`${endpoint} の取得に失敗しました (${response.status})`);
    }
    const data = await response.json();
    const contents = Array.isArray(data.contents) ? data.contents : [];
    all.push(...contents);
    const total = typeof data.totalCount === 'number' ? data.totalCount : all.length;
    if (contents.length === 0 || all.length >= total) {
      return { contents: all, totalCount: total };
    }
    const nextOffset = offset + contents.length;
    if (nextOffset <= offset) return { contents: all, totalCount: all.length };
    offset = nextOffset;
  }
}

async function main() {
  const apiKey = process.env.MICROCMS_API_KEY?.trim();
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!apiKey || !serviceDomain) {
    throw new Error('MICROCMS_API_KEY と MICROCMS_SERVICE_DOMAIN を両方セットしてください');
  }

  await mkdir(DATA_DIR, { recursive: true });
  const manifestEndpoints = [];

  for (const endpoint of ENDPOINTS) {
    const document = await fetchEndpoint(endpoint, apiKey, serviceDomain);
    await writeFile(path.join(DATA_DIR, `${endpoint}.json`), `${JSON.stringify(document, null, 2)}\n`);
    manifestEndpoints.push({
      endpoint,
      type: 'list',
      count: document.contents.length,
      file: `${endpoint}.json`,
    });
    console.info(`cms export: ${endpoint} ${document.contents.length} 件`);
  }

  const manifest = {
    service: serviceDomain,
    exportedAt: new Date().toISOString(),
    depth: 3,
    endpoints: manifestEndpoints,
  };
  await writeFile(path.join(DATA_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.info('cms export: data/cms を更新しました。続けて npm run cms:mirror-local で画像を保存してください。');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
