import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

import type { Metadata } from 'next';

import { getNews, getNewsByID } from '@/lib/news';

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function generateStaticParams() {
  try {
    const newsItems = await getNews();
    return newsItems.map((item) => ({ id: item.id }));
  } catch (error) {
    console.error('静的パラメータ生成エラー:', error);
    return [];
  }
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
    <PageLayout backHref="/official/news" backLabel="お知らせ一覧に戻る" title={news.title}>
      <div className="mx-auto max-w-3xl">
        <Card className="border border-[#e6e9ed] pt-2">
          <CardHeader className="px-8 pt-6 pb-2">
            <time className="text-sm text-muted-foreground font-mono">{formattedDate}</time>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
