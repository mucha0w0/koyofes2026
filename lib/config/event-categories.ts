import { Building2, Mic2, ShoppingBag, Truck, Users } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import { EVENT_CATEGORIES, type EventCategory } from '@/lib/types/event';

export interface EventCategoryConfig {
  label: string;
  icon: LucideIcon;
}

/**
 * イベントカテゴリの単一ソース。
 * ラベル・アイコンの変更はここだけ行う。
 */
export const EVENT_CATEGORY_CONFIG = {
  'class-exhibit': { label: 'クラス・学科展', icon: Building2 },
  'volunteer-exhibit': { label: '有志展示', icon: Users },
  booth: { label: '模擬店', icon: ShoppingBag },
  stage: { label: 'ステージ', icon: Mic2 },
  'food-truck': { label: 'キッチンカー', icon: Truck },
} as const satisfies Record<EventCategory, EventCategoryConfig>;

/** EVENT_CATEGORIES の順序を保ったフィルター・一覧用オプション */
export const EVENT_CATEGORY_OPTIONS = EVENT_CATEGORIES.map((id) => ({
  id,
  label: EVENT_CATEGORY_CONFIG[id].label,
}));

export function getEventCategoryLabel(category: EventCategory): string {
  return EVENT_CATEGORY_CONFIG[category].label;
}

export function getEventCategoryIcon(category: EventCategory): LucideIcon {
  return EVENT_CATEGORY_CONFIG[category].icon;
}
