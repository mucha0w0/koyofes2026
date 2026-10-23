import { cmsPageMeta, type CmsPageLayoutKey } from '@/components/cms/cms-page-meta';
import { PageLayout } from '@/components/layout/page-layout';

import type { RelatedLinksConfig } from '@/lib/config/related-links';

interface CmsPageLayoutProps {
  meta: CmsPageLayoutKey;
  children: React.ReactNode;
  related?: RelatedLinksConfig;
  /** 関連ページの直前。関連ページが無いときは本文の直後 */
  illustration?: React.ReactNode;
}

export function CmsPageLayout({ meta, children, related, illustration }: CmsPageLayoutProps) {
  const { title, subtitle } = cmsPageMeta[meta];

  return (
    <PageLayout illustration={illustration} related={related} subtitle={subtitle} title={title}>
      {children}
    </PageLayout>
  );
}
