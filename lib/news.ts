import { fetchMicroCMSContent, fetchMicroCMSList, type MicroCMSFetchCache } from '@/lib/microcms/client';
import type { MicroCMSNews } from '@/lib/microcms/types';

export type { MicroCMSNews } from '@/lib/microcms/types';
export type { MicroCMSFetchCache } from '@/lib/microcms/client';

async function fetchNewsFromMicroCMS(): Promise<MicroCMSNews[]> {
  try {
    return await fetchMicroCMSList<MicroCMSNews>('news');
  } catch (error) {
    console.error('microCMS ニュースデータ取得エラー:', error);
    throw error;
  }
}

export async function getNews(): Promise<MicroCMSNews[]> {
  try {
    const news = await fetchNewsFromMicroCMS();
    return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('ニュース取得に失敗しました:', error);
    throw error;
  }
}

/** ID でニュースを1件取得（コンテンツ API による直接取得） */
export async function getNewsByID(
  id: string,
  cacheMode: MicroCMSFetchCache = 'default',
): Promise<MicroCMSNews | null> {
  try {
    return await fetchMicroCMSContent<MicroCMSNews>('news', id, cacheMode);
  } catch (error) {
    console.error(`ニュース取得に失敗しました (id=${id}):`, error);
    throw error;
  }
}
