import { RankingPreviewGate } from './ranking-preview-client';

import { isRankingAggregationOpen, isRankingEnabled } from '@/lib/config/rankingConfig';

export function RankingPreview() {
  return <RankingPreviewGate rankingEnabled={isRankingEnabled()} serverOpen={isRankingAggregationOpen()} />;
}
