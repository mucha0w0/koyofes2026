import Link from 'next/link';

import { CmsPageLayout } from '@/components/cms/cms-page-layout';
import { Pagination } from '@/components/news/pagination';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

import { getNews } from '@/lib/news';

const ITEMS_PER_PAGE = 10;

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const newsItems = await getNews();

  const totalPages = Math.max(1, Math.ceil(newsItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = newsItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <CmsPageLayout meta="newsList">
      {newsItems.length === 0 ? (
        <div className="mx-auto max-w-3xl py-12 text-center">
          <p className="text-muted-foreground">ニュースはまだ投稿されていません。</p>
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-3xl space-y-4">
            {paginatedItems.map((item) => {
              const formattedDate = new Date(item.date)
                .toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\//g, '.');
              const plainContent = item.content.replace(/<[^>]*>/g, '').trim();
              return (
                <Link key={item.id} className="block" href={`/official/news/${item.id}`}>
                  <Card className="ink-lift cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <time className="text-sm text-muted-foreground">{formattedDate}</time>
                      </div>
                      <CardTitle className="font-medium text-lg mt-1">{item.title}</CardTitle>
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
    </CmsPageLayout>
  );
}
