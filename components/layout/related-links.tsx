import Link from 'next/link';

import {
  relatedBackgroundClass,
  relatedBackgroundPalette,
  resolveRelatedPages,
  type RelatedBackground,
  type RelatedPageHref,
} from '@/lib/config/related-links';
import { cn } from '@/lib/utils';

export interface RelatedLinksProps {
  pages: readonly RelatedPageHref[];
  background?: RelatedBackground;
  title?: string;
}

export function RelatedLinks({ pages, background = 'paper', title = '関連案内' }: RelatedLinksProps) {
  const items = resolveRelatedPages(pages);

  if (items.length === 0) {
    return null;
  }

  const palette = relatedBackgroundPalette(background);
  const isTinted = background !== 'paper';

  return (
    <section
      className={cn('scroll-mt-24', relatedBackgroundClass(background))}
      data-palette={palette}
      id="related"
    >
      <div
        className={cn(
          'mx-auto w-full max-w-7xl space-y-6 px-4',
          isTinted ? 'py-12 md:py-16' : 'pt-12 pb-12 md:pt-16',
        )}
      >
        <h2 className="text-2xl font-medium text-foreground">{title}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((link) => (
            <li key={link.href}>
              <Link className="ink-shell ink-lift group flex items-center gap-4 bg-card p-4" href={link.href}>
                <span aria-hidden className="size-2 shrink-0 rounded-[4px] bg-ink" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{link.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{link.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
