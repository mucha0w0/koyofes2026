'use client'

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { use, useState, useEffect } from "react"
import { MicroCMSNews } from "@/lib/microcms"

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [news, setNews] = useState<MicroCMSNews | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`)
        if (!response.ok) {
          throw new Error("ニュースが見つかりません")
        }
        const data = await response.json()
        setNews(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "ニュースの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [id])

  if (loading) {
    return (
      <>
        <SiteHeader />
        <PageLayout title="お知らせ" subtitle="こうよう祭に関するお知らせ一覧">
          <div className="max-w-3xl text-center py-12">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </PageLayout>
        <SiteFooter />
      </>
    )
  }

  if (error || !news) {
    return (
      <>
        <SiteHeader />
        <PageLayout title="お知らせ" subtitle="こうよう祭に関するお知らせ一覧">
          <div className="max-w-3xl text-center">
            <p className="text-muted-foreground mb-6">申し訳ございません。お探しのお知らせは見つかりませんでした。</p>
            <Link href="/official/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              お知らせ一覧に戻る
            </Link>
          </div>
        </PageLayout>
        <SiteFooter />
      </>
    )
  }

  // dateを表示用にフォーマット
  const formattedDate = new Date(news.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.')

  return (
    <>
      <SiteHeader />
      <PageLayout title="お知らせ" subtitle="こうよう祭に関するお知らせ一覧">
        <div className="max-w-3xl">
          <Link href="/official/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            お知らせ一覧に戻る
          </Link>

          <article className="bg-card p-8">
            <div className="flex items-center gap-3 mb-3">
              <time className="text-sm text-muted-foreground font-mono">{formattedDate}</time>
            </div>
            <h2 className="font-medium text-lg mb-2">{news.title}</h2>
            <div 
              className="text-muted-foreground text-sm whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </article>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
