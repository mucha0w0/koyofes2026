import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface RankingSnapshotVote {
  slug: string;
  visitorKey: string;
  stars: number;
  createdAt: string;
}

export interface RankingSnapshotVisit {
  slug: string;
  visitorKey: string;
  createdAt: string;
}

export interface RankingSnapshotWait {
  slug: string;
  visitorKey: string;
  level: number;
  createdAt: string;
}

export interface RankingSnapshot {
  exportedAt: string;
  votes: RankingSnapshotVote[];
  visits: RankingSnapshotVisit[];
  waits: RankingSnapshotWait[];
}

const SNAPSHOT_PATH = join(process.cwd(), 'data/ranking/snapshot.json');

let cached: RankingSnapshot | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isRankingSnapshot(value: unknown): value is RankingSnapshot {
  return (
    isRecord(value) &&
    typeof value.exportedAt === 'string' &&
    !Number.isNaN(Date.parse(value.exportedAt)) &&
    Array.isArray(value.votes) &&
    Array.isArray(value.visits) &&
    Array.isArray(value.waits)
  );
}

function parseSnapshot(raw: unknown): RankingSnapshot {
  if (!isRankingSnapshot(raw)) {
    throw new Error('data/ranking/snapshot.json の形が不正です');
  }
  return raw;
}

/** DATABASE_URL が無いときの読み取り元。来場者 ID は連番に置き換わっている。 */
export function readRankingSnapshot(): RankingSnapshot {
  if (!cached) {
    cached = parseSnapshot(JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')));
  }
  return cached;
}

/** トレンドと待ちの窓を、書き出した瞬間で固定する。 */
export function rankingSnapshotTime(): Date {
  return new Date(readRankingSnapshot().exportedAt);
}
