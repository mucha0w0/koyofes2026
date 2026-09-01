import { cmsPageMeta, type CmsPageLayoutKey } from '@/components/cms/cms-page-meta';
import { PageLayout } from '@/components/layout/page-layout';

interface CmsPageLayoutProps {
  meta: CmsPageLayoutKey;
  children: React.ReactNode;
}

export function CmsPageLayout({ meta, children }: CmsPageLayoutProps) {
  const { title, subtitle } = cmsPageMeta[meta];

  return (
    <PageLayout subtitle={subtitle} title={title}>
      {children}
    </PageLayout>
  );
}
