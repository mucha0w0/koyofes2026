import { NotFoundContent } from '@/components/layout/not-found-content';
import { SiteShell } from '@/components/layout/site-shell';

/**
 * ルート直下の 404（存在しない URL など）。
 * (site) セグメント外のため layout を継承できず、SiteShell で同等の枠を適用する。
 * (site) 内で notFound() が呼ばれた場合は app/(site)/not-found.tsx が使われる。
 */
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
