export interface SponsorItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** 外部サイト */
  link?: string;
  /** サイト内ページ（企画詳細など） */
  href?: string;
  category: string;
}

export interface SponsorSection {
  id: string;
  label: string;
  labelEn: string;
  items: SponsorItem[];
}

export interface SponsorCategoryConfig {
  id: string;
  label: string;
  labelEn: string;
  order: number;
}

export const SPONSOR_CATEGORY_CONFIG: Record<string, SponsorCategoryConfig> = {
  Support: { id: 'support', label: 'ご後援', labelEn: 'SUPPORT', order: 0 },
  'Food Track': {
    id: 'food-track',
    label: 'キッチンカー',
    labelEn: 'FOOD TRUCK',
    order: 1,
  },
};

export function getSponsorCategoryConfig(category: string): SponsorCategoryConfig {
  return (
    SPONSOR_CATEGORY_CONFIG[category] ?? {
      id: category.toLowerCase().replace(/\s+/g, '-'),
      label: category,
      labelEn: category.toUpperCase(),
      order: 999,
    }
  );
}
