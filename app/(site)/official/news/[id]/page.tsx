import { notFound } from 'next/navigation';

import { CmsPageLayout } from '@/components/cms/cms-page-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InkTextLink } from '@/components/ui/ink-text-link';

import type { Metadata } from 'next';

import { getNews, getNewsByID } from '@/lib/news';

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * ビルド時に無い id はページを作らない。
 * クローラーが適当な id を踏むたびに ISR Write が増えるのを防ぐ。
 * 公開後に増えたお知らせは、Webhook の Deploy Hook による再ビルドで追加する。
 */
export const dynamicParams = false;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function generateStaticParams() {
  const newsItems = await getNews();
  return newsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsByID(id);

  if (!news) {
    return {
      title: 'お知らせが見つかりません | こうよう祭',
    };
  }

  const description = stripHtml(news.content).slice(0, 160);

  return {
    title: `${news.title} | お知らせ | こうよう祭`,
    description,
    openGraph: {
      title: news.title,
      description,
      type: 'article',
      publishedTime: news.publishedAt,
      modifiedTime: news.updatedAt,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const news = await getNewsByID(id);

  if (!news) {
    notFound();
  }

  const formattedDate = new Date(news.date)
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '.');

  return (
    <CmsPageLayout
      meta="newsList"
      related={{
        pages: ['/about/overview', '/guide/faq', '/official/pamphlet'],
        background: 'paper-2',
      }}
    >
      <div className="mx-auto max-w-3xl">
        <InkTextLink arrow="left" className="mb-6" href="/official/news">
          お知らせ一覧に戻る
        </InkTextLink>

        <Card className="pt-2">
          <CardHeader className="px-8 pt-6 pb-2">
            <div className="flex items-center gap-3">
              <time className="text-sm text-muted-foreground">{formattedDate}</time>
            </div>
            <CardTitle className="font-medium text-xl mt-1">{news.title}</CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
          </CardContent>
        </Card>
      </div>
    </CmsPageLayout>
  );
}
