import 'server-only';

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { sql } from 'drizzle-orm';
import { drizzle as drizzlePg, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import type { PGlite } from '@electric-sql/pglite';

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

const CONNECT_TIMEOUT_MS = 3000;

async function connectPostgres(url: string): Promise<RankingDatabase | null> {
  const client = postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: CONNECT_TIMEOUT_MS / 1000,
  });
  const db = drizzlePg(client, { schema });
  const probe = db.execute(sql`select 1`);
  void probe.catch(() => undefined);
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      probe,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('DATABASE_URL への接続がタイムアウトしました')), CONNECT_TIMEOUT_MS);
      }),
    ]);
    return db;
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'connection failed';
    console.error(
      `DATABASE_URL へ接続できないためランキングはスナップショットを使います: ${detail.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://…')}`,
    );
    void client.end({ timeout: 1 });
    return null;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function connect(): Promise<RankingDatabase | null> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    return null;
  }
  if (isPgliteUrl(url)) {
    return createPgliteDb();
  }
  return connectPostgres(url);
}

/** DATABASE_URL が無い、または接続できないときは null。読み取りはスナップショットに落ちる。 */
export function getDb(): Promise<RankingDatabase | null> {
  if (!globalForRanking.koyofesRankingDb) {
    globalForRanking.koyofesRankingDb = connect().catch((error) => {
      globalForRanking.koyofesRankingDb = undefined;
      throw error;
    });
  }
  return globalForRanking.koyofesRankingDb;
}
