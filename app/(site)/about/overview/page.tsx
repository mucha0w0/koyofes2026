import AboutSection from '@/components/about-section';
import EventDetails from '@/components/event-details';
import { PageLayout } from '@/components/page-layout';

export default function AboutPage() {
  return (
      <PageLayout subtitle="豊田高専の文化祭について" title="こうよう祭とは">
        <div className="flex flex-col md:flex-row md:gap-12 md:items-start">
          <div className="flex-1 min-w-0">
            <AboutSection />
          </div>
          <div className="md:w-72 md:shrink-0">
            <EventDetails />
          </div>
        </div>
      </PageLayout>
    );
}
