import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"

export default function MapPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="会場マップ" subtitle="校内の各施設・企画の配置図です">
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">フロアマップ</h2>
            <div className="aspect-[4/3] bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
              会場マップ画像エリア
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-2">本館1階</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>受付・案内所</li>
                <li>1年生展示</li>
                <li>救護室</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-2">本館2階</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>2年生展示</li>
                <li>休憩スペース</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-2">本館3階</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>3年生展示</li>
                <li>お化け屋敷</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-2">体育館</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>ステージイベント</li>
                <li>開閉会式</li>
              </ul>
            </div>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
