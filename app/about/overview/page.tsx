import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageLayout } from '@/components/page-layout';
import AboutSection from '@/components/about-section';
import EventDetails from '@/components/event-details';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="こうよう祭とは" subtitle="豊田高専の文化祭について">
        <div className="flex flex-col md:flex-row md:gap-12 md:items-start">
          <div className="flex-1 min-w-0">
            <AboutSection />
          </div>
          <div className="md:w-72 md:shrink-0">
            <EventDetails />
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
