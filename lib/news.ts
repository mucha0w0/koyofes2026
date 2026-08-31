import { fetchMicroCMSList } from '@/lib/microcms/client';
import type { MicroCMSNews } from '@/lib/microcms/types';

export type { MicroCMSNews } from '@/lib/microcms/types';

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

export async function getNewsByID(id: string): Promise<MicroCMSNews | undefined> {
  try {
    const news = await fetchNewsFromMicroCMS();
    return news.find((item) => item.id === id);
  } catch (error) {
    console.error('ニュース取得に失敗しました:', error);
    throw error;
  }
}
