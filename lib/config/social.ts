import { SiInstagram, SiLine, SiX, SiYoutube } from 'react-icons/si';

import type { IconType } from 'react-icons';

/**
 * 公式 SNS の単一ソース。
 * 見た目に出すかは `enabled`。アカウント開設後は true にするだけで
 * フッター・ホーム CTA・公式 SNS ページに出る。
 */
export const OFFICIAL_SOCIALS = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@kouyousai2026',
    url: 'https://instagram.com/kouyousai2026',
    description: 'こうよう祭の準備風景や企画紹介、当日の様子などをお届けします。',
    buttonText: 'Instagramをフォロー',
    enabled: true,
  },
  {
    id: 'x',
    label: 'X (旧Twitter)',
    handle: '@kouyousai2026',
    url: 'https://twitter.com/kouyousai2026',
    description: '当日のリアルタイム情報、混雑状況、緊急のお知らせなどをお届けします。',
    buttonText: 'Xをフォロー',
    enabled: false,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: 'こうよう祭公式チャンネル',
    url: 'https://youtube.com/@kouyousai2026',
    description: 'ステージイベントのダイジェスト、企画紹介動画などを配信します。',
    buttonText: 'チャンネル登録',
    enabled: false,
  },
  {
    id: 'line',
    label: 'LINE',
    handle: '@kouyousai2026',
    url: 'https://line.me/kouyousai2026',
    description: '開催情報やお知らせを配信します。',
    buttonText: '友だち追加',
    enabled: false,
  },
] as const;

export type OfficialSocialId = (typeof OFFICIAL_SOCIALS)[number]['id'];
export type OfficialSocial = (typeof OFFICIAL_SOCIALS)[number];

const OFFICIAL_SOCIAL_ICONS: Record<OfficialSocialId, IconType> = {
  instagram: SiInstagram,
  x: SiX,
  youtube: SiYoutube,
  line: SiLine,
};

export function getOfficialSocialIcon(id: OfficialSocialId): IconType {
  return OFFICIAL_SOCIAL_ICONS[id];
}

export function getOfficialSocial(id: OfficialSocialId): OfficialSocial {
  const social = OFFICIAL_SOCIALS.find((item) => item.id === id);
  if (!social) {
    throw new Error(`未定義の公式 SNS: ${id}`);
  }
  return social;
}

export function getEnabledOfficialSocials(): OfficialSocial[] {
  return OFFICIAL_SOCIALS.filter((item) => item.enabled);
}
