import type { RankingTab } from '@/lib/config/rankingConfig';
import type { Event } from '@/lib/types/event';
import type { RankingResponse } from '@/lib/types/ranking';

export type EventSortKey = 'none' | 'duration' | RankingTab;

export const EVENT_SORT_OPTIONS: { key: EventSortKey; label: string }[] = [
  { key: 'none', label: '指定なし' },
  { key: 'duration', label: '所要時間' },
  { key: 'overall', label: 'ランキング（総合）' },
  { key: 'trend', label: 'ランキング（トレンド）' },
  { key: 'wait', label: '混雑状況' },
];

export function isRankingSortKey(sortKey: EventSortKey): sortKey is RankingTab {
  return sortKey === 'overall' || sortKey === 'trend' || sortKey === 'wait';
}

export function getEventSortResultHint(sortKey: EventSortKey): string {
  switch (sortKey) {
    case 'duration':
      return '所要時間が短い順';
    case 'overall':
      return '総合ランキング順';
    case 'trend':
      return 'トレンド順';
    case 'wait':
      return '空いている順';
    default:
      return '';
  }
}

export function rankingScoresFromResponse(body: RankingResponse): Map<string, number> {
  const map = new Map<string, number>();
  if (body.tab === 'overall' || body.tab === 'trend') {
    for (const item of body.items) {
      map.set(item.slug, item.rank);
    }
    return map;
  }
  for (const item of body.items) {
    map.set(item.slug, item.score);
  }
  return map;
}

export async function fetchRankingScoreMap(tab: RankingTab, signal?: AbortSignal): Promise<Map<string, number>> {
  const response = await fetch(`/api/ranking?tab=${tab}`, { cache: 'no-store', signal });
  if (!response.ok) {
    return new Map();
  }
  const body = (await response.json()) as RankingResponse;
  if (body.tab !== tab) {
    return new Map();
  }
  return rankingScoresFromResponse(body);
}

function durationSortValue(duration: number): number {
  return duration > 0 ? duration : Number.POSITIVE_INFINITY;
}

/** フィルタ後の企画を並び替える。ランキング値が無い企画は末尾に残す。 */
export function sortEvents(events: Event[], sortKey: EventSortKey, scores: Map<string, number> | null): Event[] {
  if (sortKey === 'none') {
    return events;
  }

  const indexed = events.map((event, index) => ({ event, index }));

  indexed.sort((a, b) => {
    if (sortKey === 'duration') {
      const durationDiff = durationSortValue(a.event.duration) - durationSortValue(b.event.duration);
      if (durationDiff !== 0) {
        return durationDiff;
      }
      return a.index - b.index;
    }

    const scoreA = scores?.get(a.event.slug);
    const scoreB = scores?.get(b.event.slug);
    const hasA = scoreA !== undefined;
    const hasB = scoreB !== undefined;

    if (hasA !== hasB) {
      return hasA ? -1 : 1;
    }
    if (!hasA || scoreA === undefined || scoreB === undefined) {
      return a.index - b.index;
    }

    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }

    return a.index - b.index;
  });

  return indexed.map((item) => item.event);
}
