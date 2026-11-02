import { Suspense } from 'react';

import { Spinner } from '@/components/common/spinner';
import { PageLayout } from '@/components/layout/page-layout';
import { StampCollectClient } from '@/components/stamp/stamp-collect-client';

import { isStampCollectionOpen } from '@/lib/config/stampConfig';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'スタンプ獲得 | こうよう祭 2026',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StampCollectPage() {
  if (!isStampCollectionOpen()) {
    return (
      <PageLayout backHref="/stamp" backLabel="スタンプ帳に戻る" title="スタンプ獲得">
        <div className="ink-shell mx-auto max-w-lg bg-card p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">スタンプ集計期間は終了しました</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      backHref="/stamp"
      backLabel="スタンプ帳に戻る"
      subtitle="NFC / QR からのスタンプ獲得処理を行います"
      title="スタンプ獲得"
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spinner className="size-6" />
          </div>
        }
      >
        <StampCollectClient />
      </Suspense>
    </PageLayout>
  );
}
