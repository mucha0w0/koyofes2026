export interface SponsorItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** 外部サイト */
  link?: string;
  /** サイト内ページ（企画詳細など） */
  href?: string;
}

export interface SponsorSection {
  id: string;
  label: string;
  labelEn: string;
  items: SponsorItem[];
}

export const SUPPORT_SECTION = {
  id: 'support',
  label: 'ご後援',
  labelEn: 'SUPPORT',
} as const;

export const FOOD_TRUCK_SECTION = {
  id: 'food-track',
  label: 'キッチンカー',
  labelEn: 'FOOD TRUCK',
} as const;
