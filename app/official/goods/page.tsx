import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { ShoppingBag } from "lucide-react"

const goods = [
  { name: "公式Tシャツ", price: "¥2,000", description: "今年のテーマをデザイン" },
  { name: "トートバッグ", price: "¥1,500", description: "A4サイズ対応" },
  { name: "缶バッジセット", price: "¥500", description: "5個入り" },
  { name: "ステッカー", price: "¥300", description: "3枚セット" },
]

export default function GoodsPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="公式グッズ" subtitle="こうよう祭2026オリジナルグッズ">
        <div className="space-y-8">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <p className="text-muted-foreground">
              公式グッズは当日、本館1階の受付横で販売いたします。
              数量限定のため、お早めにお求めください。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {goods.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="aspect-square bg-secondary flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-lg font-bold text-primary">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
