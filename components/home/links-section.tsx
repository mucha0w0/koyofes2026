import Link from 'next/link';

import { getNavLinkCardSections } from '@/lib/config/nav';
import { cn } from '@/lib/utils';

const linkSections = getNavLinkCardSections();

export function LinksSection() {
  return (
    <section className="bg-paper-2" data-palette="sky">
      <div
        className={cn(
          'mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:py-24',
          linkSections.length >= 3 && 'xl:grid-cols-3',
        )}
      >
        {linkSections.map((section) => (
          <div key={section.id} className="space-y-4">
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
        ))}
      </div>
    </section>
  );
}
