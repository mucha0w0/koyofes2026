import type { MicroCMSEvent, MicroCMSSponsor } from '@/lib/microcms/types';

import { fetchMicroCMSList } from '@/lib/microcms/client';
import { deliverCmsImage } from '@/lib/microcms/delivered-image';
import { FOOD_TRUCK_SECTION, SUPPORT_SECTION, type SponsorItem, type SponsorSection } from '@/lib/types/sponsor';

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

export function transformMicroCMSSponsor(sponsor: MicroCMSSponsor): SponsorItem {
  return {
    id: sponsor.id,
    name: sponsor.name,
    icon: deliverCmsImage(sponsor.icon?.url),
    description: sponsor.explanation,
    link: sponsor.link,
  };
}

function isFoodTruckEvent(event: MicroCMSEvent): boolean {
  return event.category.includes(FOOD_TRUCK_EVENT_CATEGORY);
}

export function transformFoodTruckEvent(event: MicroCMSEvent): SponsorItem {
  const catchphrase = event.catchphrase?.split('\n')[0]?.trim() ?? '';

  return {
    id: event.id,
    name: event.title,
    icon: deliverCmsImage(event.icon?.url),
    description: catchphrase || event.organization || '',
    href: event.slug ? `/events/${event.slug}` : undefined,
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

export async function getSponsorSections(): Promise<SponsorSection[]> {
  const [sponsors, foodTruckEvents] = await Promise.all([fetchSponsorsFromMicroCMS(), fetchFoodTruckEvents()]);

  const supportItems = sponsors.map(transformMicroCMSSponsor);
  supportItems.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  const sections: SponsorSection[] = [];

  if (supportItems.length > 0) {
    sections.push({
      ...SUPPORT_SECTION,
      items: supportItems,
    });
  }

  if (foodTruckEvents.length > 0) {
    sections.push({
      ...FOOD_TRUCK_SECTION,
      items: foodTruckEvents.map(transformFoodTruckEvent),
    });
  }

  return sections;
}
