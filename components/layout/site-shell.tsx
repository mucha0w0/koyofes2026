import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SitePalette } from '@/components/layout/site-palette';

export function SiteShell({
  children,
  rankingEnabled = false,
}: Readonly<{ children: React.ReactNode; rankingEnabled?: boolean }>) {
  return (
    <SitePalette>
      <SiteHeader rankingEnabled={rankingEnabled} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </SitePalette>
  );
}
