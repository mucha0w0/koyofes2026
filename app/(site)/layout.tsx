import { SiteShell } from '@/components/layout/site-shell';

import { isRankingEnabled } from '@/lib/config/rankingConfig';

/**
 * 時間では再検証しない。正の秒数にすると配下の全ページがその間隔で ISR Write になる。
 * CMS の更新は `/api/revalidate`（microCMS Webhook）が関係するタグとパスだけを無効化する。
 */
export const revalidate = false;

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell rankingEnabled={isRankingEnabled()}>{children}</SiteShell>;
}
