import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FestivalCountdown } from "@/components/Festivalcountdown"
import { EventSearch } from "@/components/event-search"
import { CategoryEvents } from "@/components/category-events"
import { PrVideoSection } from "@/components/Pr-video-section"
import { SocialCtaSection } from "@/components/Social-cta-section"
import { TimetablePreview } from "@/components/Timetable-preview"
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
        <FestivalCountdown />
        <EventSearch />
        <CategoryEvents />
        <PrVideoSection />
        <SocialCtaSection />
        <TimetablePreview />
        <LinksSection />
        <NewsSection />
        <Sponsors /> 
      </main>
      <SiteFooter />
    </div>
  )
}