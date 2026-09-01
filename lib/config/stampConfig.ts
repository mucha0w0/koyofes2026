import type { LucideIcon } from 'lucide-react';

import {
  getEventCategoryIcon,
  getEventCategoryLabel,
} from '@/lib/config/event-categories';
import { STAMP_SOURCE_CATEGORIES, type StampSourceCategory } from '@/lib/types/stamp';
export { STAMP_SOURCE_CATEGORIES, type StampSourceCategory };

/**
 * スタンプラリー設定（ブース本体は microCMS から取得）
 */
export const STAMP_CATEGORY_ORDER = STAMP_SOURCE_CATEGORIES.map((id) => ({
  id,
  label: getEventCategoryLabel(id),
})) satisfies ReadonlyArray<{ id: StampSourceCategory; label: string }>;

/** StampSourceCategory は EventCategory の部分集合のため、共通定義を再利用する */
export function getStampCategoryIcon(category: StampSourceCategory): LucideIcon {
  return getEventCategoryIcon(category);
}

export const STAMP_CONFIG = {
  sourceCategories: STAMP_SOURCE_CATEGORIES,
  categoryOrder: STAMP_CATEGORY_ORDER,
  clearConditions: {
    /** ふくびき券獲得に必要なスタンプ数（全対象ブース中 N 個以上） */
    requiredStampCount: 3,
  },
  storageKey: 'koyosai_stamp_data_2026',
} as const;
