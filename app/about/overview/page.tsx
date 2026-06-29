import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import AboutSection from "@/components/about-section"
import EventDetails from "@/components/event-details"

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="こうよう祭とは" subtitle="豊田高専の文化祭について">
        <div className="space-y-8 max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed">
            こうよう祭は、豊田高専で毎年秋に開催される文化祭です。
            日頃の教育・文化活動の展示、豊田高専ならではのステージイベント及び、スペシャルゲストによるオンステージなどの企画を多数予定しています。
          </p>
          <AboutSection />
          <EventDetails />
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
