import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

/**
 * CMS ページ共通 ISR（秒）。fetch 側は lib/cache.ts の CMS_REVALIDATE_SECONDS と同値にすること。
 * Next.js の segment config はリテラル必須のため、ここでは直書きしている。
 */
export const revalidate = 60;

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
