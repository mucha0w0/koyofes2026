/**
 * 公式 SNS の単一ソース。
 * 公開の PR 動画リンクと、開発用ルックブックのフッターが参照する。
 * 見た目に出すかは `enabled`。
 */
export const OFFICIAL_SOCIALS = [
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/koyofes_mc/',
    enabled: true,
  },
] as const;

export type OfficialSocialId = (typeof OFFICIAL_SOCIALS)[number]['id'];
export type OfficialSocial = (typeof OFFICIAL_SOCIALS)[number];

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
