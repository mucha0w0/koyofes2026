import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { EventSearch } from "@/components/event-search"
import { CategoryEvents } from "@/components/category-events"
import { LinksSection } from "@/components/LinksSection"
import { NewsSection } from "@/components/NewsSection"
import { Sponsors } from "@/components/sponsors"
import { SiteFooter } from "@/components/site-footer"

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <EventSearch />
        <CategoryEvents />
        <LinksSection />
        <NewsSection />
        <Sponsors /> 
      </main>
      <SiteFooter />
    </div>
  )
}