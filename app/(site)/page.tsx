import { FestivalCountdown } from '@/components/Festivalcountdown';
import { LinksSection } from '@/components/LinksSection';
import { NewsSection } from '@/components/NewsSection';
import { PrVideoSection } from '@/components/Pr-video-section';
import { SocialCtaSection } from '@/components/Social-cta-section';
import { TimetablePreview } from '@/components/Timetable-preview';
import { CategoryEvents } from '@/components/category-events';
import { EventSearch } from '@/components/event-search';
import { HeroSection } from '@/components/hero-section';
import { Sponsors } from '@/components/sponsors';

export default function HomePage() {
  return (
    <main>
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
  );
}
