import { Suspense } from 'react';

import { Spinner } from '@/components/common/spinner';
import { PageLayout } from '@/components/layout/page-layout';
import { RelatedLinks } from '@/components/layout/related-links';
import { StampBook } from '@/components/stamp/stamp-book';
import { StampSuggestions } from '@/components/stamp/stamp-suggestions';

import { isRankingEnabled } from '@/lib/config/rankingConfig';
import { getStampBoothGroups } from '@/lib/stamp/booths';

export const metadata = {
  title: 'スタンプラリー | こうよう祭 2026',
  description:
    'クラス・学科展・有志展示のデジタルスタンプラリー。スタンプ帳の確認とふくびき参加券の引き換えができます。',
};

export default async function StampPage() {
  const groups = await getStampBoothGroups();
  const rankingEnabled = isRankingEnabled();
  const booths = groups.flatMap((group) => group.booths);

  return (
    <PageLayout fullWidth subtitle="スタンプを集めてふくびきに参加" title="スタンプラリー">
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spinner className="size-6" />
          </div>
        }
      >
        <StampBook groups={groups} rankingEnabled={rankingEnabled} />
      </Suspense>
      <div className="mt-auto">
        <StampSuggestions booths={booths} />
        <RelatedLinks background="paper-2" pages={['/events/list', '/ranking', '/events/recommended']} />
      </div>
    </PageLayout>
  );
}
