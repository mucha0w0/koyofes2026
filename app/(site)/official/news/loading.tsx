import { cmsPageMeta } from '@/components/cms/cms-page-meta';
import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { NewsListSkeleton } from '@/components/cms/skeletons/news-list-skeleton';

const { title, subtitle } = cmsPageMeta.newsList;

export default function NewsListLoading() {
  return (
    <CmsPageLoading subtitle={subtitle} title={title}>
      <NewsListSkeleton />
    </CmsPageLoading>
  );
}
