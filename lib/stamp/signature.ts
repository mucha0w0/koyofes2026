import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

function getSigningSecret(): string {
  const secret = process.env.STAMP_SIGNING_SECRET;
  if (!secret) {
    throw new Error('STAMP_SIGNING_SECRET が設定されていません');
  }
  return secret;
}

/** 署名対象ペイロード（slug + 取得時刻） */
export function buildStampPayload(slug: string, obtainedAt: string): string {
  return `${slug}:${obtainedAt}`;
}

/** HMAC-SHA256 署名を発行 */
export function createStampSignature(slug: string, obtainedAt: string): string {
  const hmac = createHmac('sha256', getSigningSecret());
  hmac.update(buildStampPayload(slug, obtainedAt));
  return hmac.digest('hex');
}

/** 署名を検証（改ざん検知） */
export function verifyStampSignature(slug: string, obtainedAt: string, signature: string): boolean {
  if (!slug || !obtainedAt || !signature) {
    return false;
  }

  try {
    const expected = createStampSignature(slug, obtainedAt);
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(signature, 'hex');

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}
