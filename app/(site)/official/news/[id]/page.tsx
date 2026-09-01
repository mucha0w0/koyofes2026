import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
    <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
      <div className="max-w-3xl">
        <Link
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          href="/official/news"
        >
          <ArrowLeft className="h-4 w-4" />
          お知らせ一覧に戻る
        </Link>

        <Card className="border border-[#e6e9ed] pt-2">
          <CardHeader className="px-8 pt-6 pb-2">
            <div className="flex items-center gap-3">
              <time className="text-sm text-muted-foreground font-mono">{formattedDate}</time>
            </div>
            <CardTitle className="font-medium text-xl mt-1">{news.title}</CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
