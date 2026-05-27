import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"

const newsItems = [
  { id: "1", date: "2026.09.01", title: "当日のタイムテーブルを公開しました", content: "こうよう祭当日のステージイベントのタイムテーブルを公開しました。詳しくはタイムテーブルページをご覧ください。" },
  { id: "2", date: "2026.08.25", title: "企画一覧を更新しました", content: "新たに10件の企画を追加しました。今年は過去最多となる50以上の企画が出展予定です。" },
  { id: "3", date: "2026.08.15", title: "公式ウェブサイトをリニューアルしました", content: "こうよう祭2026の公式ウェブサイトをリニューアルオープンしました。企画検索機能など、新機能を追加しています。" },
  { id: "4", date: "2026.08.01", title: "こうよう祭2026の開催が決定しました", content: "今年度のこうよう祭は9月14日（土）・15日（日）の2日間開催となります。皆様のご来場をお待ちしております。" },
]

export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="お知らせ" subtitle="こうよう祭に関するお知らせ一覧">
        <div className="space-y-4 max-w-3xl">
          {newsItems.map((item, i) => (
            <Link href={`/official/news/${item.id}`} key={i}>
              <article className="bg-card p-6 cursor-pointer transition-colors hover:bg-muted border border-[#e6e9ed]">
                <div className="flex items-center gap-3 mb-3">
                  <time className="text-sm text-muted-foreground font-mono">{item.date}</time>
                  {i === 0 && (
                    <span className="text-xs font-medium text-primary-foreground px-2 py-0.5 bg-primary">NEW</span>
                  )}
                </div>
                <h2 className="font-medium text-lg mb-2">{item.title}</h2>
                <p className="text-muted-foreground text-sm line-clamp-1">{item.content}</p>
              </article>
            </Link>
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
