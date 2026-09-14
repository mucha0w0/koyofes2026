import { SiteShell } from '@/components/layout/site-shell';

import { isRankingEnabled } from '@/lib/config/rankingConfig';

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
  return <SiteShell rankingEnabled={isRankingEnabled()}>{children}</SiteShell>;
}
