import { cache } from 'react';

import type { MicroCMSEvent } from '@/lib/microcms/types';

import { formatTimeFromNumber } from '@/lib/event-time';
import { fetchMicroCMSList, type MicroCMSFetchCache } from '@/lib/microcms/client';
import { eventSlugTag } from '@/lib/microcms/tags';
import { parseEventCategory, type Event } from '@/lib/types/event';

export type { MicroCMSEvent } from '@/lib/microcms/types';
export type { MicroCMSFetchCache } from '@/lib/microcms/client';

function transformMicroCMSEvent(event: MicroCMSEvent): Event {
  return {
    slug: event.slug,
    title: event.title,
    catchphrase: event.catchphrase ?? '',
    icon: event.icon?.url ?? '',
    images: (event.images ?? []).map((img) => img.url).filter((url) => url && url.length > 0),
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

async function fetchEventsFromMicroCMS(cacheMode: MicroCMSFetchCache = 'default'): Promise<MicroCMSEvent[]> {
  try {
    return await fetchMicroCMSList<MicroCMSEvent>('events', cacheMode);
  } catch (error) {
    console.error('microCMS データ取得エラー:', error);
    throw error;
  }
}

/** 全イベント一覧（リクエスト内 dedupe） */
export const getEvents = cache(async (cacheMode: MicroCMSFetchCache = 'default'): Promise<Event[]> => {
  try {
    const microCMSEvents = await fetchEventsFromMicroCMS(cacheMode);
    return microCMSEvents.map(transformMicroCMSEvent);
  } catch (error) {
    console.error('イベント取得に失敗しました:', error);
    throw error;
  }
});

/** slug でイベントを1件取得（一覧 API より軽量・リクエスト内 dedupe） */
export const getEventBySlug = cache(
  async (slug: string, cacheMode: MicroCMSFetchCache = 'default'): Promise<Event | null> => {
    try {
      const slugTag = eventSlugTag(slug);
      const microCMSEvents = await fetchMicroCMSList<MicroCMSEvent>(
        'events',
        cacheMode,
        {
          filters: `slug[equals]${slug}`,
          limit: 1,
        },
        slugTag ? [slugTag] : undefined,
      );
      const raw = microCMSEvents[0];
      return raw ? transformMicroCMSEvent(raw) : null;
    } catch (error) {
      console.error(`イベント取得に失敗しました (slug=${slug}):`, error);
      throw error;
    }
  },
);
