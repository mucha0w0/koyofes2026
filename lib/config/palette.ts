export const SITE_PALETTE_IDS = ['orange', 'green', 'sky', 'pink'] as const;

export type SitePaletteId = (typeof SITE_PALETTE_IDS)[number];

/** ナビセクション id → 基調色 */
export const NAV_SECTION_PALETTE: Record<string, SitePaletteId> = {
  events: 'orange',
  official: 'green',
  guide: 'sky',
  about: 'pink',
};

export function getPaletteForNavSection(sectionId: string): SitePaletteId {
  return NAV_SECTION_PALETTE[sectionId] ?? 'orange';
}

/**
 * ナビセクションの基調。
 * 企画情報 = オレンジ / 公式コンテンツ = 緑 / ご案内 = 水色 / こうよう祭について = ピンク
 * トップとそれ以外は企画のオレンジ（サイトの既定）。
 */
export function getPaletteForPath(pathname: string): SitePaletteId {
  if (
    pathname === '/stamp' ||
    pathname.startsWith('/stamp/') ||
    pathname === '/ranking' ||
    pathname.startsWith('/ranking/') ||
    pathname.startsWith('/official')
  ) {
    return 'green';
  }

  if (pathname.startsWith('/guide')) {
    return 'sky';
  }

  if (pathname.startsWith('/about')) {
    return 'pink';
  }

  return 'orange';
}
