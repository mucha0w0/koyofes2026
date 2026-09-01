import { Suspense } from 'react';

import { Spinner } from '@/components/common/spinner';
import { PageLayout } from '@/components/layout/page-layout';
import { StampBook } from '@/components/stamp/stamp-book';

import { getStampBoothGroups } from '@/lib/stamp/booths';

export const metadata = {
  title: 'スタンプラリー | こうよう祭 2026',
  description:
    'クラス・学科展・有志展示のデジタルスタンプラリー。スタンプ帳の確認とふくびき参加券の引き換えができます。',
};

export default async function StampPage() {
  const groups = await getStampBoothGroups();

  return (
    <PageLayout subtitle="スタンプを集めてふくびきに参加" title="スタンプラリー">
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spinner className="size-6" />
          </div>
        }
      >
        <StampBook groups={groups} />
      </Suspense>
    </PageLayout>
  );
}
