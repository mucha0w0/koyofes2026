/** microCMS API レスポンス型（ドメイン変換前の生データ） */

export interface MicroCMSImageField {
  url: string;
  height?: number;
  width?: number;
}

export interface MicroCMSIconField {
  url: string;
  height?: number;
  width?: number;
}

export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface MicroCMSEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  slug: string;
  title: string;
  catchphrase?: string;
  icon: MicroCMSIconField;
  images: MicroCMSImageField[];
  organization: string;
  location: string[];
  floor: string[];
  classroom: string;
  'time-day1': number;
  'time-day2': number;
  duration?: number;
  participantsUL: number;
  participantsLL?: number;
  description: string;
  'organ-description': string;
  author: string;
  category: string[];
}

export interface MicroCMSNews {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  date: string;
  title: string;
  content: string;
}

export type MicroCMSPartCategory = 'MC' | 'PARTS' | 'EXECUTIVE' | 'HYPE CREW';

export interface MicroCMSPart {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  icon?: MicroCMSImageField;
  instaID?: string;
  explanation: string;
  category: MicroCMSPartCategory[];
  recommend?: string;
  whyrecom?: string;
}

export interface MicroCMSSponsor {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  icon?: MicroCMSImageField;
  link?: string;
  explanation: string;
  category: string[];
}
