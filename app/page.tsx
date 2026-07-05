import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { EventSearch } from "@/components/event-search"
import { CategoryEvents } from "@/components/category-events"
import { LinksSection } from "@/components/LinksSection"
import { NewsSection } from "@/components/NewsSection"
import { Sponsors } from "@/components/sponsors"
import { SiteFooter } from "@/components/site-footer"
import { fetchSponsorsFromMicroCMS } from "@/lib/microcms"
import { transformMicroCMSSponsor } from "@/lib/sponsors"
import type { SponsorItem } from "@/lib/types/sponsor"

// 常に最新データを動的にレンダリング（microCMS更新を反映） を一旦コメントアウト
// export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let sponsorItems: SponsorItem[] = []

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
        <LinksSection />
        <NewsSection />
        <Sponsors sponsors={sponsorItems} />
      </main>
      <SiteFooter />
    </div>
  )
}