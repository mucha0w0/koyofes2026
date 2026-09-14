import 'server-only';

import { and, count, countDistinct, eq, gte, sum } from 'drizzle-orm';

import { RANKING_CONFIG } from '@/lib/config/rankingConfig';
import { getDb } from '@/lib/ranking/db';
import { rankingVisits, rankingVotes } from '@/lib/ranking/schema';

export class RankingDatabaseUnavailableError extends Error {
  constructor() {
    super('DATABASE_URL が設定されていません');
    this.name = 'RankingDatabaseUnavailableError';
  }
}

export class VoteRateLimitedError extends Error {
  constructor() {
    super('同じ企画への投票が短すぎます');
    this.name = 'VoteRateLimitedError';
  }
}

async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new RankingDatabaseUnavailableError();
  }
  return db;
}

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/** 同一 visitor × slug はデバウンス時間内なら無視。DB 未設定では何もしない。 */
export async function recordVisit(visitorId: string, slug: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }

  const since = new Date(Date.now() - RANKING_CONFIG.visitDebounceMs);
  const recent = await db
    .select({ id: rankingVisits.id })
    .from(rankingVisits)
    .where(
      and(eq(rankingVisits.visitorId, visitorId), eq(rankingVisits.slug, slug), gte(rankingVisits.createdAt, since)),
    )
    .limit(1);

  if (recent.length > 0) {
    return;
  }

  await db.insert(rankingVisits).values({ visitorId, slug });
}

export async function insertVote(visitorId: string, slug: string, stars: number): Promise<void> {
  const db = await requireDb();
  const since = new Date(Date.now() - RANKING_CONFIG.voteDebounceMs);
  const recent = await db
    .select({ id: rankingVotes.id })
    .from(rankingVotes)
    .where(and(eq(rankingVotes.visitorId, visitorId), eq(rankingVotes.slug, slug), gte(rankingVotes.createdAt, since)))
    .limit(1);

  if (recent.length > 0) {
    throw new VoteRateLimitedError();
  }

  await db.insert(rankingVotes).values({ visitorId, slug, stars });
}

export interface VoteAggregate {
  slug: string;
  voteCount: number;
  starSum: number;
}

export async function getVoteAggregates(): Promise<VoteAggregate[]> {
  const db = await requireDb();
  const rows = await db
    .select({
      slug: rankingVotes.slug,
      voteCount: count(),
      starSum: sum(rankingVotes.stars),
    })
    .from(rankingVotes)
    .groupBy(rankingVotes.slug);

  return rows.map((row) => ({
    slug: row.slug,
    voteCount: toNumber(row.voteCount),
    starSum: toNumber(row.starSum),
  }));
}

export interface TrendAggregate {
  slug: string;
  uniqueVisitors: number;
}

export async function getTrendAggregates(since: Date): Promise<TrendAggregate[]> {
  const db = await requireDb();
  const rows = await db
    .select({
      slug: rankingVisits.slug,
      uniqueVisitors: countDistinct(rankingVisits.visitorId),
    })
    .from(rankingVisits)
    .where(gte(rankingVisits.createdAt, since))
    .groupBy(rankingVisits.slug);

  return rows.map((row) => ({
    slug: row.slug,
    uniqueVisitors: toNumber(row.uniqueVisitors),
  }));
}
