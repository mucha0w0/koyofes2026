'use client'

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { use } from "react"

const newsItems = [
  { id: "1", date: "2026.09.01", title: "当日のタイムテーブルを公開しました", content: "こうよう祭当日のステージイベントのタイムテーブルを公開しました。詳しくはタイムテーブルページをご覧ください。" },
  { id: "2", date: "2026.08.25", title: "企画一覧を更新しました", content: "新たに10件の企画を追加しました。今年は過去最多となる50以上の企画が出展予定です。" },
  { id: "3", date: "2026.08.15", title: "公式ウェブサイトをリニューアルしました", content: "こうよう祭2026の公式ウェブサイトをリニューアルオープンしました。企画検索機能など、新機能を追加しています。" },
  { id: "4", date: "2026.08.01", title: "こうよう祭2026の開催が決定しました", content: "今年度のこうよう祭は9月14日（土）・15日（日）の2日間開催となります。皆様のご来場をお待ちしております。" },
]

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const news = newsItems.find(item => item.id === id)

  if (!news) {
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
              <time className="text-sm text-muted-foreground font-mono">{news.date}</time>
            </div>
            <h2 className="font-medium text-lg mb-2">{news.title}</h2>
            <p className="text-muted-foreground text-sm">
              {news.content}
            </p>
          </article>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
