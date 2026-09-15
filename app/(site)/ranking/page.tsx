import { PageLayout } from '@/components/layout/page-layout';
import { RankingBoard } from '@/components/ranking/ranking-board';

import { isRankingEnabled } from '@/lib/config/rankingConfig';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'リアルタイムランキング | こうよう祭 2026',
  description: 'クラス・学科展・有志展示の総合順位、トレンド、いまの並びの目安。',
};

export default function RankingPage() {
  if (!isRankingEnabled()) {
    return (
      <PageLayout subtitle="開催期間外です" title="リアルタイムランキング">
        <div className="mx-auto max-w-3xl bg-card p-6">
          <p className="text-sm text-muted-foreground leading-loose tracking-wider">
            ランキングは文化祭開催期間のみ公開します。
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout subtitle="星の総合評価、いま人が多い企画、並びの目安" title="リアルタイムランキング">
      <RankingBoard />
    </PageLayout>
  );
}
