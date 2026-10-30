/** microCMS 画像 URL の正規化。ビルド時のミラーと実行時の差し替えで同じキーを使う。 */

const MICROCMS_IMAGE_HOST = 'images.microcms-assets.io';
const LOCAL_CMS_IMAGE_PREFIX = '/cms-images/';
const MICROCMS_URL_PATTERN = '(?:https?:)?\\/\\/images\\.microcms-assets\\.io\\/[^\\s"\'<>\\\\]+';
const SAFE_LOCAL_PATH = /^\/cms-images\/[a-z0-9]+\.[a-z0-9]+$/;

/** クエリや fragment を除いた https URL。microCMS 以外は null。 */
export function canonicalMicroCmsImageKey(value: string): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.hostname !== MICROCMS_IMAGE_HOST) return null;

  url.protocol = 'https:';
  url.search = '';
  url.hash = '';
  return `${url.origin}${url.pathname}`;
}

export function lookupDeliveredImage(value: string, images: Readonly<Record<string, string>>): string | null {
  if (typeof value !== 'string' || value.length === 0) return null;
  if (value.startsWith(LOCAL_CMS_IMAGE_PREFIX)) {
    return SAFE_LOCAL_PATH.test(value) ? value : null;
  }
  const key = canonicalMicroCmsImageKey(value);
  if (!key) return null;
  const local = images[key];
  return typeof local === 'string' && SAFE_LOCAL_PATH.test(local) ? local : null;
}

/** HTML 属性に入った URL の `&amp;` とプロトコル相対 URL を戻す。 */
export function decodeHtmlImageUrl(raw: string): string {
  const decoded = raw.replace(/&amp;/gi, '&');
  return decoded.startsWith('//') ? `https:${decoded}` : decoded;
}

/**
 * 本文 HTML 中の microCMS 画像 URL を、マニフェストにあるローカルパスへ替える。
 * マニフェストに無い URL はそのまま残す。
 */
export function rewriteMicroCmsUrls(text: string, images: Readonly<Record<string, string>>): string {
  if (typeof text !== 'string' || !text.includes(MICROCMS_IMAGE_HOST)) return text;
  const pattern = new RegExp(MICROCMS_URL_PATTERN, 'gi');
  return text.replace(pattern, (raw) => lookupDeliveredImage(decodeHtmlImageUrl(raw), images) ?? raw);
}
