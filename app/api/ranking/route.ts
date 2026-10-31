import { NextResponse } from 'next/server';

import type { RankingApiError, RankingResponse } from '@/lib/types/ranking';

import { isRankingDatabaseConfigured, isRankingEnabled } from '@/lib/config/rankingConfig';
import { listOverallRanking, listTrendRanking, listWaitRanking, loadRankingBooths } from '@/lib/ranking/board';
import { RankingDatabaseUnavailableError } from '@/lib/ranking/queries';

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
  const tabParam = searchParams.get('tab');
  const tab = tabParam === 'trend' ? 'trend' : tabParam === 'wait' ? 'wait' : 'overall';

  let boothBySlug;
  try {
    boothBySlug = await loadRankingBooths();
  } catch (error) {
    console.error('ランキングブース取得エラー:', error);
    return errorResponse(500, '企画情報の取得に失敗しました', 'SERVER_ERROR');
  }

  const generatedAt = new Date().toISOString();

  try {
    if (tab === 'trend') {
      const items = await listTrendRanking(boothBySlug);
      return noStore({ tab: 'trend', generatedAt, items });
    }

    if (tab === 'wait') {
      const items = await listWaitRanking(boothBySlug);
      return noStore({ tab: 'wait', generatedAt, items });
    }

    const items = await listOverallRanking(boothBySlug);
    return noStore({ tab: 'overall', generatedAt, items });
  } catch (error) {
    if (error instanceof RankingDatabaseUnavailableError) {
      return errorResponse(503, 'ランキングの保存先が設定されていません', 'DB_UNAVAILABLE');
    }
    console.error('ランキング集計エラー:', error);
    return errorResponse(500, 'ランキングの取得に失敗しました', 'SERVER_ERROR');
  }
}
