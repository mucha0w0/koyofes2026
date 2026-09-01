import { CategoryEventsContent } from './category-events-client';

import { getEventCategoryLabel } from '@/lib/config/event-categories';
import { getEvents } from '@/lib/events';
import { EVENT_CATEGORIES, type Event } from '@/lib/types/event';

export async function CategoryEvents() {
  let events: Event[] = [];

  try {
    const fetchedEvents = await getEvents();
    events = fetchedEvents;
  } catch (error) {
    console.error('イベント取得エラー:', error);
  }

  const categories = [...EVENT_CATEGORIES]
    .map((cat) => ({
      id: cat,
      title: getEventCategoryLabel(cat),
      events: events.filter((e) => e.category === cat),
    }))
    .filter((cat) => cat.events.length > 0);

  return <CategoryEventsContent categories={categories} />;
}
