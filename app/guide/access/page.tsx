import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Train, Bus, Car, MapPin } from "lucide-react"

export default function AccessPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="アクセス" subtitle="会場までのアクセス方法をご案内します">
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-bold text-lg">会場</h2>
            </div>
            <p className="text-lg font-medium">紅葉高等学校</p>
            <p className="text-muted-foreground">〒000-0000 東京都○○区○○町1-2-3</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Train className="h-5 w-5 text-chart-2" />
                </div>
                <h3 className="font-bold">電車でお越しの方</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>JR○○線「○○駅」より徒歩10分</li>
                <li>私鉄○○線「○○駅」より徒歩15分</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-chart-3/10">
                  <Bus className="h-5 w-5 text-chart-3" />
                </div>
                <h3 className="font-bold">バスでお越しの方</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>○○バス「紅葉高校前」下車すぐ</li>
                <li>○○駅よりバスで約15分</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <Car className="h-5 w-5 text-chart-4" />
                </div>
                <h3 className="font-bold">お車でお越しの方</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>駐車場には限りがあります</li>
                <li>公共交通機関をご利用ください</li>
              </ul>
            </div>
          </div>

          <div className="bg-secondary rounded-xl p-6">
            <h3 className="font-bold mb-4">地図</h3>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              Google Maps埋め込みエリア
            </div>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
