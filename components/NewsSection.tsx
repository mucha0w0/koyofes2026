import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getNews, MicroCMSNews } from "@/lib/microcms"

export async function NewsSection() {
  let news: MicroCMSNews[] = []

  try {
    const allNews = await getNews()
    // トップページ用の最新3件のみにスライス
    news = allNews.slice(0, 3)
  } catch (error) {
    console.error("ニュース取得エラー(NewsSection):", error)
  }

  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-medium">お知らせ</h2>
            <Link
              href="/official/news"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              すべて見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {news.length > 0 ? (
              news.map((item, index) => {
                // dateを表示用にフォーマット
                const formattedDate = new Date(item.date)
                  .toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\//g, ".")

                return (
                  <Link
                    key={item.id}
                    href={`/official/news/${item.id}`}
                    className="flex items-center gap-4 p-4 bg-card transition-opacity hover:opacity-80 group"
                  >
                    <span className="text-sm text-muted-foreground font-mono shrink-0">
                      {formattedDate}
                    </span>
                    {index === 0 && (
                      <span className="text-xs font-medium text-primary-foreground px-2 py-0.5 bg-primary shrink-0">
                        NEW
                      </span>
                    )}
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                  </Link>
                )
              })
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                ニュースはまだ投稿されていません。
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}