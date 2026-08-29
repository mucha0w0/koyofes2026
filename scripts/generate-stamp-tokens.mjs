/**
 * スタンプラリー全ブース分のトークン対応表を生成する。
 *
 * 使い方:
 *   node scripts/generate-stamp-tokens.mjs
 *
 * 出力（git 管理外）:
 *   stamp-tokens/stamp-token-map.env.txt  … Vercel / .env.local に貼る1行
 *   stamp-tokens/stamp-nfc-urls.csv       … NFC 書き込み用一覧
 *   stamp-tokens/stamp-tokens.json        … 詳細（slug / title / token / url）
 */

import { createHash, randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ENV_PATH = join(ROOT, '.env.local');
const OUT_DIR = join(ROOT, 'stamp-tokens');

const SOURCE_CATEGORIES = ['class-exhibit', 'volunteer-exhibit'];
const CATEGORY_ORDER = ['class-exhibit', 'volunteer-exhibit'];
const CATEGORY_LABEL = {
  'class-exhibit': 'クラス・学科',
  'volunteer-exhibit': '有志',
};
const COLLECT_BASE_URL = 'https://koyosai.com/stamp/collect';

function loadEnv(path) {
  const env = {};
  try {
    const text = readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue;
      const i = line.indexOf('=');
      if (i === -1) continue;
      env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  } catch {
    console.error('`.env.local` が見つかりません。プロジェクト直下に作成してください。');
    process.exit(1);
  }
  return env;
}

function getCategory(event) {
  const c = Array.isArray(event.category) ? event.category[0] : event.category;
  return c ?? '';
}

function createToken() {
  return randomBytes(16).toString('hex');
}

function csvEscape(value) {
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function main() {
  const env = loadEnv(ENV_PATH);
  const apiKey = env.MICROCMS_API_KEY;
  const serviceDomain = env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    console.error('.env.local に MICROCMS_API_KEY と MICROCMS_SERVICE_DOMAIN が必要です。');
    process.exit(1);
  }

  const url = `https://${serviceDomain}.microcms.io/api/v1/events?limit=100`;
  const response = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': apiKey },
  });

  if (!response.ok) {
    console.error(`microCMS 取得失敗: HTTP ${response.status}`);
    process.exit(1);
  }

  const data = await response.json();
  const booths = data.contents
    .filter((event) => SOURCE_CATEGORIES.includes(getCategory(event)))
    .map((event) => ({
      slug: event.slug,
      title: event.title,
      category: getCategory(event),
      categoryLabel: CATEGORY_LABEL[getCategory(event)] ?? getCategory(event),
    }))
    .sort((a, b) => {
      const orderA = CATEGORY_ORDER.indexOf(a.category);
      const orderB = CATEGORY_ORDER.indexOf(b.category);
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title, 'ja');
    });

  if (booths.length === 0) {
    console.error('スタンプ対象ブースが0件です。microCMS の category を確認してください。');
    process.exit(1);
  }

  const tokenMap = {};
  const rows = [];

  for (const booth of booths) {
    const token = createToken();
    tokenMap[token] = booth.slug;
    rows.push({
      ...booth,
      token,
      url: `${COLLECT_BASE_URL}?token=${token}`,
    });
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const mapJson = JSON.stringify(tokenMap);
  const envLine = `STAMP_TOKEN_MAP=${mapJson}`;

  writeFileSync(join(OUT_DIR, 'stamp-token-map.env.txt'), `${envLine}\n`, 'utf8');

  const csvHeader = 'category,slug,title,token,nfc_url';
  const csvBody = rows
    .map((row) =>
      [row.categoryLabel, row.slug, row.title, row.token, row.url].map(csvEscape).join(','),
    )
    .join('\n');
  writeFileSync(join(OUT_DIR, 'stamp-nfc-urls.csv'), `${csvHeader}\n${csvBody}\n`, 'utf8');

  writeFileSync(
    join(OUT_DIR, 'stamp-tokens.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        boothCount: rows.length,
        collectBaseUrl: COLLECT_BASE_URL,
        booths: rows,
      },
      null,
      2,
    ),
    'utf8',
  );

  const fingerprint = createHash('sha256').update(mapJson).digest('hex').slice(0, 12);

  console.log('');
  console.log('=== 生成完了 ===');
  console.log(`ブース数: ${rows.length}`);
  console.log(`出力先: ${OUT_DIR}`);
  console.log('');
  console.log('次のファイルを使ってください:');
  console.log('  1. stamp-token-map.env.txt  → .env.local / Vercel に貼る');
  console.log('  2. stamp-nfc-urls.csv       → Excel 等で NFC 書き込み管理');
  console.log('  3. stamp-tokens.json        → 詳細確認用');
  console.log('');
  console.log(`対応表 fingerprint（確認用）: ${fingerprint}`);
  console.log('');
  console.log('⚠  stamp-tokens/ は秘密情報を含むため git にコミットしないでください。');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
