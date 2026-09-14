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
