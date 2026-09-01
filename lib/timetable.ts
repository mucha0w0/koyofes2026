import { eventTimeDuration, formatEventTimeRange, parseEventTime } from '@/lib/event-time';
import { getEvents } from '@/lib/events';
import type { Event } from '@/lib/types/event';

export type TimetableDayKey = 'time-day1' | 'time-day2';

/** タイムテーブル表示用の共通イベント型（開始・終了時刻を分単位で保持） */
export interface TimedEvent {
  slug: string;
  title: string;
  organization: string;
  icon?: string;
  startMin: number;
  endMin: number;
  duration: number;
  timeRange: string;
}

/** タイムライン UI 用（縦位置 px を付与） */
export interface ScheduleLayoutEvent extends TimedEvent {
  topPx: number;
}

interface ToTimedEventsOptions {
  /** formatEventTimeRange の区切り文字（既定: '~'） */
  timeRangeSeparator?: string;
}

/** ステージイベントを取得（取得失敗時は空配列） */
export async function getStageEvents(): Promise<Event[]> {
  try {
    const events = await getEvents();
    return events.filter((event) => event.category === 'stage');
  } catch (error) {
    console.error('イベント取得エラー:', error);
    return [];
  }
}

/** Event を指定日の TimedEvent に変換し、開始時刻順にソート */
export function toTimedEvents(
  events: Event[],
  dayKey: TimetableDayKey,
  options: ToTimedEventsOptions = {},
): TimedEvent[] {
  const { timeRangeSeparator } = options;

  return events
    .map((event): TimedEvent | null => {
      const parsed = parseEventTime(event[dayKey]);
      if (!parsed) return null;

      return {
        slug: event.slug,
        title: event.title,
        organization: event.organization,
        icon: event.icon || undefined,
        startMin: parsed.startMin,
        endMin: parsed.endMin,
        duration: eventTimeDuration(parsed),
        timeRange: formatEventTimeRange(parsed, timeRangeSeparator),
      };
    })
    .filter((event): event is TimedEvent => event !== null)
    .sort((a, b) => a.startMin - b.startMin);
}

/** TimedEvent にタイムライン縦位置を付与 */
export function toScheduleLayoutEvents(
  events: Event[],
  dayKey: TimetableDayKey,
  layout: { startHour: number; pxPerHour: number },
  options: ToTimedEventsOptions = {},
): ScheduleLayoutEvent[] {
  const pxPerMin = layout.pxPerHour / 60;

  return toTimedEvents(events, dayKey, options).map((event) => ({
    ...event,
    topPx: (event.startMin - layout.startHour * 60) * pxPerMin,
  }));
}
