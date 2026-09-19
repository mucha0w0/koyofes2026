import { PageLayout } from '@/components/layout/page-layout';
import { InkTextLink } from '@/components/ui/ink-text-link';

export default function NewsNotFound() {
  return (
    <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-muted-foreground mb-6">申し訳ございません。お探しのお知らせは見つかりませんでした。</p>
        <InkTextLink arrow="left" href="/official/news">
          お知らせ一覧に戻る
        </InkTextLink>
      </div>
    </PageLayout>
  );
}
