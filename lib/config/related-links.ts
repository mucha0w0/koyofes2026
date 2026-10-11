import type { LucideIcon } from 'lucide-react';

import { NAV_SECTIONS, type NavSection } from '@/lib/config/nav';
import { isRankingEnabled } from '@/lib/config/rankingConfig';

type NavHref = (typeof NAV_SECTIONS)[number]['links'][number]['href'];

/** 関連案内に出せるページ。ナビの href と同じ。 */
export const RELATED_PAGE_HREFS = NAV_SECTIONS.flatMap((section) =>
  section.links.map((link) => link.href),
) as readonly NavHref[];

export type RelatedPageHref = NavHref;

export const RELATED_BACKGROUNDS = ['paper', 'paper-2'] as const;

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
  icon: LucideIcon;
}

function isRelatedPageHref(href: string): href is RelatedPageHref {
  return RELATED_PAGE_HREFS.includes(href);
}

export function resolveRelatedPages(
  pages: readonly RelatedPageHref[],
  rankingEnabled = isRankingEnabled(),
): ResolvedRelatedPage[] {
  const catalog = new Map<RelatedPageHref, ResolvedRelatedPage>();

  const navSections: readonly NavSection[] = NAV_SECTIONS;

  for (const section of navSections) {
    for (const link of section.links) {
      if (!isRelatedPageHref(link.href)) {
        continue;
      }

      if (link.requiresRanking && !rankingEnabled) {
        continue;
      }

      const icon = link.card?.icon ?? link.icon;

      if (!icon) {
        continue;
      }

      catalog.set(link.href, {
        href: link.href,
        label: link.label,
        description: link.description,
        icon,
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
