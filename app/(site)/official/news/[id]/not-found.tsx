import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { PageLayout } from '@/components/page-layout';

export default function NewsNotFound() {
  return (
    <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
      <div className="max-w-3xl text-center">
        <p className="text-muted-foreground mb-6">申し訳ございません。お探しのお知らせは見つかりませんでした。</p>
        <Link
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          href="/official/news"
        >
          <ArrowLeft className="h-4 w-4" />
          お知らせ一覧に戻る
        </Link>
      </div>
    </PageLayout>
  );
}
