import { BookOpen, Handshake, HelpCircle, Mail, Map, Palette, Train, Users } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

/** UI 上の表示先 */
export type NavSurface = 'header' | 'footer' | 'links';

export interface NavLinkCard {
  icon: LucideIcon;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
  /** トップページ LinksSection 用（未指定ならカード非表示） */
  card?: NavLinkCard;
  /** リンク単位の表示先上書き（未指定時はセクション設定 → 全 surface） */
  surfaces?: Partial<Record<NavSurface, boolean>>;
  /** true のとき RANKING_ENABLED がオンの場合のみ表示 */
  requiresRanking?: boolean;
}

export interface NavSection {
  id: string;
  label: string;
  links: NavLink[];
  /** セクション単位の表示先上書き（未指定時は全 surface） */
  surfaces?: Partial<Record<NavSurface, boolean>>;
}

/**
 * サイトナビの単一ソース。
 * ラベル・URL・分類の変更はここだけ行う。
 */
export const NAV_SECTIONS = [
  {
    id: 'events',
    label: '企画情報',
    surfaces: { links: false },
    links: [
      { label: '企画一覧・検索', href: '/events/list' },
      { label: 'おすすめ企画', href: '/events/recommended' },
      { label: 'タイムテーブル', href: '/events/timetable' },
    ],
  },
  {
    id: 'official',
    label: '公式コンテンツ',
    surfaces: { links: false },
    links: [
      { label: 'お知らせ', href: '/official/news' },
      { label: 'スタンプラリー', href: '/stamp' },
      { label: 'リアルタイムランキング', href: '/ranking', requiresRanking: true },
      { label: '公式SNS', href: '/official/social' },
      { label: 'パンフレット', href: '/official/pamphlet' },
    ],
  },
  {
    id: 'guide',
    label: 'ご案内',
    links: [
      {
        label: 'アクセス',
        href: '/guide/access',
        card: {
          icon: Train,
          description: '電車・バス・車でのアクセス方法',
        },
      },
      {
        label: '会場マップ',
        href: '/guide/map',
        card: {
          icon: Map,
          description: '校内の施設とエリア案内',
        },
      },
      {
        label: 'よくある質問',
        href: '/guide/faq',
        card: {
          icon: HelpCircle,
          description: 'FAQ・お問い合わせ前に',
        },
      },
    ],
  },
  {
    id: 'about',
    label: 'こうよう祭について',
    links: [
      {
        label: 'こうよう祭とは',
        href: '/about/overview',
        card: {
          icon: BookOpen,
          description: '歴史と概要',
        },
      },
      {
        label: 'テーマ',
        href: '/about/theme',
        card: {
          icon: Palette,
          description: '今年のテーマについて',
        },
        surfaces: { footer: false },
      },
      {
        label: 'パート',
        href: '/about/part',
        card: {
          icon: Users,
          description: 'こうよう祭を運営するパートのご紹介',
        },
        surfaces: { footer: false },
      },
      {
        label: 'ご協賛',
        href: '/about/sponsor',
        card: {
          icon: Handshake,
          description: 'ご協賛いただいている企業・団体様',
        },
      },
      {
        label: 'お問い合わせ',
        href: '/about/contact',
        card: {
          icon: Mail,
          description: '連絡先',
        },
      },
    ],
  },
] satisfies NavSection[];

/** LinksSection の列順（ヘッダー順とは独立） */
const LINKS_SECTION_DISPLAY_ORDER = ['about', 'guide', 'official'] as const;

export type ResolvedNavLink = Pick<NavLink, 'label' | 'href'>;

export interface ResolvedNavSection {
  id: string;
  label: string;
  items: ResolvedNavLink[];
}

export interface ResolvedNavLinkCard extends ResolvedNavLink {
  icon: LucideIcon;
  description: string;
}

export interface ResolvedNavLinkCardSection {
  id: string;
  label: string;
  items: ResolvedNavLinkCard[];
}

function isVisible(
  link: NavLink,
  section: NavSection,
  surface: NavSurface,
  rankingEnabled: boolean,
): boolean {
  if (link.requiresRanking && !rankingEnabled) {
    return false;
  }

  if (link.surfaces?.[surface] !== undefined) {
    return link.surfaces[surface];
  }

  if (section.surfaces?.[surface] !== undefined) {
    return section.surfaces[surface];
  }

  return true;
}

/** Header / Footer 向け: セクションとリンク一覧 */
export function getNavSections(surface: NavSurface, rankingEnabled = false): ResolvedNavSection[] {
  return NAV_SECTIONS.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.links
      .filter((link) => isVisible(link, section, surface, rankingEnabled))
      .map(({ label, href }) => ({ label, href })),
  })).filter((section) => section.items.length > 0);
}

/** トップページ LinksSection 向け: card 付きリンクのみ */
export function getNavLinkCardSections(rankingEnabled = false): ResolvedNavLinkCardSection[] {
  const sections = NAV_SECTIONS.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.links.flatMap((link) => {
      if (!('card' in link) || !link.card || !isVisible(link, section, 'links', rankingEnabled)) {
        return [];
      }

      return [
        {
          label: link.label,
          href: link.href,
          icon: link.card.icon,
          description: link.card.description,
        },
      ];
    }),
  })).filter((section) => section.items.length > 0);

  return sections.sort((a, b) => {
    const aIndex = LINKS_SECTION_DISPLAY_ORDER.indexOf(a.id as (typeof LINKS_SECTION_DISPLAY_ORDER)[number]);
    const bIndex = LINKS_SECTION_DISPLAY_ORDER.indexOf(b.id as (typeof LINKS_SECTION_DISPLAY_ORDER)[number]);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}
