import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { NewsListSkeleton } from '@/components/cms/skeletons/news-list-skeleton';

export default function NewsLoading() {
  return (
    <CmsPageLoading meta="newsList">
      <NewsListSkeleton />
    </CmsPageLoading>
  );
}
