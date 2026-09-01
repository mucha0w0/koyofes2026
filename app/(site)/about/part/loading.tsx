import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { SectionListSkeleton } from '@/components/cms/skeletons/section-list-skeleton';

export default function PartLoading() {
  return (
    <CmsPageLoading meta="part">
      <SectionListSkeleton />
    </CmsPageLoading>
  );
}
