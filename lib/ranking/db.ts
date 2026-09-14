import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { drizzle as drizzlePg, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/lib/ranking/schema';

export type RankingDatabase = PostgresJsDatabase<typeof schema>;

type PgliteLike = {
  waitReady: Promise<void>;
  exec: (sql: string) => Promise<unknown>;
};

const globalForRanking = globalThis as typeof globalThis & {
  koyofesRankingDb?: Promise<RankingDatabase | null>;
  koyofesPglite?: PgliteLike;
};

function isPgliteUrl(url: string): boolean {
  return url === 'pglite' || url.startsWith('pglite:');
}

async function createPgliteDb(): Promise<RankingDatabase> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  if (!globalForRanking.koyofesPglite) {
    const client = new PGlite();
    await client.waitReady;
    const sql = readFileSync(join(process.cwd(), 'drizzle/0000_ranking.sql'), 'utf8');
    await client.exec(sql);
    globalForRanking.koyofesPglite = client;
  }
  return drizzle(globalForRanking.koyofesPglite, { schema }) as unknown as RankingDatabase;
}

async function createPostgresDb(url: string): Promise<RankingDatabase> {
  const client = postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return drizzlePg(client, { schema });
}

async function connect(): Promise<RankingDatabase | null> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    return null;
  }
  if (isPgliteUrl(url)) {
    return createPgliteDb();
  }
  return createPostgresDb(url);
}

/** DATABASE_URL 未設定なら null。呼び出し側で 503 / スキップする。 */
export function getDb(): Promise<RankingDatabase | null> {
  if (!globalForRanking.koyofesRankingDb) {
    globalForRanking.koyofesRankingDb = connect().catch((error) => {
      globalForRanking.koyofesRankingDb = undefined;
      throw error;
    });
  }
  return globalForRanking.koyofesRankingDb;
}
