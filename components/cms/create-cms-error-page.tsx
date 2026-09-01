'use client';

import { CmsPageError } from '@/components/cms/cms-page-error';

interface CmsErrorPageConfig {
  title: string;
  subtitle?: string;
  errorMessage?: string;
}

interface CmsErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function createCmsErrorPage({ title, subtitle, errorMessage }: CmsErrorPageConfig) {
  return function CmsErrorPage({ reset }: CmsErrorPageProps) {
    return <CmsPageError message={errorMessage} reset={reset} subtitle={subtitle} title={title} />;
  };
}
