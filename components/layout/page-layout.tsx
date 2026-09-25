import { RelatedLinks } from '@/components/layout/related-links';
import { InkTextLink } from '@/components/ui/ink-text-link';

import type { RelatedLinksConfig } from '@/lib/config/related-links';

import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  related?: RelatedLinksConfig;
  /** 本文をシェル幅の外に出し、全幅の交互地セクションを置ける */
  fullWidth?: boolean;
}

export function PageLayout({
  title,
  subtitle,
  children,
  backHref = '/',
  backLabel = 'トップページに戻る',
  related,
  fullWidth = false,
}: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      <div className="border-b-[length:calc(var(--shell-stroke)+var(--shell-oy))] border-ink bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-10 md:pt-16 md:pb-12">
          <InkTextLink arrow="left" className="mb-6" href={backHref}>
            {backLabel}
          </InkTextLink>
          <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-3 text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      {fullWidth ? (
        children
      ) : (
        <div className={cn('mx-auto w-full max-w-7xl px-4 pt-10 pb-12 md:pt-12', related && 'md:pb-16')}>
          {children}
        </div>
      )}
      {related ? (
        <RelatedLinks {...related} />
      ) : null}
    </main>
  );
}
