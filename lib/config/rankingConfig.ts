/**
 * 企画展リアルタイムランキングの定数。
 * 開催時のみ RANKING_ENABLED=true にする（ナビ・投票・API）。
 */
export const RANKING_CONFIG = {
  visitorCookieName: 'koyosai_vid',
  visitorCookieMaxAgeSeconds: 60 * 60 * 24 * 30,
  trendWindowMs: 20 * 60 * 1000,
  visitDebounceMs: 10 * 60 * 1000,
  voteDebounceMs: 30 * 1000,
  pollIntervalMs: 15 * 1000,
  bayes: {
    priorMean: 3.5,
    priorCount: 8,
  },
} as const;

export type RankingTab = 'overall' | 'trend';

export function isRankingEnabled(): boolean {
  const value = process.env.RANKING_ENABLED ?? process.env.NEXT_PUBLIC_RANKING_ENABLED ?? '';
  return value.toLowerCase() === 'true' || value === '1';
}

export function isRankingDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
