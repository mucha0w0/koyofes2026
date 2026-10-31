import type { Metadata } from 'next';

/**
 * 企画ページ以外の共有画像。
 * public/og.jpg は public/conceptart.jpg を 1200×630 の中央に収めたもの。
 * コンセプトアートを差し替えたら、同じ構図で作り直す。
 */
export const DEFAULT_SHARE_IMAGE = {
  url: '/og.jpg',
  width: 1200,
  height: 630,
  alt: 'こうよう祭 2026 テーマ 1dearland のコンセプトアート',
} as const;

type ShareImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

type ShareCard = 'summary' | 'summary_large_image';

/**
 * Twitter などの共有カード。
 * 企画アイコンは正方形なので summary（全体が見える小さな画像）。
 * コンセプトアートは summary_large_image（横長の大きな画像）。
 */
export function shareMetadata(
  image: ShareImage,
  options?: {
    card?: ShareCard;
    openGraph?: Metadata['openGraph'];
  },
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const card = options?.card ?? 'summary_large_image';

  return {
    openGraph: {
      siteName: 'こうよう祭 2026',
      locale: 'ja_JP',
      type: 'website',
      ...options?.openGraph,
      images: [image],
    },
    twitter: {
      card,
      images: [image],
    },
  };
}

/** SVG は Twitter が表示しないので、共有画像には使わない。 */
export function shareIcon(src: string, alt: string): ShareImage | null {
  if (!src) return null;
  const path = src.split(/[?#]/)[0]?.toLowerCase() ?? '';
  if (path.endsWith('.svg')) return null;
  return { url: src, alt };
}
