import { NavCardLink } from '@/components/layout/nav-card-link';

import { relatedBackgroundClass, resolveRelatedPages, type RelatedLinksConfig } from '@/lib/config/related-links';
import { cn } from '@/lib/utils';

export function RelatedLinks({ pages, background = 'paper', title = '関連ページ' }: RelatedLinksConfig) {
  const items = resolveRelatedPages(pages);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={cn('mt-auto scroll-mt-24', relatedBackgroundClass(background))} id="related">
      <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-16 md:pt-16 md:pb-20">
        <h2 className="text-2xl font-medium text-foreground">{title}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((link) => (
            <li key={link.href}>
              <NavCardLink
                description={link.description}
                descriptionClassName="sm:truncate"
                href={link.href}
                icon={link.icon}
                label={link.label}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
