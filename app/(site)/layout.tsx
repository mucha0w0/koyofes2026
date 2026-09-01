import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

import { CMS_REVALIDATE_SECONDS } from '@/lib/cache';

/** CMS ページ共通: ISR（間隔は lib/cache.ts） */
export const revalidate = CMS_REVALIDATE_SECONDS;

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
