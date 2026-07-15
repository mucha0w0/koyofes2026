import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageLayout } from '@/components/page-layout';
import { RecommendedEventCard } from '@/components/recommended-event-card';
import { getRecommendedEvents } from '@/lib/recommended-events';
import { SimpleSerch } from '@/components/Simple-serch';

export default async function RecommendedEventsPage() {
  const recommendedEvents = await getRecommendedEvents();

  return (
    <>
      <SiteHeader />
      <PageLayout title="おすすめ企画" subtitle="各パートリーダーがピックアップした、おすすめの企画です">
        <div className="flex flex-col gap-4">
          {recommendedEvents.map(({ partId, recommender, recommenderIcon, whyRecom, event }) => (
            <RecommendedEventCard
              key={partId}
              recommender={recommender}
              recommenderIcon={recommenderIcon}
              whyRecom={whyRecom}
              event={event}
            />
          ))}
        </div>
      </PageLayout>
      <SimpleSerch />
      <SiteFooter />
    </>
  );
}
