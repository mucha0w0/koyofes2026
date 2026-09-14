import { RankingPreviewClient } from './ranking-preview-client';

import { isRankingEnabled } from '@/lib/config/rankingConfig';

export function RankingPreview() {
  if (!isRankingEnabled()) {
    return null;
  }

  return <RankingPreviewClient />;
}
