import type { MicroCMSSponsor } from '@/lib/microcms/types';

import { fetchMicroCMSList } from '@/lib/microcms/client';
import { getSponsorCategoryConfig, type SponsorItem, type SponsorSection } from '@/lib/types/sponsor';

export type { MicroCMSSponsor } from '@/lib/microcms/types';

export async function fetchSponsorsFromMicroCMS(): Promise<MicroCMSSponsor[]> {
  try {
    return await fetchMicroCMSList<MicroCMSSponsor>('sponsors');
  } catch (error) {
    console.error('microCMS 協賛データ取得エラー:', error);
    throw error;
  }
}

function getSponsorCategory(sponsor: MicroCMSSponsor): string {
  if (Array.isArray(sponsor.category)) {
    return sponsor.category[0] ?? 'Support';
  }
  return sponsor.category ?? 'Support';
}

export function transformMicroCMSSponsor(sponsor: MicroCMSSponsor): SponsorItem {
  return {
    id: sponsor.id,
    name: sponsor.name,
    icon: sponsor.icon?.url ?? '',
    description: sponsor.explanation,
    link: sponsor.link,
    category: getSponsorCategory(sponsor),
  };
}

export async function getSponsorSections(): Promise<SponsorSection[]> {
  const sponsors = await fetchSponsorsFromMicroCMS();
  const items = sponsors.map(transformMicroCMSSponsor);

  const grouped = new Map<string, SponsorItem[]>();

  for (const item of items) {
    const sectionItems = grouped.get(item.category) ?? [];
    sectionItems.push(item);
    grouped.set(item.category, sectionItems);
  }

  const categories = [...grouped.keys()].sort(
    (a, b) => getSponsorCategoryConfig(a).order - getSponsorCategoryConfig(b).order || a.localeCompare(b, 'ja'),
  );

  return categories
    .map((category) => {
      const config = getSponsorCategoryConfig(category);
      const sectionItems = grouped.get(category) ?? [];
      sectionItems.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

      return {
        id: config.id,
        label: config.label,
        labelEn: config.labelEn,
        items: sectionItems,
      };
    })
    .filter((section) => section.items.length > 0);
}
