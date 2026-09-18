import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { getNews, type MicroCMSNews } from '@/lib/news';

export async function NewsSection() {
  let news: MicroCMSNews[] = [];

  try {
    const allNews = await getNews();
    news = allNews.slice(0, 3);
  } catch (error) {
    console.error('ニュース取得エラー(NewsSection):', error);
  }

  return (
    <section className="pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-medium">お知らせ</h2>
            <Link
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="/official/news"
            >
              すべて見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {news.length > 0 ? (
              news.map((item) => {
                const formattedDate = new Date(item.date)
                  .toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\//g, '.');

                return (
                  <Link
                    key={item.id}
                    className="flex items-center gap-4 rounded-md p-4 bg-card transition-colors hover:bg-mist-hover group"
                    href={`/official/news/${item.id}`}
                  >
                    <span className="text-sm text-muted-foreground shrink-0">{formattedDate}</span>
                    <span className="text-sm font-medium truncate">{item.title}</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                  </Link>
                );
              })
            ) : (
              <div className="text-center p-4 text-muted-foreground">ニュースはまだ投稿されていません。</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
