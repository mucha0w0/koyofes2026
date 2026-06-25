import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { EventSearch } from "@/components/event-search"
import { CategoryEvents } from "@/components/category-events"
import { ContentSection } from "@/components/content-section"
import { Sponsors } from "@/components/sponsors"
import { SiteFooter } from "@/components/site-footer"
import { getNews, MicroCMSNews, fetchSponsorsFromMicroCMS } from "@/lib/microcms"
import { transformMicroCMSSponsor } from "@/lib/sponsors"
import type { SponsorItem } from "@/lib/types/sponsor"

// 常に最新データを動的にレンダリング（microCMS更新を反映）
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let newsItems: MicroCMSNews[] = []
  let sponsorItems: SponsorItem[] = []

  try {
    const allNews = await getNews()
    // 最新3件のみ取得
    newsItems = allNews.slice(0, 3)
  } catch (error) {
    console.error("ニュース取得エラー:", error)
  }

  try {
    const sponsors = await fetchSponsorsFromMicroCMS()
    sponsorItems = sponsors.map(transformMicroCMSSponsor)
  } catch (error) {
    console.error("協賛取得エラー:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <EventSearch />
        <CategoryEvents />
        <ContentSection news={newsItems} />
        <Sponsors sponsors={sponsorItems} />
      </main>
      <SiteFooter />
    </div>
  )
}
