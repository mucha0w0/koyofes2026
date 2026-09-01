import { CmsPageLayout } from '@/components/cms/cms-page-layout';
import type { CmsPageLayoutKey } from '@/components/cms/cms-page-meta';

interface CmsPageLoadingProps {
  meta: CmsPageLayoutKey;
  children: React.ReactNode;
}

export function CmsPageLoading({ meta, children }: CmsPageLoadingProps) {
  return <CmsPageLayout meta={meta}>{children}</CmsPageLayout>;
}
