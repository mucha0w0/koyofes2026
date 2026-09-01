import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { NewsDetailSkeleton } from '@/components/cms/skeletons/news-detail-skeleton';

export default function NewsDetailLoading() {
  return (
    <CmsPageLoading meta="newsList">
      <NewsDetailSkeleton />
    </CmsPageLoading>
  );
}
