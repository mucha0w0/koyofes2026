import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

export function SiteShell({
  children,
  rankingEnabled = false,
}: Readonly<{ children: React.ReactNode; rankingEnabled?: boolean }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader rankingEnabled={rankingEnabled} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
