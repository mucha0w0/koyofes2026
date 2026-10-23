'use client';

import { CategorySection } from '@/components/events/category-section';
import { ExhibitionMaps } from '@/components/guide/exhibition-maps';
import { StampBoothCard } from '@/components/stamp/stamp-booth-card';

import type { StampBoothGroup } from '@/lib/types/stamp';

import { getStampCategoryIcon } from '@/lib/config/stampConfig';

interface StampCatalogSectionProps {
  groups: StampBoothGroup[];
  collectedSlugs: ReadonlySet<string>;
}

/** 展示マップと、カテゴリ別のスタンプ帳 */
export function StampCatalogSection({ groups, collectedSlugs }: StampCatalogSectionProps) {
  return (
    <section className="bg-paper-2">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className={groups.length > 0 ? 'mb-12 md:mb-16' : undefined}>
          <h2 className="mb-6 text-xl font-medium md:text-2xl">展示マップ</h2>
          <ExhibitionMaps />
        </div>
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
