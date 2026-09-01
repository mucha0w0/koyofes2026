import type { MicroCMSEvent } from '@/lib/microcms/types';

import { formatTimeFromNumber } from '@/lib/event-time';
import { fetchMicroCMSList, type MicroCMSFetchCache } from '@/lib/microcms/client';
import { parseEventCategory, type Event } from '@/lib/types/event';

export type { MicroCMSEvent } from '@/lib/microcms/types';
export type { MicroCMSFetchCache } from '@/lib/microcms/client';

export function transformMicroCMSEvent(event: MicroCMSEvent): Event {
  return {
    slug: event.slug,
    title: event.title,
    catchphrase: event.catchphrase ?? '',
    icon: event.icon?.url ?? '',
    images: event.images.map((img) => img.url).filter((url) => url && url.length > 0),
    organization: event.organization,
    location: Array.isArray(event.location) ? event.location[0] || '' : event.location,
    floor: Array.isArray(event.floor) ? event.floor[0] || '' : event.floor,
    classroom: event.classroom,
    'time-day1': formatTimeFromNumber(event['time-day1']),
    'time-day2': formatTimeFromNumber(event['time-day2']),
    duration: event.duration ?? 0,
    participantsUL: event.participantsUL,
    participantsLL: event.participantsLL ?? 1,
    description: event.description,
    'organ-description': event['organ-description'],
    author: event.author,
    category: parseEventCategory(event.category, { slug: event.slug }),
  };
}

export async function fetchEventsFromMicroCMS(
  cacheMode: MicroCMSFetchCache = 'default',
): Promise<MicroCMSEvent[]> {
  try {
    return await fetchMicroCMSList<MicroCMSEvent>('events', cacheMode);
  } catch (error) {
    console.error('microCMS データ取得エラー:', error);
    throw error;
  }
}

export async function getEvents(cacheMode: MicroCMSFetchCache = 'default'): Promise<Event[]> {
  try {
    const microCMSEvents = await fetchEventsFromMicroCMS(cacheMode);
    return microCMSEvents.map(transformMicroCMSEvent);
  } catch (error) {
    console.error('イベント取得に失敗しました:', error);
    throw error;
  }
}

/** slug でイベントを1件取得（一覧 API より軽量） */
export async function getEventBySlug(
  slug: string,
  cacheMode: MicroCMSFetchCache = 'default',
): Promise<Event | null> {
  try {
    const microCMSEvents = await fetchMicroCMSList<MicroCMSEvent>('events', cacheMode, {
      filters: `slug[equals]${slug}`,
      limit: 1,
    });
    const raw = microCMSEvents[0];
    return raw ? transformMicroCMSEvent(raw) : null;
  } catch (error) {
    console.error(`イベント取得に失敗しました (slug=${slug}):`, error);
    throw error;
  }
}
