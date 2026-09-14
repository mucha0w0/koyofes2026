import { NextResponse } from 'next/server';

import type {
  RankingApiError,
  RankingOverallItem,
  RankingResponse,
  RankingTrendItem,
} from '@/lib/types/ranking';

import { RANKING_CONFIG, isRankingDatabaseConfigured, isRankingEnabled } from '@/lib/config/rankingConfig';
import {
  getTrendAggregates,
  getVoteAggregates,
  RankingDatabaseUnavailableError,
} from '@/lib/ranking/queries';
import { averageStars, bayesianScore } from '@/lib/ranking/score';
import { getStampBooths } from '@/lib/stamp/booths';

function errorResponse(status: number, error: string, code: RankingApiError['code']) {
  const body: RankingApiError = { error, code };
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function noStore(body: RankingResponse) {
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request) {
  if (!isRankingEnabled()) {
    return errorResponse(403, 'ランキングは現在公開していません', 'RANKING_DISABLED');
  }

  if (!isRankingDatabaseConfigured()) {
    return errorResponse(503, 'ランキングの保存先が設定されていません', 'DB_UNAVAILABLE');
  }

  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') === 'trend' ? 'trend' : 'overall';

  let booths;
  try {
    booths = await getStampBooths();
  } catch (error) {
    console.error('ランキングブース取得エラー:', error);
    return errorResponse(500, '企画情報の取得に失敗しました', 'SERVER_ERROR');
  }

  const boothBySlug = new Map(booths.map((booth) => [booth.slug, booth]));
  const generatedAt = new Date().toISOString();

  try {
    if (tab === 'trend') {
      const since = new Date(Date.now() - RANKING_CONFIG.trendWindowMs);
      const aggregates = await getTrendAggregates(since);
      const items: RankingTrendItem[] = aggregates
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

      return noStore({ tab: 'trend', generatedAt, items });
    }

    const aggregates = await getVoteAggregates();
    const items: RankingOverallItem[] = aggregates
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

    return noStore({ tab: 'overall', generatedAt, items });
  } catch (error) {
    if (error instanceof RankingDatabaseUnavailableError) {
      return errorResponse(503, 'ランキングの保存先が設定されていません', 'DB_UNAVAILABLE');
    }
    console.error('ランキング集計エラー:', error);
    return errorResponse(500, 'ランキングの取得に失敗しました', 'SERVER_ERROR');
  }
}
