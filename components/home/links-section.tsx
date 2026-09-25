import { NavCardLink } from '@/components/layout/nav-card-link';

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
                <NavCardLink
                  key={item.href}
                  description={item.description}
                  descriptionClassName="truncate"
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
