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
            <Sparkles className="h-12 w-12 text-foreground mx-auto mb-6" />
            <h2 className="hero-display text-3xl md:text-4xl mb-4">
              今年のテーマ
            </h2>
            <p className="text-xl text-muted-foreground">
              Kotoshi no theme
            </p>
          </div>

          <div className="bg-card p-8 text-left">
            <h3 className="font-medium text-lg mb-4">テーマに込めた想い</h3>
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

          
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
