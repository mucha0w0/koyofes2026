import { cmsPageMeta } from '@/components/cms/cms-page-meta';
import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { RecommendedListSkeleton } from '@/components/cms/skeletons/recommended-list-skeleton';

const { title, subtitle } = cmsPageMeta.eventRecommended;

export default function RecommendedEventsLoading() {
  return (
    <CmsPageLoading subtitle={subtitle} title={title}>
      <RecommendedListSkeleton />
    </CmsPageLoading>
  );
}
