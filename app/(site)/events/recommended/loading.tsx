import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { RecommendedListSkeleton } from '@/components/cms/skeletons/recommended-list-skeleton';

export default function RecommendedEventsLoading() {
  return (
    <CmsPageLoading meta="eventRecommended">
      <RecommendedListSkeleton />
    </CmsPageLoading>
  );
}
