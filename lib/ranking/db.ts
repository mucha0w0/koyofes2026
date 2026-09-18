import 'server-only';

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/lib/ranking/schema';

export type RankingDatabase = PostgresJsDatabase<typeof schema>;

const globalForRanking = globalThis as typeof globalThis & {
  koyofesRankingDb?: Promise<RankingDatabase | null>;
  koyofesPglite?: PGlite;
};

function isPgliteUrl(url: string): boolean {
  return url === 'pglite' || url.startsWith('pglite:');
}

async function createPgliteDb(): Promise<RankingDatabase> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const client = globalForRanking.koyofesPglite ?? new PGlite();
  if (!globalForRanking.koyofesPglite) {
    await client.waitReady;
    const drizzleDir = join(process.cwd(), 'drizzle');
    const files = readdirSync(drizzleDir)
      .filter((name) => name.endsWith('.sql'))
      .sort();
    for (const file of files) {
      await client.exec(readFileSync(join(drizzleDir, file), 'utf8'));
    }
    globalForRanking.koyofesPglite = client;
  }
  return drizzle(client, { schema }) as unknown as RankingDatabase;
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
