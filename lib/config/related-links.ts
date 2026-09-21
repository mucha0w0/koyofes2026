import type { SitePaletteId } from '@/lib/config/palette';

import { NAV_SECTIONS } from '@/lib/config/nav';
import { isRankingEnabled } from '@/lib/config/rankingConfig';

/** 関連案内に出せるページ。ナビの href と一致させる。 */
export const RELATED_PAGE_HREFS = [
  '/events/list',
  '/events/recommended',
  '/events/timetable',
  '/official/news',
  '/stamp',
  '/ranking',
  '/official/social',
  '/official/pamphlet',
  '/guide/access',
  '/guide/map',
  '/guide/faq',
  '/about/overview',
  '/about/theme',
  '/about/part',
  '/about/sponsor',
  '/about/contact',
] as const;

export type RelatedPageHref = (typeof RELATED_PAGE_HREFS)[number];

/**
 * 関連案内カードの短い説明。
 * ラベルはナビを単一ソースにし、ここはカード用の一文だけ持つ。
 */
const RELATED_DESCRIPTIONS = {
  '/events/list': '企画を探す',
  '/events/recommended': '運営のおすすめ',
  '/events/timetable': '公演の時間',
  '/official/news': '最新のお知らせ',
  '/stamp': 'スタンプを集める',
  '/ranking': 'いまの人気',
  '/official/social': '公式アカウント',
  '/official/pamphlet': '紙面の案内',
  '/guide/access': '電車・バス・車での行き方',
  '/guide/map': '校内の施設とエリア',
  '/guide/faq': '入場や注意事項',
  '/about/overview': '歴史と概要',
  '/about/theme': '今年のテーマ',
  '/about/part': '運営するパート',
  '/about/sponsor': 'ご協賛の企業・団体',
  '/about/contact': '連絡先',
} as const satisfies Record<RelatedPageHref, string>;

export const RELATED_BACKGROUNDS = ['paper', 'paper-2', 'orange', 'green', 'sky', 'pink'] as const;

export type RelatedBackground = (typeof RELATED_BACKGROUNDS)[number];

export interface RelatedLinksConfig {
  pages: readonly RelatedPageHref[];
  /** 未指定時はページと同じ紙色（paper） */
  background?: RelatedBackground;
  title?: string;
}

export interface ResolvedRelatedPage {
  href: RelatedPageHref;
  label: string;
  description: string;
}

function isRelatedPageHref(href: string): href is RelatedPageHref {
  return (RELATED_PAGE_HREFS as readonly string[]).includes(href);
}

export function resolveRelatedPages(
  pages: readonly RelatedPageHref[],
  rankingEnabled = isRankingEnabled(),
): ResolvedRelatedPage[] {
  const catalog = new Map<RelatedPageHref, ResolvedRelatedPage>();

  for (const section of NAV_SECTIONS) {
    for (const link of section.links) {
      if (!isRelatedPageHref(link.href)) {
        continue;
      }

      if (link.requiresRanking && !rankingEnabled) {
        continue;
      }

      catalog.set(link.href, {
        href: link.href,
        label: link.label,
        description: RELATED_DESCRIPTIONS[link.href],
      });
    }
  }

  return pages.flatMap((href) => {
    const page = catalog.get(href);
    return page ? [page] : [];
  });
}

export function relatedBackgroundClass(background: RelatedBackground = 'paper'): string {
  return background === 'paper' ? 'bg-background' : 'bg-paper-2';
}

export function relatedBackgroundPalette(background: RelatedBackground = 'paper'): SitePaletteId | undefined {
  if (background === 'paper' || background === 'paper-2') {
    return undefined;
  }

  return background;
}
