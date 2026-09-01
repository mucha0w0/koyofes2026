import { Suspense } from 'react';

import { Spinner } from '@/components/common/spinner';
import { PageLayout } from '@/components/layout/page-layout';
import { StampResetClient } from '@/components/stamp/stamp-reset-client';

export const metadata = {
  title: 'スタンプ記録リセット（デバッグ用） | こうよう祭 2026',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StampResetPage() {
  return (
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
  );
}
