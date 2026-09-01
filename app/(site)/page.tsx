import { FestivalCountdown } from '@/components/home/festival-countdown';
import { LinksSection } from '@/components/home/links-section';
import { NewsSection } from '@/components/news/news-section';
import { PrVideoSection } from '@/components/home/pr-video-section';
import { SocialCtaSection } from '@/components/home/social-cta-section';
import { TimetablePreview } from '@/components/home/timetable-preview';
import { CategoryEvents } from '@/components/home/category-events';
import { EventSearchSection } from '@/components/events/event-search';
import { HeroSection } from '@/components/home/hero-section';
import { Sponsors } from '@/components/home/sponsors';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FestivalCountdown />
      <EventSearchSection variant="prominent" />
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
