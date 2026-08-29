import { Suspense } from 'react';

import { PageLayout } from '@/components/page-layout';
import { StampCollectClient } from '@/components/stamp/stamp-collect-client';
import { Spinner } from '@/components/ui/spinner';

export const metadata = {
  title: 'スタンプ獲得 | こうよう祭 2026',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StampCollectPage() {
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
