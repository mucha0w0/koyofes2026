import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Calendar, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="こうよう祭とは" subtitle="豊田高専の文化祭について">
        <div className="space-y-8 max-w-3xl">
          <div className="max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              こうよう祭は、豊田高専で毎年秋に開催される文化祭です。
              日頃の教育・文化活動の展示、豊田高専ならではのステージイベント及び、スペシャルゲストによるオンステージなどの企画を多数予定しています。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card p-6">
              <Calendar className="h-8 w-8 text-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">由来</h3>
              <p className="text-sm text-muted-foreground">
                「秋で木々がこうようするころ、文化祭で気分をこうようさせに、豊田高専にいこうよう」というトリプルミーニングが由来です。
              </p>
            </div>
          </div>

          <div className="bg-muted p-6">
            <h3 className="font-medium text-lg mb-4">こうよう祭2026</h3>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">開催日</dt>
                <dd className="font-medium text-lg">2026年9月14日（土）・15日（日）</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">開催時間</dt>
                <dd className="font-medium text-lg">9:00 - 17:00</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">会場</dt>
                <dd className="font-medium">豊田高専</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">入場料</dt>
                <dd className="font-medium">無料</dd>
              </div>
            </dl>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
