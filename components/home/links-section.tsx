import Link from 'next/link';

import { getNavLinkCardSections } from '@/lib/config/nav';
import { getPaletteForNavSection } from '@/lib/config/palette';
import { cn } from '@/lib/utils';

const linkSections = getNavLinkCardSections();

export function LinksSection() {
  return (
    <section>
      <div
        className={cn(
          'grid md:grid-cols-2',
          linkSections.length >= 3 && 'xl:grid-cols-3',
        )}
      >
        {linkSections.map((section) => (
          <div
            key={section.id}
            className="bg-background px-4 py-16 md:py-24"
            data-palette={getPaletteForNavSection(section.id)}
          >
            <div className="mx-auto w-full max-w-xl space-y-4">
              <h2 className="text-center text-xl font-medium md:text-2xl">{section.label}</h2>
              <div className="grid gap-3">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    className="ink-shell ink-lift group flex items-center gap-4 bg-card p-4"
                    href={item.href}
                  >
                    <span aria-hidden className="size-2 shrink-0 rounded-[4px] bg-ink" />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
