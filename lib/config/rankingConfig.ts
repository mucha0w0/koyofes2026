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
  waitWindowMs: 15 * 60 * 1000,
  pollIntervalMs: 60 * 1000,
  bayes: {
    priorMean: 3.5,
    priorCount: 8,
  },
  waitLevels: [
    { value: 1, label: 'すぐ入れる' },
    { value: 2, label: '少し待ちそう' },
    { value: 3, label: '並びがある' },
    { value: 4, label: 'かなり待ちそう' },
  ],
} as const;

export type RankingTab = 'overall' | 'trend' | 'wait';

export type WaitLevel = (typeof RANKING_CONFIG.waitLevels)[number]['value'];

export function isWaitLevel(value: number): value is WaitLevel {
  return RANKING_CONFIG.waitLevels.some((level) => level.value === value);
}

export function getWaitLevelLabel(value: number): string {
  return RANKING_CONFIG.waitLevels.find((level) => level.value === value)?.label ?? '';
}

export function isRankingEnabled(): boolean {
  const value = process.env.RANKING_ENABLED ?? process.env.NEXT_PUBLIC_RANKING_ENABLED ?? '';
  return value.toLowerCase() === 'true' || value === '1';
}

export function isRankingDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
