import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Calendar, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="こうよう祭とは" subtitle="紅葉高等学校の文化祭について">
        <div className="space-y-8 max-w-3xl">
          <div className="max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              こうよう祭は、紅葉高等学校で毎年秋に開催される文化祭です。
              生徒一人ひとりが企画・運営に携わり、クラス展示、部活動発表、
              有志によるステージパフォーマンスなど、多彩な企画をお届けします。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card p-6">
              <Calendar className="h-8 w-8 text-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">歴史</h3>
              <p className="text-sm text-muted-foreground">
                こうよう祭は1970年に第1回が開催され、今年で56回目を迎えます。
                半世紀以上にわたり、地域の皆様に愛されてきました。
              </p>
            </div>
            <div className="bg-card p-6">
              <Users className="h-8 w-8 text-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">規模</h3>
              <p className="text-sm text-muted-foreground">
                毎年約3,000人の来場者をお迎えし、50以上の企画が出展されます。
                生徒・保護者・地域の方々が一体となって楽しむイベントです。
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
                <dd className="font-medium">紅葉高等学校</dd>
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
