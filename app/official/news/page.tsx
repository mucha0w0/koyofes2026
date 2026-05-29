import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import { getNews, MicroCMSNews } from "@/lib/microcms"
// 👇 ここで UI コンポーネントをインポートします
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card"

export const revalidate = 60 // 1分ごとにISR

export default async function NewsPage() {
  let newsItems: MicroCMSNews[] = []
  let error: string | null = null

  try {
    newsItems = await getNews()
  } catch (err) {
    error = err instanceof Error ? err.message : "ニュースの取得に失敗しました"
    console.error("ニュース取得エラー:", err)
  }

  return (
    <>
      <SiteHeader />
      <PageLayout title="お知らせ" subtitle="こうよう祭に関するお知らせ一覧">
        {error ? (
          <div className="max-w-3xl text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="max-w-3xl text-center py-12">
            <p className="text-muted-foreground">ニュースはまだ投稿されていません。</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {newsItems.map((item, i) => {
              // dateを表示用にフォーマット
              const formattedDate = new Date(item.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).replace(/\//g, '.')

              // contentからHTMLタグを削除して、1行に省略
              const plainContent = item.content
                .replace(/<[^>]*>/g, '')
                .trim()

              return (
                <Link href={`/official/news/${item.id}`} key={item.id} className="block group">
                  {/* 👇 <article> を <Card> に変更 */}
                  <Card className="border border-[#e6e9ed] transition-colors group-hover:bg-muted cursor-pointer">
                    
                    {/* 👇 ヘッダー部分に日付とタイトル、NEWバッジを配置 */}
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <time className="text-sm text-muted-foreground font-mono">{formattedDate}</time>
                      </div>
                      
                      <CardTitle className="font-medium text-lg mt-1">
                        {item.title}
                      </CardTitle>

                      {/* 👇 NEWバッジを CardAction (右上・端の要素用) に入れると綺麗に収まります */}
                      {i === 0 && (
                        <CardAction>
                          <span className="text-xs font-medium text-primary-foreground px-2 py-0.5 bg-primary rounded-sm">
                            NEW
                          </span>
                        </CardAction>
                      )}
                    </CardHeader>

                    {/* 👇 本文を CardContent に配置 */}
                    <CardContent className="pb-6">
                      <CardDescription className="text-muted-foreground text-sm line-clamp-1">
                        {plainContent}
                      </CardDescription>
                    </CardContent>

                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  )
}