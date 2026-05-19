import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Sparkles } from "lucide-react"

export default function ThemePage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="テーマ" subtitle="こうよう祭2026のテーマについて" backHref="/about" backLabel="こうよう祭についてに戻る">
        <div className="space-y-8 max-w-3xl mx-auto text-center">
          <div className="py-12">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-primary">輝</span>け、青春の1ページ
            </h2>
            <p className="text-xl text-muted-foreground">
              Shine, a page of youth
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 text-left">
            <h3 className="font-bold text-lg mb-4">テーマに込めた想い</h3>
            <p className="text-muted-foreground leading-relaxed">
              高校生活という限られた時間の中で、文化祭は特別な1ページです。
              準備から当日まで、仲間と共に過ごす時間、挑戦する勇気、成功の喜び、
              そのすべてが輝かしい思い出となります。
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              来場される皆様にも、その輝きをお届けしたい。
              そんな想いを込めて、今年のテーマを「輝け、青春の1ページ」としました。
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/20 via-chart-2/20 to-chart-3/20 rounded-xl p-8">
            <h3 className="font-bold text-lg mb-4">テーマカラー</h3>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-2" />
                <span className="text-sm">ゴールド</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-2 mx-auto mb-2" />
                <span className="text-sm">エメラルド</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-background border border-border mx-auto mb-2" />
                <span className="text-sm">ダークネイビー</span>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
