import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { FileText, Download } from "lucide-react"

export default function PamphletPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="パンフレット" subtitle="こうよう祭2026公式パンフレット">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-card p-8 text-center">
            <div className="w-24 h-32 bg-muted mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-12 w-12 text-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">公式パンフレット</h2>
            <p className="text-muted-foreground mb-6">
              企画一覧、会場マップ、タイムテーブルなどを掲載した公式パンフレットです。
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity">
              <Download className="h-5 w-5" />
              PDFをダウンロード
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              ※公開は2026年9月上旬を予定しています
            </p>
          </div>

          <div className="bg-muted p-6">
            <h3 className="font-medium mb-4">当日配布について</h3>
            <p className="text-sm text-muted-foreground">
              当日は本館1階の受付にて、紙のパンフレットを無料配布いたします。
              数に限りがございますので、予めご了承ください。
            </p>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
