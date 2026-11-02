import eventsDocument from '../../data/cms/events.json';
import newsDocument from '../../data/cms/news.json';
import partsDocument from '../../data/cms/parts.json';
import sponsorsDocument from '../../data/cms/sponsors.json';

import type { MicroCMSListResponse } from '@/lib/microcms/types';

import { findMicroCMSContent, sliceMicroCMSPage, type LocalListQuery } from '@/lib/microcms/content-filter';

type ListDocument = {
  contents: Array<{ id: string }>;
};

const LOCAL_DOCUMENTS: Record<string, ListDocument> = {
  events: eventsDocument,
  news: newsDocument,
  parts: partsDocument,
  sponsors: sponsorsDocument,
};

function readLocalContents(endpoint: string): Array<{ id: string }> {
  const document = LOCAL_DOCUMENTS[endpoint];
  if (!document) {
    throw new Error(`ローカルスナップショットにエンドポイント ${endpoint} がありません`);
  }
  return document.contents;
}

export function readLocalMicroCMSList<T>(endpoint: string, query: LocalListQuery = {}): MicroCMSListResponse<T> {
  const page = sliceMicroCMSPage(readLocalContents(endpoint), query);
  return {
    contents: page.contents as T[],
    totalCount: page.totalCount,
    offset: page.offset,
    limit: page.limit,
  };
}

export function readLocalMicroCMSContent<T extends { id: string }>(endpoint: string, contentId: string): T | null {
  return findMicroCMSContent(readLocalContents(endpoint) as T[], contentId);
}
