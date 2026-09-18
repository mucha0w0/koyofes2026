import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
      <div className="bg-card py-12 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
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
      <div className="mx-auto w-full max-w-7xl px-4 py-12">{children}</div>
    </main>
  );
}
