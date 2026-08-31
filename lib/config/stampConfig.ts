import { STAMP_SOURCE_CATEGORIES, type StampSourceCategory } from '@/lib/types/stamp';

export { STAMP_SOURCE_CATEGORIES, type StampSourceCategory };

/**
 * スタンプラリー設定（ブース本体は microCMS から取得）
 */
export const STAMP_CATEGORY_ORDER = [
  { id: 'class-exhibit', label: 'クラス・学科' },
  { id: 'volunteer-exhibit', label: '有志' },
] as const satisfies ReadonlyArray<{ id: StampSourceCategory; label: string }>;

export const STAMP_CONFIG = {
  sourceCategories: STAMP_SOURCE_CATEGORIES,
  categoryOrder: STAMP_CATEGORY_ORDER,
  clearConditions: {
    /** ふくびき券獲得に必要なスタンプ数（全対象ブース中 N 個以上） */
    requiredStampCount: 3,
  },
  storageKey: 'koyosai_stamp_data_2026',
} as const;
