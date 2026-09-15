import { RANKING_CONFIG } from '@/lib/config/rankingConfig';

/** 少数票の 5 点盛りを抑えるベイズ平均 */
export function bayesianScore(starSum: number, voteCount: number): number {
  if (voteCount <= 0) {
    return RANKING_CONFIG.bayes.priorMean;
  }
  const { priorMean, priorCount } = RANKING_CONFIG.bayes;
  return (priorCount * priorMean + starSum) / (priorCount + voteCount);
}

export function averageStars(starSum: number, voteCount: number): number {
  if (voteCount <= 0) {
    return 0;
  }
  return starSum / voteCount;
}

/** 待ち投票の線形時間荷重。窓の端は 0。 */
export function waitWeight(ageMs: number, windowMs: number): number {
  if (windowMs <= 0 || ageMs >= windowMs) {
    return 0;
  }
  if (ageMs <= 0) {
    return 1;
  }
  return (windowMs - ageMs) / windowMs;
}

export function weightedWaitScore(
  reports: { level: number; ageMs: number }[],
  windowMs: number,
): number | null {
  let weightedSum = 0;
  let weightSum = 0;
  for (const report of reports) {
    const weight = waitWeight(report.ageMs, windowMs);
    if (weight <= 0) {
      continue;
    }
    weightedSum += report.level * weight;
    weightSum += weight;
  }
  if (weightSum <= 0) {
    return null;
  }
  return weightedSum / weightSum;
}

export function roundWaitLevel(score: number): 1 | 2 | 3 | 4 {
  const rounded = Math.round(score);
  if (rounded <= 1) {
    return 1;
  }
  if (rounded >= 4) {
    return 4;
  }
  return rounded as 2 | 3;
}

export function formatWaitAgo(lastVotedAt: string, generatedAt: string): string {
  const ageMs = new Date(generatedAt).getTime() - new Date(lastVotedAt).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 60 * 1000) {
    return 'たった今';
  }
  return `${Math.floor(ageMs / 60 / 1000)}分前`;
}
