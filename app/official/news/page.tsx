import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import { getNews, MicroCMSNews } from "@/lib/microcms"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card"

export const revalidate = 60 // 1分ごとにISR

const ITEMS_PER_PAGE = 10

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)

  let newsItems: MicroCMSNews[] = []
  let error: string | null = null
  try {
    newsItems = await getNews()
  } catch (err) {
    error = err instanceof Error ? err.message : "ニュースの取得に失敗しました"
    console.error("ニュース取得エラー:", err)
  }

  const totalPages = Math.max(1, Math.ceil(newsItems.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedItems = newsItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
          <>
            <div className="space-y-4 max-w-3xl">
              {paginatedItems.map((item, i) => {
                const globalIndex = startIndex + i
                const formattedDate = new Date(item.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }).replace(/\//g, '.')
                const plainContent = item.content
                  .replace(/<[^>]*>/g, '')
                  .trim()
                return (
                  <Link href={`/official/news/${item.id}`} key={item.id} className="block group">
                    <Card className="border border-[#e6e9ed] transition-colors group-hover:bg-muted cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <time className="text-sm text-muted-foreground font-mono">{formattedDate}</time>
                        </div>
                        <CardTitle className="font-medium text-lg mt-1">
                          {item.title}
                        </CardTitle>
                        {globalIndex === 0 && (
                          <CardAction>
                            <span className="text-xs font-medium text-primary-foreground px-2 py-0.5 bg-primary rounded-sm">
                              NEW
                            </span>
                          </CardAction>
                        )}
                      </CardHeader>
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

            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-8" aria-label="ページネーション">
                <Link
                  href={`/official/news?page=${Math.max(1, safePage - 1)}`}
                  aria-disabled={safePage === 1}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    safePage === 1
                      ? "pointer-events-none text-muted-foreground/40"
                      : "text-foreground hover:opacity-70"
                  }`}
                >
                  前へ
                </Link>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/official/news?page=${pageNum}`}
                    className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-colors ${
                      pageNum === safePage
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:opacity-70"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                <Link
                  href={`/official/news?page=${Math.min(totalPages, safePage + 1)}`}
                  aria-disabled={safePage === totalPages}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    safePage === totalPages
                      ? "pointer-events-none text-muted-foreground/40"
                      : "text-foreground hover:opacity-70"
                  }`}
                >
                  次へ
                </Link>
              </nav>
            )}
          </>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  )
}