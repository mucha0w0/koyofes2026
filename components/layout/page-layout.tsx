import { InkTextLink } from '@/components/ui/ink-text-link';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageLayout({
  title,
  subtitle,
  children,
  backHref = '/',
  backLabel = 'トップページに戻る',
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
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-12 md:pt-12">{children}</div>
    </main>
  );
}
