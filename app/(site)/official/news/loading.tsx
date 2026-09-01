import { NewsListSkeleton } from '@/components/cms/skeletons/news-list-skeleton';
import { PageLayout } from '@/components/layout/page-layout';

export default function NewsListLoading() {
  return (
    <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
      <NewsListSkeleton />
    </PageLayout>
  );
}
