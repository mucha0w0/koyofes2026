import Link from 'next/link';

import { PageLayout } from '@/components/page-layout';
import { Pagination } from '@/components/pagination';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from '@/components/ui/card';

import { getNews, MicroCMSNews } from '@/lib/microcms';

export const revalidate = 60; // 1分ごとにISR

const ITEMS_PER_PAGE = 10;

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  let newsItems: MicroCMSNews[] = [];
  let error: string | null = null;
  try {
    newsItems = await getNews();
  } catch (err) {
    error = err instanceof Error ? err.message : 'ニュースの取得に失敗しました';
    console.error('ニュース取得エラー:', err);
  }

  const totalPages = Math.max(1, Math.ceil(newsItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = newsItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
      <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
        {error ? (
          <div className="max-w-3xl text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="max-w-3xl text-center py-12">
            <p className="text-muted-foreground">ニュースはまだ投稿されていません。</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-w-3xl">
              {paginatedItems.map((item, i) => {
                const globalIndex = startIndex + i;
                const formattedDate = new Date(item.date)
                  .toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\//g, '.');
                const plainContent = item.content.replace(/<[^>]*>/g, '').trim();
                return (
                  <Link key={item.id} className="block group" href={`/official/news/${item.id}`}>
                    <Card className="border border-[#e6e9ed] transition-colors group-hover:bg-muted cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <time className="text-sm text-muted-foreground font-mono">{formattedDate}</time>
                        </div>
                        <CardTitle className="font-medium text-lg mt-1">{item.title}</CardTitle>
                        {globalIndex === 0 && (
                          <CardAction>
                            <span className="text-xs font-medium text-primary-foreground px-2 py-0.5 bg-primary rounded-sm">
                              NEW
                            </span>
                          </CardAction>
                        )}
                      </CardHeader>
                      <CardContent className="pb-6">
                        <CardDescription className="text-muted-foreground text-sm line-clamp-1">
                          {plainContent}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <Pagination basePath="/official/news" currentPage={safePage} totalPages={totalPages} />
          </>
        )}
      </PageLayout>
    );
}
