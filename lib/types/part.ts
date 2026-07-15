export type SocialPlatform = 'instagram' | 'twitter' | 'youtube';

export type PartCategory = 'MC' | 'PARTS' | 'EXECUTIVE' | 'HYPE CREW';

export interface PartSocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
  handle?: string;
}

export interface PartItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  social: PartSocialLink[];
  category: PartCategory;
}

export interface PartSection {
  id: string;
  label: string;
  labelEn: string;
  items: PartItem[];
}

export const PART_CATEGORY_CONFIG: Record<PartCategory, { id: string; label: string; labelEn: string; order: number }> =
  {
    MC: { id: 'mc', label: '司会', labelEn: 'MC', order: 0 },
    PARTS: { id: 'parts', label: 'パート', labelEn: 'PARTS', order: 1 },
    EXECUTIVE: { id: 'executive', label: '幹部', labelEn: 'EXECUTIVE', order: 2 },
    'HYPE CREW': { id: 'morriage', label: 'もりあげ隊', labelEn: 'HYPE CREW', order: 3 },
  };
