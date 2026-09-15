import { NextResponse } from 'next/server';

import type { RankingVoteError, RankingVoteSuccess } from '@/lib/types/ranking';

import { isRankingDatabaseConfigured, isRankingEnabled, isWaitLevel } from '@/lib/config/rankingConfig';
import { insertWait, RankingDatabaseUnavailableError, VoteRateLimitedError } from '@/lib/ranking/queries';
import { getOrCreateVisitorId } from '@/lib/ranking/visitor';
import { getStampBoothBySlug } from '@/lib/stamp/booths';
import { verifyStampSignature } from '@/lib/stamp/signature';

function errorResponse(status: number, error: string, code: RankingVoteError['code']) {
  const body: RankingVoteError = { error, code };
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  if (!isRankingEnabled()) {
    return errorResponse(403, 'ランキングは現在受け付けていません', 'RANKING_DISABLED');
  }

  if (!isRankingDatabaseConfigured()) {
    return errorResponse(503, 'ランキングの保存先が設定されていません', 'DB_UNAVAILABLE');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, 'リクエストボディが不正です', 'BAD_REQUEST');
  }

  if (body === null || typeof body !== 'object') {
    return errorResponse(400, 'リクエストボディが不正です', 'BAD_REQUEST');
  }

  const slug = 'slug' in body ? body.slug : undefined;
  const level = 'level' in body ? body.level : undefined;
  const signature = 'signature' in body ? body.signature : undefined;
  const obtainedAt = 'obtainedAt' in body ? body.obtainedAt : undefined;

  if (typeof slug !== 'string' || slug.trim().length === 0) {
    return errorResponse(400, 'slug が必要です', 'BAD_REQUEST');
  }
  if (typeof level !== 'number' || !Number.isInteger(level) || !isWaitLevel(level)) {
    return errorResponse(400, '待ちは 1〜4 の段階です', 'BAD_REQUEST');
  }
  if (typeof signature !== 'string' || typeof obtainedAt !== 'string') {
    return errorResponse(400, 'スタンプの証明が必要です', 'BAD_REQUEST');
  }

  const trimmedSlug = slug.trim();

  if (!verifyStampSignature(trimmedSlug, obtainedAt, signature)) {
    return errorResponse(400, 'スタンプの証明が無効です', 'INVALID_SIGNATURE');
  }

  let booth;
  try {
    booth = await getStampBoothBySlug(trimmedSlug);
  } catch (error) {
    console.error('待ち投票ブース取得エラー:', error);
    return errorResponse(500, 'ブース情報の取得に失敗しました', 'SERVER_ERROR');
  }

  if (!booth) {
    return errorResponse(400, 'スタンプ対象の企画ではありません', 'UNKNOWN_BOOTH');
  }

  try {
    const visitorId = await getOrCreateVisitorId();
    await insertWait(visitorId, trimmedSlug, level);
  } catch (error) {
    if (error instanceof VoteRateLimitedError) {
      return errorResponse(429, '連続した投票は少し待ってからお願いします', 'RATE_LIMITED');
    }
    if (error instanceof RankingDatabaseUnavailableError) {
      return errorResponse(503, 'ランキングの保存先が設定されていません', 'DB_UNAVAILABLE');
    }
    console.error('待ち投票の保存に失敗しました:', error);
    return errorResponse(500, '投票の保存に失敗しました', 'SERVER_ERROR');
  }

  const success: RankingVoteSuccess = { ok: true };
  return NextResponse.json(success);
}
