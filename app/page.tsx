import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { EventSearch } from "@/components/event-search"
import { CategoryEvents } from "@/components/category-events"
import { ContentSection } from "@/components/content-section"
import { Sponsors } from "@/components/sponsors"
import { SiteFooter } from "@/components/site-footer"

// 常に最新データを動的にレンダリング（microCMS更新を反映）
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <EventSearch />
        <CategoryEvents />
        <ContentSection />
        <Sponsors />
      </main>
      <SiteFooter />
    </div>
  )
}
