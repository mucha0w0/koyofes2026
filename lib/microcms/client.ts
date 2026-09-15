import type { MicroCMSListResponse } from '@/lib/microcms/types';

import { CMS_REVALIDATE_SECONDS } from '@/lib/cache';

export type MicroCMSFetchCache = 'default' | 'no-store';

/** microCMS リスト API の1リクエスト上限 */
const MICROCMS_MAX_LIMIT = 100;

export interface MicroCMSListQuery {
  limit?: number;
  offset?: number;
  filters?: string;
}

function getMicroCMSConfig() {
  const apiKey = process.env.MICROCMS_API_KEY;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    throw new Error('microCMS 環境変数が設定されていません');
  }

  return { apiKey, serviceDomain };
}

function resolveFetchCache(cacheMode: MicroCMSFetchCache) {
  // production の force-cache は再デプロイまで CMS 更新が反映されない。
  // 既定は ISR（60秒）。スタンプ照合など即時性が必要な場合は no-store。
  if (cacheMode === 'no-store' || process.env.NODE_ENV === 'development') {
    return { cache: 'no-store' as const };
  }
  return { next: { revalidate: CMS_REVALIDATE_SECONDS } };
}

async function fetchMicroCMSListPage<T>(
  endpoint: string,
  cacheMode: MicroCMSFetchCache,
  query: MicroCMSListQuery,
): Promise<MicroCMSListResponse<T>> {
  const { apiKey, serviceDomain } = getMicroCMSConfig();
  const params = new URLSearchParams();
  params.set('limit', String(query.limit ?? MICROCMS_MAX_LIMIT));
  if (query.offset !== undefined) {
    params.set('offset', String(query.offset));
  }
  if (query.filters) {
    params.set('filters', query.filters);
  }
  const url = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': apiKey },
    ...resolveFetchCache(cacheMode),
  });

  if (!response.ok) {
    throw new Error(`microCMS API エラー: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<MicroCMSListResponse<T>>;
}

/**
 * microCMS リスト API を取得
 * @param endpoint `events` などエンドポイント名（`/api/v1/` 以降）
 * @param cacheMode `no-store` はスタンプ照合など最新データが必要な用途向け
 * @param query `limit` 未指定時は offset を進めて全件取得する。指定時はその件数だけ（slug 検索など）
 */
export async function fetchMicroCMSList<T>(
  endpoint: string,
  cacheMode: MicroCMSFetchCache = 'default',
  query: MicroCMSListQuery = {},
): Promise<T[]> {
  if (query.limit !== undefined) {
    const data = await fetchMicroCMSListPage<T>(endpoint, cacheMode, query);
    return data.contents;
  }

  const all: T[] = [];
  let offset = query.offset ?? 0;

  while (true) {
    const data = await fetchMicroCMSListPage<T>(endpoint, cacheMode, {
      filters: query.filters,
      limit: MICROCMS_MAX_LIMIT,
      offset,
    });
    all.push(...data.contents);

    if (data.contents.length === 0 || all.length >= data.totalCount) {
      break;
    }

    const nextOffset = offset + data.contents.length;
    if (nextOffset <= offset) {
      break;
    }
    offset = nextOffset;
  }

  return all;
}

/**
 * microCMS コンテンツ API で1件取得
 * @param endpoint `news` などエンドポイント名（`/api/v1/` 以降）
 * @param contentId コンテンツ ID
 */
export async function fetchMicroCMSContent<T>(
  endpoint: string,
  contentId: string,
  cacheMode: MicroCMSFetchCache = 'default',
): Promise<T | null> {
  const { apiKey, serviceDomain } = getMicroCMSConfig();
  const url = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}/${contentId}`;

  const response = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': apiKey },
    ...resolveFetchCache(cacheMode),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`microCMS API エラー: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
