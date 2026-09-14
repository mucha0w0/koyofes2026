import { Suspense } from 'react';

import { Spinner } from '@/components/common/spinner';
import { PageLayout } from '@/components/layout/page-layout';
import { StampCollectClient } from '@/components/stamp/stamp-collect-client';

import { isRankingEnabled } from '@/lib/config/rankingConfig';

export const metadata = {
  title: 'スタンプ獲得 | こうよう祭 2026',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StampCollectPage() {
  const rankingEnabled = isRankingEnabled();

  return (
    <PageLayout
      backHref="/stamp"
      backLabel="スタンプ帳に戻る"
      subtitle={
        rankingEnabled
          ? 'NFC / QR からのスタンプ獲得と、任意の星評価を行います'
          : 'NFC / QR からのスタンプ獲得処理を行います'
      }
      title="スタンプ獲得"
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spinner className="size-6" />
          </div>
        }
      >
        <StampCollectClient rankingEnabled={rankingEnabled} />
      </Suspense>
    </PageLayout>
  );
}
