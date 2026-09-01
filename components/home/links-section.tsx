import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { getNavLinkCardSections } from '@/lib/config/nav';

const linkSections = getNavLinkCardSections();

export function LinksSection() {
  return (
    <section className="pt-16 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {linkSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium md:text-2xl">{section.label}</h2>
              </div>
              <div className="grid gap-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      className="group flex items-center gap-4 bg-card p-4 transition-opacity hover:opacity-80"
                      href={item.href}
                    >
                      <div className="bg-muted p-2 text-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
