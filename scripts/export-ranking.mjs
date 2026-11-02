/**
 * Neon のランキング 3 テーブルを data/ranking/snapshot.json に書き出す。
 * 来場者 ID はファイル内だけの連番に置き換える。接続文字列は出さない。
 *
 * DATABASE_URL があるときだけ実行する。無いときは何も書かず終了する。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import postgres from 'postgres';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data/ranking');
const OUT_PATH = path.join(DATA_DIR, 'snapshot.json');

function loadLocalEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!existsSync(envPath)) {
    return;
  }
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function anonymize(ids) {
  const keys = new Map();
  let next = 1;
  return ids.map((id) => {
    const existing = keys.get(id);
    if (existing) {
      return existing;
    }
    const key = String(next);
    next += 1;
    keys.set(id, key);
    return key;
  });
}

async function main() {
  loadLocalEnv();
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url === 'pglite' || url.startsWith('pglite:')) {
    console.info('ranking export: DATABASE_URL が無いのでスナップショットは更新しません');
    return;
  }

  const sql = postgres(url, { max: 1, connect_timeout: 20 });
  try {
    const votes = await sql`
      select slug, visitor_id, stars, created_at
      from ranking_votes
      order by created_at asc
    `;
    const visits = await sql`
      select slug, visitor_id, created_at
      from ranking_visits
      order by created_at asc
    `;
    const waits = await sql`
      select slug, visitor_id, level, created_at
      from ranking_waits
      order by created_at asc
    `;

    const visitorIds = [
      ...votes.map((row) => String(row.visitor_id)),
      ...visits.map((row) => String(row.visitor_id)),
      ...waits.map((row) => String(row.visitor_id)),
    ];
    const visitorKeys = anonymize(visitorIds);
    let cursor = 0;
    const takeKey = () => {
      const key = visitorKeys[cursor];
      cursor += 1;
      return key;
    };

    const snapshot = {
      exportedAt: new Date().toISOString(),
      votes: votes.map((row) => ({
        slug: String(row.slug),
        visitorKey: takeKey(),
        stars: Number(row.stars),
        createdAt: new Date(row.created_at).toISOString(),
      })),
      visits: visits.map((row) => ({
        slug: String(row.slug),
        visitorKey: takeKey(),
        createdAt: new Date(row.created_at).toISOString(),
      })),
      waits: waits.map((row) => ({
        slug: String(row.slug),
        visitorKey: takeKey(),
        level: Number(row.level),
        createdAt: new Date(row.created_at).toISOString(),
      })),
    };

    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(OUT_PATH, `${JSON.stringify(snapshot)}\n`);
    const manifest = {
      exportedAt: snapshot.exportedAt,
      votes: snapshot.votes.length,
      visits: snapshot.visits.length,
      waits: snapshot.waits.length,
      note: 'visitor_id はファイル内の連番に置き換え済み。DATABASE_URL が無いときは snapshot.json を読む。',
    };
    writeFileSync(path.join(DATA_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    console.info(
      `ranking export: votes ${snapshot.votes.length} / visits ${snapshot.visits.length} / waits ${snapshot.waits.length}`,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
