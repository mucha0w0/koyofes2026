import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

const HEADING_STRIPE_COUNT = 11;

export function PageLayout({
  title,
  subtitle,
  children,
  backHref = '/',
  backLabel = 'トップページに戻る',
}: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -bottom-7 z-0 flex -mx-3.5">
          {Array.from({ length: HEADING_STRIPE_COUNT }, (_, index) => (
            <span
              key={index}
              className="relative min-w-0 flex-1 self-stretch -mx-2.5 overflow-hidden rounded-full"
              style={{
                background:
                  index % 2 === 0
                    ? 'color-mix(in srgb, #74c2d9 40%, var(--festival-accent-soft))'
                    : 'var(--festival-accent-soft)',
              }}
            >
              <span className="absolute inset-x-0 bottom-0 h-1/4 bg-black/16" />
            </span>
          ))}
        </div>
        <div className="relative z-10">
          <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-10 md:pt-16 md:pb-12">
            <Link
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 underline-offset-[0.2em] hover:underline"
              href={backHref}
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{title}</h1>
            {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 py-12">{children}</div>
    </main>
  );
}
