import { cmsPageMeta } from '@/components/cms/cms-page-meta';
import { CmsPageLoading } from '@/components/cms/cms-page-loading';
import { SectionListSkeleton } from '@/components/cms/skeletons/section-list-skeleton';

const { title, subtitle } = cmsPageMeta.part;

export default function PartLoading() {
  return (
    <CmsPageLoading subtitle={subtitle} title={title}>
      <SectionListSkeleton />
    </CmsPageLoading>
  );
}
