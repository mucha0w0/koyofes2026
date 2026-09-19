import Link from 'next/link';

import { InkTextLink } from '@/components/ui/ink-text-link';

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
    <section className="bg-background py-16 md:pb-24" data-palette="green">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium md:text-2xl">お知らせ</h2>
            <InkTextLink href="/official/news">すべて見る</InkTextLink>
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
                    className="ink-shell ink-lift group flex items-center gap-4 bg-card p-4"
                    href={`/official/news/${item.id}`}
                  >
                    <span className="shrink-0 text-sm text-muted-foreground">{formattedDate}</span>
                    <span className="truncate text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })
            ) : (
              <div className="p-4 text-center text-muted-foreground">ニュースはまだ投稿されていません。</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
