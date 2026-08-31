import {
  STAMP_CATEGORY_ORDER,
  STAMP_CONFIG,
  type StampSourceCategory,
} from '@/lib/config/stampConfig';
import { getEvents } from '@/lib/events';
import type { Event } from '@/lib/types/event';
import type { StampBooth, StampBoothGroup } from '@/lib/types/stamp';

function isStampSourceCategory(category: Event['category']): category is StampSourceCategory {
  return (STAMP_CONFIG.sourceCategories as readonly string[]).includes(category);
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

/** スタンプ対象ブースを平坦な配列で取得（カテゴリ順・各カテゴリ内50音順） */
export async function getStampBooths(): Promise<StampBooth[]> {
  const groups = await getStampBoothGroups();
  return groups.flatMap((group) => group.booths);
}

/** カテゴリ見出し付きで取得（クラス・学科 → 有志、各々50音順） */
export async function getStampBoothGroups(): Promise<StampBoothGroup[]> {
  // トークン照合と slug を一致させるため、スタンプ用途は常に最新の CMS を参照する
  const events = await getEvents('no-store');
  const booths = events.map(toStampBooth).filter((booth): booth is StampBooth => booth !== null);

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

/** slug からブースを1件取得 */
export async function getStampBoothBySlug(slug: string): Promise<StampBooth | null> {
  const booths = await getStampBooths();
  return booths.find((booth) => booth.slug === slug) ?? null;
}
