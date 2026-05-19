import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Clock, Users, Ticket } from "lucide-react"

export default function AdmissionPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="入場について" subtitle="入場時間や受付に関するご案内です">
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-card p-6 text-center">
              <Clock className="h-8 w-8 text-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">開場時間</h3>
              <p className="text-2xl font-medium text-foreground">9:30</p>
              <p className="text-sm text-muted-foreground">開会式は9:00から</p>
            </div>
            <div className="bg-card p-6 text-center">
              <Users className="h-8 w-8 text-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">入場料</h3>
              <p className="text-2xl font-medium text-foreground">無料</p>
              <p className="text-sm text-muted-foreground">どなたでもご入場いただけます</p>
            </div>
            <div className="bg-card p-6 text-center">
              <Ticket className="h-8 w-8 text-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">受付</h3>
              <p className="text-2xl font-medium text-foreground">本館1階</p>
              <p className="text-sm text-muted-foreground">パンフレット配布</p>
            </div>
          </div>

          <div className="bg-card p-6">
            <h2 className="font-medium text-lg mb-4">入場の流れ</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-medium shrink-0">1</span>
                <div>
                  <p className="font-medium">正門よりお入りください</p>
                  <p className="text-sm text-muted-foreground">当日は看板・案内係が誘導いたします</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-medium shrink-0">2</span>
                <div>
                  <p className="font-medium">本館1階の受付へお越しください</p>
                  <p className="text-sm text-muted-foreground">パンフレットをお受け取りください</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-medium shrink-0">3</span>
                <div>
                  <p className="font-medium">各企画をお楽しみください</p>
                  <p className="text-sm text-muted-foreground">パンフレットの会場マップをご活用ください</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
