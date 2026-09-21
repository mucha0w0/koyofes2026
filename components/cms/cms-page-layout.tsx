import { cmsPageMeta, type CmsPageLayoutKey } from '@/components/cms/cms-page-meta';
import { PageLayout } from '@/components/layout/page-layout';

import type { RelatedLinksConfig } from '@/lib/config/related-links';

interface CmsPageLayoutProps {
  meta: CmsPageLayoutKey;
  children: React.ReactNode;
  related?: RelatedLinksConfig;
}

export function CmsPageLayout({ meta, children, related }: CmsPageLayoutProps) {
  const { title, subtitle } = cmsPageMeta[meta];

  return (
    <PageLayout related={related} subtitle={subtitle} title={title}>
      {children}
    </PageLayout>
  );
}
