import 'server-only';

import type {
  RankingOverallItem,
  RankingPodiumEntry,
  RankingPodiumResponse,
  RankingTrendItem,
  RankingWaitItem,
} from '@/lib/types/ranking';
import type { StampBooth } from '@/lib/types/stamp';

import { RANKING_CONFIG } from '@/lib/config/rankingConfig';
import { getTrendAggregates, getVoteAggregates, getWaitAggregates } from '@/lib/ranking/queries';
import { averageStars, bayesianScore } from '@/lib/ranking/score';
import { getStampBooths } from '@/lib/stamp/booths';

export type RankingBoothMap = Map<string, StampBooth>;

export async function loadRankingBooths(): Promise<RankingBoothMap> {
  const booths = await getStampBooths();
  return new Map(booths.map((booth) => [booth.slug, booth]));
}

export async function listOverallRanking(boothBySlug: RankingBoothMap): Promise<RankingOverallItem[]> {
  const aggregates = await getVoteAggregates();
  return aggregates
    .map((row) => {
      const booth = boothBySlug.get(row.slug);
      if (!booth || row.voteCount <= 0) {
        return null;
      }
      const average = averageStars(row.starSum, row.voteCount);
      return {
        rank: 0,
        slug: booth.slug,
        title: booth.title,
        organization: booth.organization,
        icon: booth.icon,
        score: bayesianScore(row.starSum, row.voteCount),
        average,
        voteCount: row.voteCount,
      };
    })
    .filter((item): item is RankingOverallItem => item !== null)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return a.title.localeCompare(b.title, 'ja');
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export async function listTrendRanking(boothBySlug: RankingBoothMap, now = Date.now()): Promise<RankingTrendItem[]> {
  const since = new Date(now - RANKING_CONFIG.trendWindowMs);
  const aggregates = await getTrendAggregates(since);
  return aggregates
    .map((row) => {
      const booth = boothBySlug.get(row.slug);
      if (!booth || row.uniqueVisitors <= 0) {
        return null;
      }
      return {
        rank: 0,
        slug: booth.slug,
        title: booth.title,
        organization: booth.organization,
        icon: booth.icon,
        uniqueVisitors: row.uniqueVisitors,
      };
    })
    .filter((item): item is RankingTrendItem => item !== null)
    .sort((a, b) => {
      if (b.uniqueVisitors !== a.uniqueVisitors) {
        return b.uniqueVisitors - a.uniqueVisitors;
      }
      return a.title.localeCompare(b.title, 'ja');
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export async function listWaitRanking(boothBySlug: RankingBoothMap, now = Date.now()): Promise<RankingWaitItem[]> {
  const since = new Date(now - RANKING_CONFIG.waitWindowMs);
  const aggregates = await getWaitAggregates(since, new Date(now));
  return aggregates
    .map((row) => {
      const booth = boothBySlug.get(row.slug);
      if (!booth || row.voteCount <= 0) {
        return null;
      }
      return {
        rank: 0,
        slug: booth.slug,
        title: booth.title,
        organization: booth.organization,
        icon: booth.icon,
        level: row.level,
        score: row.score,
        voteCount: row.voteCount,
        lastVotedAt: row.lastVotedAt.toISOString(),
      };
    })
    .filter((item): item is RankingWaitItem => item !== null)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const timeDiff = new Date(b.lastVotedAt).getTime() - new Date(a.lastVotedAt).getTime();
      if (timeDiff !== 0) {
        return timeDiff;
      }
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return a.title.localeCompare(b.title, 'ja');
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function pickPodium(items: { slug: string; rank: number }[]): RankingPodiumEntry[] {
  return items
    .filter((item) => item.rank >= 1 && item.rank <= RANKING_CONFIG.podiumSize)
    .map((item) => ({ slug: item.slug, rank: item.rank }));
}

/** 総合・トレンドの上位だけ。展示ページの表示用。 */
export async function getRankingPodium(now = Date.now()): Promise<RankingPodiumResponse> {
  const boothBySlug = await loadRankingBooths();
  const [overall, trend] = await Promise.all([listOverallRanking(boothBySlug), listTrendRanking(boothBySlug, now)]);
  return {
    overall: pickPodium(overall),
    trend: pickPodium(trend),
  };
}
