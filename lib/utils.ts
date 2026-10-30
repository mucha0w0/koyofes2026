import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** `<Image src>` に使える値か判定（http(s) URL またはサイトルートからの絶対パス） */
export function isImageUrl(value?: string): boolean {
  if (!value) return false;
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
}

const MICROCMS_IMAGE_HOST = 'images.microcms-assets.io';
const LOCAL_CMS_IMAGE_PATH = /^\/cms-images\/[a-z0-9]+\.[a-z0-9]+$/;

/**
 * microCMS の画像を表示用 URL にする。
 * ビルド時に保存した `/cms-images/` はそのまま返し、next/image の最適化は通さない。
 * まだ microCMS の URL のときは、表示幅に合わせたリサイズ URL にする（開発中や、ビルド後に増えた画像）。
 */
export function microCmsImageSrc(src: string, width: number): string | null {
  if (LOCAL_CMS_IMAGE_PATH.test(src)) {
    return src;
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (url.hostname !== MICROCMS_IMAGE_HOST) {
    return null;
  }
  const pixels = Math.max(1, Math.round(width));
  if (!url.searchParams.has('w')) {
    url.searchParams.set('w', String(pixels));
  }
  if (!url.searchParams.has('q')) {
    url.searchParams.set('q', '75');
  }
  return url.toString();
}
