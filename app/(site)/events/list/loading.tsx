import { cmsPageMeta } from '@/components/cms/cms-page-meta';
import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { EventListSkeleton } from '@/components/cms/skeletons/event-list-skeleton';

const { title, subtitle } = cmsPageMeta.eventList;

export default function EventListLoading() {
  return (
    <CmsPageLoading subtitle={subtitle} title={title}>
      <EventListSkeleton />
    </CmsPageLoading>
  );
}
