import { NewsDetailSkeleton } from '@/components/cms/skeletons/news-detail-skeleton';
import { PageLayout } from '@/components/layout/page-layout';

export default function NewsDetailLoading() {
  return (
    <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
      <NewsDetailSkeleton />
    </PageLayout>
  );
}
