import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

const HEADING_STRIPE_WIDTH_PX = 40;
const HEADING_STRIPE_COUNT = 96;

export function PageLayout({
  title,
  subtitle,
  children,
  backHref = '/',
  backLabel = 'トップページに戻る',
}: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      <div className="relative pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -bottom-7 z-0 overflow-hidden"
        >
          <div className="flex h-full">
            {Array.from({ length: HEADING_STRIPE_COUNT }, (_, index) => (
              <span
                key={index}
                className="relative h-full shrink-0 overflow-hidden rounded-b-full"
                style={{
                  width: HEADING_STRIPE_WIDTH_PX,
                  background:
                    index % 2 === 0
                      ? 'color-mix(in srgb, #74c2d9 20%, var(--festival-accent-soft))'
                      : 'var(--festival-accent-soft)',
                }}
              >
                <span className="absolute inset-x-0 bottom-0 h-1/4 bg-black/16" />
              </span>
            ))}
          </div>
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
      <div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-12">{children}</div>
    </main>
  );
}
