import { NextResponse } from 'next/server';

import type { RankingApiError, RankingPodiumResponse } from '@/lib/types/ranking';

import { isRankingAggregationOpen, isRankingDatabaseConfigured, isRankingEnabled } from '@/lib/config/rankingConfig';
import { getRankingPodium } from '@/lib/ranking/board';
import { RankingDatabaseUnavailableError } from '@/lib/ranking/queries';

export const dynamic = 'force-dynamic';

/** 展示ページが開くたびに集計しない。ランキング画面の更新間隔に合わせる。 */
const PODIUM_CACHE_MS = 30_000;

type PodiumCache = {
  expiresAt: number;
  body: RankingPodiumResponse;
};

const globalForPodium = globalThis as typeof globalThis & {
  koyofesRankingPodium?: PodiumCache;
  koyofesRankingPodiumInflight?: Promise<RankingPodiumResponse>;
};

function errorResponse(status: number, error: string, code: RankingApiError['code']) {
  const body: RankingApiError = { error, code };
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function emptyPodium() {
  const body: RankingPodiumResponse = { overall: [], trend: [] };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}

async function readPodium(): Promise<RankingPodiumResponse> {
  const now = Date.now();
  const cached = globalForPodium.koyofesRankingPodium;
  if (cached && cached.expiresAt > now) {
    return cached.body;
  }

  if (!globalForPodium.koyofesRankingPodiumInflight) {
    globalForPodium.koyofesRankingPodiumInflight = getRankingPodium(now)
      .then((body) => {
        globalForPodium.koyofesRankingPodium = { body, expiresAt: Date.now() + PODIUM_CACHE_MS };
        return body;
      })
      .finally(() => {
        globalForPodium.koyofesRankingPodiumInflight = undefined;
      });
  }

  return globalForPodium.koyofesRankingPodiumInflight;
}

export async function GET() {
  if (!isRankingEnabled()) {
    return errorResponse(403, 'ランキングは現在公開していません', 'RANKING_DISABLED');
  }

  if (!isRankingDatabaseConfigured()) {
    return errorResponse(503, 'ランキングの保存先が設定されていません', 'DB_UNAVAILABLE');
  }

  if (!isRankingAggregationOpen()) {
    return emptyPodium();
  }

  try {
    const body = await readPodium();
    return NextResponse.json(body, {
      headers: {
        'Cache-Control': `public, max-age=${PODIUM_CACHE_MS / 1000}, s-maxage=${PODIUM_CACHE_MS / 1000}`,
      },
    });
  } catch (error) {
    if (error instanceof RankingDatabaseUnavailableError) {
      return errorResponse(503, 'ランキングの保存先が設定されていません', 'DB_UNAVAILABLE');
    }
    console.error('ランキング順位表示の集計エラー:', error);
    return errorResponse(500, 'ランキングの取得に失敗しました', 'SERVER_ERROR');
  }
}
