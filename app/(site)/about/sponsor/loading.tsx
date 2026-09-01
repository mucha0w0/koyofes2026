import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { SectionListSkeleton } from '@/components/cms/skeletons/section-list-skeleton';

export default function SponsorLoading() {
  return (
    <CmsPageLoading meta="sponsor">
      <SectionListSkeleton />
    </CmsPageLoading>
  );
}
