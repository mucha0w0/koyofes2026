import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Youtube, ExternalLink } from "lucide-react"

export default function YoutubePage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="公式YouTube" subtitle="動画でこうよう祭をお届けします">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="bg-primary w-24 h-24 flex items-center justify-center mx-auto">
            <Youtube className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-medium mb-2">こうよう祭公式チャンネル</h2>
            <p className="text-muted-foreground">
              ステージイベントのダイジェスト、企画紹介動画などを配信します。
            </p>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity"
          >
            チャンネル登録
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
