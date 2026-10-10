import {
  BookOpen,
  Clock,
  FileText,
  Handshake,
  HelpCircle,
  Mail,
  Map,
  Newspaper,
  Palette,
  Search,
  Stamp,
  Star,
  Train,
  Trophy,
  Users,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

/** UI 上の表示先 */
export type NavSurface = 'header' | 'footer' | 'links';

export interface NavLinkCard {
  icon: LucideIcon;
}

export interface NavLink {
  label: string;
  href: string;
  /** 関連案内カードのアイコン。card.icon がある場合はそちらを使う */
  icon?: LucideIcon;
  /** 関連案内とトップの案内カードで共通の一文 */
  description: string;
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
 * ラベル・URL・説明文・分類の変更はここだけ行う。
 */
export const NAV_SECTIONS = [
  {
    id: 'events',
    label: '企画情報',
    surfaces: { links: false },
    links: [
      { label: '企画一覧・検索', href: '/events/list', description: '企画を探す', icon: Search },
      { label: 'おすすめ企画', href: '/events/recommended', description: '運営のおすすめ', icon: Star },
      { label: 'タイムテーブル', href: '/events/timetable', description: '公演の時間', icon: Clock },
      {
        label: 'リアルタイムランキング',
        href: '/ranking',
        description: 'いまの人気',
        icon: Trophy,
        requiresRanking: true,
      },
    ],
  },
  {
    id: 'official',
    label: '公式コンテンツ',
    surfaces: { links: false },
    links: [
      { label: 'お知らせ', href: '/official/news', description: '最新のお知らせ', icon: Newspaper },
      { label: 'スタンプラリー', href: '/stamp', description: 'スタンプを集める', icon: Stamp },
      { label: 'パンフレット', href: '/official/pamphlet', description: '紙面の案内', icon: FileText },
    ],
  },
  {
    id: 'guide',
    label: 'ご案内',
    links: [
      {
        label: 'アクセス',
        href: '/guide/access',
        description: '電車・バス・車でのアクセス方法',
        card: { icon: Train },
      },
      {
        label: '会場マップ',
        href: '/guide/map',
        description: '豊田高専の構内図',
        card: { icon: Map },
      },
      {
        label: 'よくある質問',
        href: '/guide/faq',
        description: '来場前の確認事項',
        card: { icon: HelpCircle },
      },
      {
        label: 'お問い合わせ',
        href: '/guide/contact',
        description: '連絡先',
        card: { icon: Mail },
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
        description: '歴史と概要',
        card: { icon: BookOpen },
      },
      {
        label: 'テーマ',
        href: '/about/theme',
        description: '今年のテーマについて',
        card: { icon: Palette },
        surfaces: { footer: false },
      },
      {
        label: 'パート',
        href: '/about/part',
        description: 'こうよう祭を運営するパートのご紹介',
        card: { icon: Users },
        surfaces: { footer: false },
      },
      {
        label: 'ご協賛',
        href: '/about/sponsor',
        description: 'ご協賛いただいている企業・団体様',
        card: { icon: Handshake },
      },
    ],
  },
] satisfies NavSection[];

/** 実行時の走査用。href のリテラル型は NAV_SECTIONS に残す。 */
const NAV_SECTION_LIST: readonly NavSection[] = NAV_SECTIONS;

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
  return NAV_SECTION_LIST.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.links
      .filter((link) => isVisible(link, section, surface, rankingEnabled))
      .map(({ label, href }) => ({ label, href })),
  })).filter((section) => section.items.length > 0);
}

/** トップページ LinksSection 向け: card 付きリンクのみ */
export function getNavLinkCardSections(rankingEnabled = false): ResolvedNavLinkCardSection[] {
  const sections = NAV_SECTION_LIST.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.links.flatMap((link) => {
      if (!link.card || !isVisible(link, section, 'links', rankingEnabled)) {
        return [];
      }

      return [
        {
          label: link.label,
          href: link.href,
          icon: link.card.icon,
          description: link.description,
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
