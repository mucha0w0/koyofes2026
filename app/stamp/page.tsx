import { Suspense } from 'react';

import { PageLayout } from '@/components/page-layout';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { StampBook } from '@/components/stamp/stamp-book';
import { Spinner } from '@/components/ui/spinner';

import { getStampBoothGroups } from '@/lib/stamp/booths';

export const metadata = {
  title: 'スタンプラリー | こうよう祭 2026',
  description: 'クラス・学科・有志展示のデジタルスタンプラリー。スタンプ帳の確認とふくびき参加券の引き換えができます。',
};

export default async function StampPage() {
  const groups = await getStampBoothGroups();

  return (
    <>
      <SiteHeader />
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
      <SiteFooter />
    </>
  );
}
