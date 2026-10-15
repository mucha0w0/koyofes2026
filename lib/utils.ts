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

/** microCMS の画像を、表示幅に合わせて直接配信する URL にする。 */
export function microCmsImageSrc(src: string, width: number): string | null {
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
