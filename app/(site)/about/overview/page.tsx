import { AboutSection } from '@/components/about/about-section';
import { EventDetails } from '@/components/about/event-details';
import { PageLayout } from '@/components/layout/page-layout';

export default function AboutPage() {
  return (
    <PageLayout subtitle="????????????" title="???????">
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
