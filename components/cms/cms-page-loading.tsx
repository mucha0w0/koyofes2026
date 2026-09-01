import { PageLayout } from '@/components/layout/page-layout';

interface CmsPageLoadingProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function CmsPageLoading({ title, subtitle, children }: CmsPageLoadingProps) {
  return (
    <PageLayout subtitle={subtitle} title={title}>
      {children}
    </PageLayout>
  );
}
