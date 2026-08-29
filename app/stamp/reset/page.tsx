import { Suspense } from 'react';

import { PageLayout } from '@/components/page-layout';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { StampResetClient } from '@/components/stamp/stamp-reset-client';
import { Spinner } from '@/components/ui/spinner';

export const metadata = {
  title: 'スタンプ記録リセット（デバッグ用） | こうよう祭 2026',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StampResetPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout
        backHref="/stamp"
        backLabel="スタンプ帳に戻る"
        subtitle="デバッグ用：この端末のスタンプ記録を消去します"
        title="スタンプリセット"
      >
        <Suspense
          fallback={
            <div className="flex justify-center py-16">
              <Spinner className="size-6" />
            </div>
          }
        >
          <StampResetClient />
        </Suspense>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
