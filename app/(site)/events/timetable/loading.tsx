import { cmsPageMeta } from '@/components/cms/cms-page-meta';
import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { TimetableSkeleton } from '@/components/cms/skeletons/timetable-skeleton';

const { title, subtitle } = cmsPageMeta.eventTimetable;

export default function TimetableLoading() {
  return (
    <CmsPageLoading subtitle={subtitle} title={title}>
      <TimetableSkeleton />
    </CmsPageLoading>
  );
}
