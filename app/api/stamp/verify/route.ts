import { NextResponse } from 'next/server';

import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import { getStampBooths } from '@/lib/stamp/booths';
import { verifyStampSignature } from '@/lib/stamp/signature';
import type { StampEntry, StampVerifySuccess } from '@/lib/types/stamp';

function isStampEntry(value: unknown): value is StampEntry {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.slug === 'string' &&
    typeof entry.signature === 'string' &&
    typeof entry.obtainedAt === 'string'
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストボディが不正です' }, { status: 400 });
  }

  const stampsRaw =
    body !== null && typeof body === 'object' && 'stamps' in body
      ? (body as { stamps: unknown }).stamps
      : undefined;

  if (!Array.isArray(stampsRaw)) {
    return NextResponse.json({ error: 'stamps 配列が必要です' }, { status: 400 });
  }

  const entries = stampsRaw.filter(isStampEntry);

  let knownSlugs: Set<string>;
  try {
    const booths = await getStampBooths();
    knownSlugs = new Set(booths.map((booth) => booth.slug));
  } catch (error) {
    console.error('スタンプブース取得エラー:', error);
    return NextResponse.json({ error: 'ブース情報の取得に失敗しました' }, { status: 500 });
  }

  const validSlugs: string[] = [];
  for (const entry of entries) {
    if (!knownSlugs.has(entry.slug)) {
      continue;
    }
    if (!verifyStampSignature(entry.slug, entry.obtainedAt, entry.signature)) {
      continue;
    }
    if (!validSlugs.includes(entry.slug)) {
      validSlugs.push(entry.slug);
    }
  }

  const requiredCount = STAMP_CONFIG.clearConditions.requiredStampCount;
  const result: StampVerifySuccess = {
    validSlugs,
    validCount: validSlugs.length,
    requiredCount,
    isCleared: validSlugs.length >= requiredCount,
  };

  return NextResponse.json(result);
}
