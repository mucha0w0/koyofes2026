import type { RankingTab } from '@/lib/config/rankingConfig';
import type { Event } from '@/lib/types/event';
import type { RankingResponse } from '@/lib/types/ranking';

export type EventSortKey = 'match' | 'duration' | RankingTab;

/** 企画一覧の初期並び。キーワードが無いときは取得順のまま。 */
export const DEFAULT_EVENT_SORT_KEY: EventSortKey = 'match';

export const EVENT_SORT_OPTIONS: { key: EventSortKey; label: string }[] = [
  { key: 'match', label: '一致順' },
  { key: 'duration', label: '所要時間' },
  { key: 'overall', label: 'ランキング（総合）' },
  { key: 'trend', label: 'ランキング（トレンド）' },
  { key: 'wait', label: '混雑状況' },
];

export function isRankingSortKey(sortKey: EventSortKey): sortKey is RankingTab {
  return sortKey === 'overall' || sortKey === 'trend' || sortKey === 'wait';
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

/** 一覧フィルタと同じく、空白のみは未検索。比較そのものは trim しない。 */
function normalizeSearchQuery(query: string): string {
  return query.trim() ? query.toLowerCase() : '';
}

/**
 * 小さいほど一致が強い。企画名を団体名より優先する。
 * キーワードが無い企画は末尾。
 */
function matchSortValue(event: Event, query: string): [number, number] {
  const title = event.title.toLowerCase();
  const organization = event.organization.toLowerCase();
  const titleIndex = title.indexOf(query);

  if (title === query) {
    return [0, 0];
  }
  if (titleIndex === 0) {
    return [1, title.length];
  }
  if (titleIndex > 0) {
    return [2, titleIndex];
  }

  const organizationIndex = organization.indexOf(query);
  if (organization === query) {
    return [3, 0];
  }
  if (organizationIndex === 0) {
    return [4, organization.length];
  }
  if (organizationIndex >= 0) {
    return [5, organizationIndex];
  }

  return [6, 0];
}

/** フィルタ後の企画を並び替える。ランキング値が無い企画は末尾に残す。 */
export function sortEvents(
  events: Event[],
  sortKey: EventSortKey,
  scores: Map<string, number> | null,
  query = '',
): Event[] {
  const normalizedQuery = normalizeSearchQuery(query);
  if (sortKey === 'match' && !normalizedQuery) {
    return events;
  }

  const indexed = events.map((event, index) => ({ event, index }));

  indexed.sort((a, b) => {
    if (sortKey === 'match') {
      const [tierA, posA] = matchSortValue(a.event, normalizedQuery);
      const [tierB, posB] = matchSortValue(b.event, normalizedQuery);
      if (tierA !== tierB) {
        return tierA - tierB;
      }
      if (posA !== posB) {
        return posA - posB;
      }
      return a.index - b.index;
    }

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
