import { RankingPreviewClient, RankingPreviewSection } from './ranking-preview-client';

import { isRankingEnabled } from '@/lib/config/rankingConfig';

export function RankingPreview() {
  if (!isRankingEnabled()) {
    return (
      <RankingPreviewSection>
        <div className="ink-shell bg-card p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">開催期間外です</p>
        </div>
      </RankingPreviewSection>
    );
  }

  return <RankingPreviewClient />;
}
