import type { MicroCMSEvent, MicroCMSSponsor } from '@/lib/microcms/types';

import { fetchMicroCMSList } from '@/lib/microcms/client';
import {
  getSponsorCategoryConfig,
  SPONSOR_CATEGORY_CONFIG,
  type SponsorItem,
  type SponsorSection,
} from '@/lib/types/sponsor';

/** sponsors API に残っている旧キッチンカー区分。一覧には出さない */
export const LEGACY_FOOD_TRUCK_SPONSOR_CATEGORY = 'Food Track';

/** events.category のキッチンカー。企画定義の ID */
const FOOD_TRUCK_EVENT_CATEGORY = 'food-truck';

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

export function isLegacyFoodTruckSponsor(item: Pick<SponsorItem, 'category'>): boolean {
  return item.category === LEGACY_FOOD_TRUCK_SPONSOR_CATEGORY;
}

function isFoodTruckEvent(event: MicroCMSEvent): boolean {
  return event.category.includes(FOOD_TRUCK_EVENT_CATEGORY);
}

export function transformFoodTruckEvent(event: MicroCMSEvent): SponsorItem {
  const catchphrase = event.catchphrase?.split('\n')[0]?.trim() ?? '';

  return {
    id: event.id,
    name: event.title,
    icon: event.icon?.url ?? '',
    description: catchphrase || event.organization || '',
    href: event.slug ? `/events/${event.slug}` : undefined,
    category: FOOD_TRUCK_EVENT_CATEGORY,
  };
}

async function fetchFoodTruckEvents(): Promise<MicroCMSEvent[]> {
  try {
    const events = await fetchMicroCMSList<MicroCMSEvent>('events', 'default', {
      filters: `category[contains]${FOOD_TRUCK_EVENT_CATEGORY}`,
    });
    return events.filter(isFoodTruckEvent);
  } catch (error) {
    console.error('microCMS キッチンカー取得エラー:', error);
    throw error;
  }
}

function sectionOrder(sectionId: string): number {
  const config = Object.values(SPONSOR_CATEGORY_CONFIG).find((entry) => entry.id === sectionId);
  return config?.order ?? 999;
}

export async function getSponsorSections(): Promise<SponsorSection[]> {
  const [sponsors, foodTruckEvents] = await Promise.all([fetchSponsorsFromMicroCMS(), fetchFoodTruckEvents()]);
  const items = sponsors.map(transformMicroCMSSponsor).filter((item) => !isLegacyFoodTruckSponsor(item));

  const grouped = new Map<string, SponsorItem[]>();

  for (const item of items) {
    const sectionItems = grouped.get(item.category) ?? [];
    sectionItems.push(item);
    grouped.set(item.category, sectionItems);
  }

  const categories = [...grouped.keys()].sort(
    (a, b) => getSponsorCategoryConfig(a).order - getSponsorCategoryConfig(b).order || a.localeCompare(b, 'ja'),
  );

  const sections = categories.map((category) => {
    const config = getSponsorCategoryConfig(category);
    const sectionItems = grouped.get(category) ?? [];
    sectionItems.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

    return {
      id: config.id,
      label: config.label,
      labelEn: config.labelEn,
      items: sectionItems,
    };
  });

  const foodTruckConfig = SPONSOR_CATEGORY_CONFIG['Food Track'];
  if (foodTruckEvents.length > 0) {
    sections.push({
      id: foodTruckConfig.id,
      label: foodTruckConfig.label,
      labelEn: foodTruckConfig.labelEn,
      items: foodTruckEvents.map(transformFoodTruckEvent),
    });
  }

  return sections
    .filter((section) => section.items.length > 0)
    .sort((a, b) => sectionOrder(a.id) - sectionOrder(b.id) || a.label.localeCompare(b.label, 'ja'));
}
