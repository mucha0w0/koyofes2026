import 'server-only';

import { cookies } from 'next/headers';

import { RANKING_CONFIG } from '@/lib/config/rankingConfig';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isVisitorId(value: string): boolean {
  return UUID_RE.test(value);
}

/** 既存 Cookie を返すか、新規 UUID を発行して httpOnly Cookie に保存する。 */
export async function getOrCreateVisitorId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(RANKING_CONFIG.visitorCookieName)?.value;
  if (existing && isVisitorId(existing)) {
    return existing;
  }

  const id = crypto.randomUUID();
  store.set({
    name: RANKING_CONFIG.visitorCookieName,
    value: id,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: RANKING_CONFIG.visitorCookieMaxAgeSeconds,
  });
  return id;
}
