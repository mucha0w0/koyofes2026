'use client';

import { CategorySection } from '@/components/events/category-section';
import { StampBoothCard } from '@/components/stamp/stamp-booth-card';

import type { StampBoothGroup } from '@/lib/types/stamp';

import { getStampCategoryIcon } from '@/lib/config/stampConfig';

interface StampCatalogSectionProps {
  groups: StampBoothGroup[];
  collectedSlugs: ReadonlySet<string>;
}

/** カテゴリ別のスタンプ帳。進捗帯と色を分ける */
export function StampCatalogSection({ groups, collectedSlugs }: StampCatalogSectionProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {groups.map((group) => (
            <CategorySection key={group.category} icon={getStampCategoryIcon(group.category)} title={group.label}>
              <div className="flex flex-wrap gap-4 p-4">
                {group.booths.map((booth) => (
                  <StampBoothCard key={booth.slug} booth={booth} collected={collectedSlugs.has(booth.slug)} />
                ))}
              </div>
            </CategorySection>
          ))}
        </div>
      </div>
    </section>
  );
}
