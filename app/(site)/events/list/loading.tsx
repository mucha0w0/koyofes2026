import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { EventListSkeleton } from '@/components/cms/skeletons/event-list-skeleton';

export default function EventListLoading() {
  return (
    <CmsPageLoading meta="eventList">
      <EventListSkeleton />
    </CmsPageLoading>
  );
}
