'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use, useState, useEffect } from 'react';

import { PageLayout } from '@/components/page-layout';
// 👇 ここで UI コンポーネントをインポートします
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { type MicroCMSNews } from '@/lib/news';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [news, setNews] = useState<MicroCMSNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
          throw new Error('ニュースが見つかりません');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ニュースの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    void fetchNews(); // ← void を付けて浮きPromiseを明示的に無視
  }, [id]);

  if (loading) {
    return (
      <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
          <div className="max-w-3xl text-center py-12">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </PageLayout>
    );
  }

  if (error || !news) {
    return (
      <PageLayout subtitle="こうよう祭に関するお知らせ一覧" title="お知らせ">
          <div className="max-w-3xl text-center">
            <p className="text-muted-foreground mb-6">申し訳ございません。お探しのお知らせは見つかりませんでした。</p>
            <Link
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="/official/news"
            >
              <ArrowLeft className="h-4 w-4" />
              お知らせ一覧に戻る
            </Link>
          </div>
        </PageLayout>
    );
  }

  // dateを表示用にフォーマット
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

          {/* 👇 <article className="bg-card p-8"> を <Card> に変更 */}
          {/* 元々の p-8（上下左右 2rem の余白）に合わせるため、少し微調整しています */}
          <Card className="border border-[#e6e9ed] pt-2">
            <CardHeader className="px-8 pt-6 pb-2">
              {/* 日付 */}
              <div className="flex items-center gap-3">
                <time className="text-sm text-muted-foreground font-mono">{formattedDate}</time>
              </div>

              {/* 記事タイトル (詳細画面なので文字サイズを大きめの text-2xl に変更しても格好いいです) */}
              <CardTitle className="font-medium text-xl mt-1">{news.title}</CardTitle>
            </CardHeader>

            {/* 👇 本文全体を CardContent に配置 */}
            <CardContent className="px-8 pb-8">
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
}
