import { NextResponse } from 'next/server';

import { getStampBoothBySlug } from '@/lib/stamp/booths';
import { createStampSignature } from '@/lib/stamp/signature';
import { resolveSlugFromToken } from '@/lib/stamp/token-map';
import type { StampCollectError, StampCollectSuccess } from '@/lib/types/stamp';

function errorResponse(status: number, error: string, code: StampCollectError['code']) {
  const body: StampCollectError = { error, code };
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, 'リクエストボディが不正です', 'BAD_REQUEST');
  }

  const token =
    body !== null && typeof body === 'object' && 'token' in body ? (body as { token: unknown }).token : undefined;

  if (typeof token !== 'string' || token.trim().length === 0) {
    return errorResponse(400, 'token が必要です', 'BAD_REQUEST');
  }

  let slug: string | null;
  try {
    slug = resolveSlugFromToken(token.trim());
  } catch (error) {
    console.error('スタンプトークン設定エラー:', error);
    return errorResponse(503, 'スタンプラリーの設定が完了していません', 'MISCONFIGURED');
  }

  if (!slug) {
    return errorResponse(400, '無効なトークンです', 'INVALID_TOKEN');
  }

  let booth;
  try {
    booth = await getStampBoothBySlug(slug);
  } catch (error) {
    console.error('スタンプブース取得エラー:', error);
    return errorResponse(500, 'ブース情報の取得に失敗しました', 'SERVER_ERROR');
  }

  if (!booth) {
    console.error(`トークンに対応する slug がスタンプ対象にありません: ${slug}`);
    return errorResponse(503, 'スタンプラリーの設定が不正です', 'MISCONFIGURED');
  }

  let signature: string;
  const obtainedAt = new Date().toISOString();
  try {
    signature = createStampSignature(booth.slug, obtainedAt);
  } catch (error) {
    console.error('スタンプ署名エラー:', error);
    return errorResponse(503, 'スタンプラリーの設定が完了していません', 'MISCONFIGURED');
  }

  const success: StampCollectSuccess = {
    slug: booth.slug,
    title: booth.title,
    icon: booth.icon,
    signature,
    obtainedAt,
  };

  return NextResponse.json(success);
}
