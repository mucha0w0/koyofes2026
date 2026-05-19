import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Twitter, ExternalLink } from "lucide-react"

export default function TwitterPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="公式X (Twitter)" subtitle="リアルタイムな情報をお届けします">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="bg-black w-24 h-24 rounded-2xl flex items-center justify-center mx-auto">
            <Twitter className="h-12 w-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">@kouyousai2026</h2>
            <p className="text-muted-foreground">
              当日のリアルタイム情報、混雑状況、緊急のお知らせなどをお届けします。
            </p>
          </div>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Xをフォロー
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
