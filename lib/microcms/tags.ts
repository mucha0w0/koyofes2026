/** microCMS エンドポイント単位のキャッシュタグ。一覧取得に付ける。 */
export const CMS_TAGS = {
  events: 'cms-events',
  news: 'cms-news',
  parts: 'cms-parts',
  sponsors: 'cms-sponsors',
} as const;

export type CmsApi = keyof typeof CMS_TAGS;

const MAX_TAG_LENGTH = 256;

export function isCmsApi(value: string): value is CmsApi {
  return Object.prototype.hasOwnProperty.call(CMS_TAGS, value);
}

export function cmsEndpointTag(endpoint: string): string | null {
  return isCmsApi(endpoint) ? CMS_TAGS[endpoint] : null;
}

/** パスに埋め込んでよい 1 セグメントか。オープンリダイレクトや別パスの無効化を防ぐ。 */
export function isSafePathSegment(value: string): boolean {
  if (value.length === 0 || value.length > 200) {
    return false;
  }
  if (value.includes('/') || value.includes('\\') || value.includes('..') || value.includes('\0')) {
    return false;
  }
  return !/[\s?#%]/.test(value);
}

function boundedTag(tag: string): string | null {
  return tag.length <= MAX_TAG_LENGTH ? tag : null;
}

/** 企画詳細 1 件。一覧タグ `cms-events` とは別で、編集した企画だけを無効化する。 */
export function eventSlugTag(slug: string): string | null {
  if (!isSafePathSegment(slug)) {
    return null;
  }
  return boundedTag(`cms-event:${slug}`);
}

/** お知らせ詳細 1 件。一覧タグ `cms-news` とは別。 */
export function newsIdTag(id: string): string | null {
  if (!isSafePathSegment(id)) {
    return null;
  }
  return boundedTag(`cms-news:${id}`);
}
