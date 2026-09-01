import { cmsPageMeta } from '@/components/cms/cms-page-meta';
import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { NewsDetailSkeleton } from '@/components/cms/skeletons/news-detail-skeleton';

const { title, subtitle } = cmsPageMeta.newsList;

export default function NewsDetailLoading() {
  return (
    <CmsPageLoading subtitle={subtitle} title={title}>
      <NewsDetailSkeleton />
    </CmsPageLoading>
  );
}
