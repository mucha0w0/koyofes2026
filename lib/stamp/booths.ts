import { cache } from 'react';

import type { MicroCMSFetchCache } from '@/lib/microcms/client';
import type { Event } from '@/lib/types/event';

import { STAMP_CATEGORY_ORDER } from '@/lib/config/stampConfig';
import { getEventBySlug, getEvents } from '@/lib/events';
import {
  STAMP_SOURCE_CATEGORIES,
  type StampBooth,
  type StampBoothGroup,
  type StampSourceCategory,
} from '@/lib/types/stamp';

function isStampSourceCategory(category: Event['category']): category is StampSourceCategory {
  return (STAMP_SOURCE_CATEGORIES as readonly string[]).includes(category);
}

function toStampBooth(event: Event): StampBooth | null {
  if (!isStampSourceCategory(event.category)) {
    return null;
  }
  if (!event.slug) {
    return null;
  }

  return {
    slug: event.slug,
    title: event.title,
    organization: event.organization,
    icon: event.icon,
    category: event.category,
  };
}

function sortByJapaneseTitle(a: StampBooth, b: StampBooth): number {
  return a.title.localeCompare(b.title, 'ja');
}

function groupBooths(booths: StampBooth[]): StampBoothGroup[] {
  const byCategory = new Map<StampSourceCategory, StampBooth[]>();
  for (const booth of booths) {
    const list = byCategory.get(booth.category) ?? [];
    list.push(booth);
    byCategory.set(booth.category, list);
  }

  return STAMP_CATEGORY_ORDER.map((entry) => {
    const list = byCategory.get(entry.id) ?? [];
    return {
      category: entry.id,
      label: entry.label,
      booths: [...list].sort(sortByJapaneseTitle),
    };
  }).filter((group) => group.booths.length > 0);
}

/**
 * スタンプ対象ブース一覧（リクエスト内 dedupe）。
 * 表示ページは ISR、照合 API は `no-store`（lib/cache.ts 参照）。
 */
const loadStampBooths = cache(async (cacheMode: MicroCMSFetchCache = 'default'): Promise<StampBooth[]> => {
  const events = await getEvents(cacheMode);
  return events.map(toStampBooth).filter((booth): booth is StampBooth => booth !== null);
});

/** スタンプ対象ブースを平坦な配列で取得（カテゴリ順・各カテゴリ内50音順） */
export async function getStampBooths(): Promise<StampBooth[]> {
  const booths = await loadStampBooths();
  const groups = groupBooths(booths);
  return groups.flatMap((group) => group.booths);
}

/** カテゴリ見出し付きで取得（クラス・学科展 → 有志展示、各々50音順） */
export async function getStampBoothGroups(): Promise<StampBoothGroup[]> {
  const booths = await loadStampBooths();
  return groupBooths(booths);
}

/** verify 用：有効 slug の集合（照合 API 向け・常に最新） */
export async function getStampBoothSlugSet(): Promise<Set<string>> {
  const booths = await loadStampBooths('no-store');
  return new Set(booths.map((booth) => booth.slug));
}

/** slug からブースを1件取得（collect API 向け・常に最新） */
export async function getStampBoothBySlug(slug: string): Promise<StampBooth | null> {
  const event = await getEventBySlug(slug, 'no-store');
  if (!event) {
    return null;
  }
  return toStampBooth(event);
}
