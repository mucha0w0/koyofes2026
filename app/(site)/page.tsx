import { EventSearchSection } from '@/components/events/event-search';
import { CategoryEvents } from '@/components/home/category-events';
import { FestivalCountdown } from '@/components/home/festival-countdown';
import { HeroSection } from '@/components/home/hero-section';
import { LinksSection } from '@/components/home/links-section';
import { PrVideoSection } from '@/components/home/pr-video-section';
import { SocialCtaSection } from '@/components/home/social-cta-section';
import { Sponsors } from '@/components/home/sponsors';
import { StampRallyPreview } from '@/components/home/stamp-rally-preview';
import { TimetablePreview } from '@/components/home/timetable-preview';
import { NewsSection } from '@/components/news/news-section';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FestivalCountdown />
      <EventSearchSection variant="prominent" />
      <StampRallyPreview />
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
