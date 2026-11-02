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

function parseSnapshot(raw: unknown): RankingSnapshot {
  if (
    !isRecord(raw) ||
    typeof raw.exportedAt !== 'string' ||
    Number.isNaN(Date.parse(raw.exportedAt)) ||
    !Array.isArray(raw.votes) ||
    !Array.isArray(raw.visits) ||
    !Array.isArray(raw.waits)
  ) {
    throw new Error('data/ranking/snapshot.json の形が不正です');
  }
  return raw as RankingSnapshot;
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
