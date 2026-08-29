/**
 * スタンプラリー全ブース分のトークン対応表を生成する。
 *
 * 使い方:
 *   node scripts/generate-stamp-tokens.mjs
 *   node scripts/generate-stamp-tokens.mjs --force-rotate   … 全トークンを再発行（NFC 無効化に注意）
 *
 * 既定動作:
 *   stamp-tokens/stamp-tokens.json（なければ .env.local / stamp-token-map.env.txt の
 *   STAMP_TOKEN_MAP）から既存トークンを読み、同じ slug は再利用する。
 *   新規ブースのみ新しいトークンを発行する。
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
const TOKENS_JSON_PATH = join(OUT_DIR, 'stamp-tokens.json');
const TOKEN_MAP_ENV_PATH = join(OUT_DIR, 'stamp-token-map.env.txt');

const SOURCE_CATEGORIES = ['class-exhibit', 'volunteer-exhibit'];
const CATEGORY_ORDER = ['class-exhibit', 'volunteer-exhibit'];
const CATEGORY_LABEL = {
  'class-exhibit': 'クラス・学科',
  'volunteer-exhibit': '有志',
};
const COLLECT_BASE_URL = 'https://koyosai.com/stamp/collect';

const forceRotate = process.argv.includes('--force-rotate');

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

/**
 * token → slug の既存マップを読み込む。
 * 優先: stamp-tokens.json → stamp-token-map.env.txt → .env.local の STAMP_TOKEN_MAP
 */
function loadExistingTokenMap(env) {
  // stamp-tokens.json（slug 単位で管理しやすい）
  try {
    const raw = readFileSync(TOKENS_JSON_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (data && Array.isArray(data.booths)) {
      const map = {};
      for (const booth of data.booths) {
        if (
          booth &&
          typeof booth.slug === 'string' &&
          booth.slug.length > 0 &&
          typeof booth.token === 'string' &&
          booth.token.length > 0
        ) {
          map[booth.token] = booth.slug;
        }
      }
      if (Object.keys(map).length > 0) {
        return { map, source: 'stamp-tokens/stamp-tokens.json' };
      }
    }
  } catch {
    // 未生成・破損は次の候補へ
  }

  const candidates = [
    { raw: (() => {
      try {
        return readFileSync(TOKEN_MAP_ENV_PATH, 'utf8');
      } catch {
        return null;
      }
    })(), source: 'stamp-tokens/stamp-token-map.env.txt' },
    { raw: env.STAMP_TOKEN_MAP ? `STAMP_TOKEN_MAP=${env.STAMP_TOKEN_MAP}` : null, source: '.env.local' },
  ];

  for (const { raw, source } of candidates) {
    if (!raw) continue;
    const line = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.startsWith('STAMP_TOKEN_MAP='));
    if (!line) continue;
    const json = line.slice('STAMP_TOKEN_MAP='.length).trim();
    try {
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const map = {};
        for (const [token, slug] of Object.entries(parsed)) {
          if (typeof slug === 'string' && slug.length > 0) {
            map[token] = slug;
          }
        }
        if (Object.keys(map).length > 0) {
          return { map, source };
        }
      }
    } catch {
      console.warn(`⚠  ${source} の STAMP_TOKEN_MAP をパースできませんでした。無視します。`);
    }
  }

  return { map: {}, source: null };
}

/** token→slug を slug→token に反転（同一 slug が複数ある場合は先勝ち） */
function invertTokenMap(tokenToSlug) {
  const slugToToken = new Map();
  for (const [token, slug] of Object.entries(tokenToSlug)) {
    if (!slugToToken.has(slug)) {
      slugToToken.set(slug, token);
    }
  }
  return slugToToken;
}

async function main() {
  if (forceRotate) {
    console.warn('');
    console.warn('⚠  --force-rotate: 全トークンを再発行します。既存 NFC は無効になります。');
    console.warn('');
  }

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

  const { map: existingTokenToSlug, source: existingSource } = forceRotate
    ? { map: {}, source: null }
    : loadExistingTokenMap(env);
  const existingSlugToToken = invertTokenMap(existingTokenToSlug);

  const tokenMap = {};
  const rows = [];
  const reused = [];
  const created = [];
  const usedTokens = new Set();

  for (const booth of booths) {
    let token = existingSlugToToken.get(booth.slug);
    if (token && !usedTokens.has(token)) {
      reused.push(booth.slug);
    } else {
      // 衝突回避: 既存・今回発行分と被らないまで再試行
      do {
        token = createToken();
      } while (usedTokens.has(token) || token in existingTokenToSlug);
      created.push(booth.slug);
    }
    usedTokens.add(token);
    tokenMap[token] = booth.slug;
    rows.push({
      ...booth,
      token,
      url: `${COLLECT_BASE_URL}?token=${token}`,
    });
  }

  // CMS から消えた slug でも、既に NFC に書いたトークンはマップに残す
  const activeSlugs = new Set(booths.map((b) => b.slug));
  const retainedOrphans = [];
  if (!forceRotate) {
    for (const [token, slug] of Object.entries(existingTokenToSlug)) {
      if (activeSlugs.has(slug)) continue;
      if (token in tokenMap) continue;
      tokenMap[token] = slug;
      retainedOrphans.push({ token, slug });
    }
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
        reusedCount: reused.length,
        createdCount: created.length,
        orphanTokenCount: retainedOrphans.length,
        booths: rows,
        orphanTokens: retainedOrphans.length > 0 ? retainedOrphans : undefined,
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
  if (existingSource) {
    console.log(`既存ソース: ${existingSource}`);
  } else if (!forceRotate) {
    console.log('既存ソース: なし（初回生成）');
  }
  console.log(`再利用: ${reused.length} / 新規発行: ${created.length}`);
  if (created.length > 0) {
    console.log(`  新規 slug: ${created.join(', ')}`);
  }
  if (retainedOrphans.length > 0) {
    console.log(
      `⚠  CMS に無いがマップに残したトークン: ${retainedOrphans.length} 件（NFC 無効化防止）`,
    );
    for (const orphan of retainedOrphans) {
      console.log(`    ${orphan.slug} ← ${orphan.token.slice(0, 8)}…`);
    }
  }
  console.log(`出力先: ${OUT_DIR}`);
  console.log('');
  console.log('次のファイルを使ってください:');
  console.log('  1. stamp-token-map.env.txt  → .env.local / Vercel に貼る');
  console.log('  2. stamp-nfc-urls.csv       → Excel 等で NFC 書き込み管理');
  console.log('  3. stamp-tokens.json        → 詳細確認用');
  console.log('');
  console.log(`対応表 fingerprint（確認用）: ${fingerprint}`);
  if (created.length === 0 && retainedOrphans.length === 0 && !forceRotate) {
    console.log('既存トークンをすべて再利用したため、NFC の書き直しは不要です。');
  } else if (created.length > 0) {
    console.log('新規ブース分だけ NFC を追加書き込みしてください。');
  }
  console.log('');
  console.log('⚠  stamp-tokens/ は秘密情報を含むため git にコミットしないでください。');
  console.log('⚠  全再発行が必要なときだけ: node scripts/generate-stamp-tokens.mjs --force-rotate');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
