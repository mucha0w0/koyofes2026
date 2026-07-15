import { getEvents } from '@/lib/microcms';
import { Event } from '@/lib/types/event';
import { CategoryEventsContent } from './category-events-client';

type EventCategory = 'class-exhibit' | 'volunteer-exhibit' | 'booth' | 'stage' | 'food-truck';

const categoryConfig: Record<EventCategory, { title: string; Icon: React.ElementType }> = {
  'class-exhibit': { title: 'クラス・学科展示', Icon: () => null },
  'volunteer-exhibit': { title: '有志展示', Icon: () => null },
  booth: { title: '模擬店', Icon: () => null },
  'food-truck': { title: 'キッチンカー', Icon: () => null },
  stage: { title: 'ステージ', Icon: () => null },
};

export async function CategoryEvents() {
  let events: Event[] = [];

  try {
    const fetchedEvents = await getEvents();
    events = fetchedEvents as Event[];
  } catch (error) {
    console.error('イベント取得エラー:', error);
  }

  const categories = (Object.keys(categoryConfig) as EventCategory[])
    .map((cat) => ({
      id: cat,
      title: categoryConfig[cat].title,
      events: events.filter((e) => e.category === cat),
    }))
    .filter((cat) => cat.events.length > 0);

  return <CategoryEventsContent categories={categories} />;
}
