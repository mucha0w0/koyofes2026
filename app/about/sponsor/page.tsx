import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Heart } from "lucide-react"

const sponsors = [
  "株式会社○○商事",
  "△△銀行",
  "□□不動産",
  "◇◇食品",
  "○○電機",
  "△△書店",
  "□□スポーツ",
  "◇◇薬局",
]

export default function SponsorPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="協賛" subtitle="こうよう祭をご支援いただいている企業・団体様" backHref="/about" backLabel="こうよう祭についてに戻る">
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="font-bold text-lg">協賛企業・団体一覧</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              こうよう祭の開催にあたり、多くの企業・団体様にご協賛いただいております。
              心より感謝申し上げます。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {sponsors.map((sponsor, i) => (
                <div key={i} className="bg-secondary rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center text-muted-foreground text-xs">
                    LOGO
                  </div>
                  <p className="text-sm font-medium truncate">{sponsor}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">協賛のお願い</h2>
            <p className="text-muted-foreground mb-4">
              こうよう祭では、協賛いただける企業・団体様を募集しております。
              ご興味のある方は、お問い合わせフォームよりご連絡ください。
            </p>
            <a href="/about/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
              お問い合わせ
            </a>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
