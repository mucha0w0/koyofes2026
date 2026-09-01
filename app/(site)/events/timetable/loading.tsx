import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { TimetableSkeleton } from '@/components/cms/skeletons/timetable-skeleton';

export default function TimetableLoading() {
  return (
    <CmsPageLoading meta="eventTimetable">
      <TimetableSkeleton />
    </CmsPageLoading>
  );
}
