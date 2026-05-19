import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Instagram, ExternalLink } from "lucide-react"

export default function InstagramPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="公式Instagram" subtitle="最新情報をInstagramでチェック">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="bg-primary w-24 h-24 flex items-center justify-center mx-auto">
            <Instagram className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-medium mb-2">@kouyousai2026</h2>
            <p className="text-muted-foreground">
              こうよう祭の準備風景や企画紹介、当日の様子などをお届けします。
            </p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity"
          >
            Instagramをフォロー
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
