import { formatEventTimeRange } from '@/lib/event-time';
import type { Event } from '@/lib/types/event';

/** participantsUL がこの値以上のとき「一般（制限なし）」と表示 */
const UNLIMITED_PARTICIPANTS_THRESHOLD = 9999;

export interface EventLocationDisplay {
  firstLine: string;
  secondLine?: string;
}

/** 場所・階・教室を表示用にフォーマット */
export function formatLocation(event: Pick<Event, 'location' | 'floor' | 'classroom'>): EventLocationDisplay {
  const firstLine = [event.location];
  if (event.floor) firstLine.push(event.floor);

  return {
    firstLine: firstLine.join(' '),
    secondLine: event.classroom || undefined,
  };
}

/** 参加人数の上下限を表示用にフォーマット */
export function formatParticipants(event: Pick<Event, 'participantsUL' | 'participantsLL'>): string {
  const { participantsUL, participantsLL } = event;

  // Both empty/undefined = unlimited
  if (!participantsUL && !participantsLL) {
    return '制限なし';
  }

  // Only lower limit exists
  if (!participantsUL && participantsLL) {
    return `${participantsLL}人`;
  }

  // Only upper limit exists
  if (participantsUL && !participantsLL) {
    if (participantsUL >= UNLIMITED_PARTICIPANTS_THRESHOLD) {
      return '一般（制限なし）';
    }
    return `${participantsUL}人`;
  }

  // Both exist
  if (participantsUL >= UNLIMITED_PARTICIPANTS_THRESHOLD) {
    return '一般（制限なし）';
  }
  if (participantsUL === participantsLL) {
    return `${participantsLL}人`;
  }
  return `${participantsLL}-${participantsUL}人`;
}

/** CMS の開催時間が未入力のときの表示 */
const NOT_HELD_LABEL = '未開催';

/** １日目・２日目の開催時間。未入力なら「未開催」 */
export function formatDaySchedule(time: string): string {
  return formatEventTimeRange(time) || NOT_HELD_LABEL;
}

/** 所要時間（分）を表示用にフォーマット */
export function formatDuration(minutes: number): string {
  if (minutes === 0) return '時間未定';
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}時間`;
  return `${hours}時間${mins}分`;
}
