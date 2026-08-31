import { EventSearchSection } from '@/components/event-search';
import { PageLayout } from '@/components/page-layout';
import { RecommendedEventCard } from '@/components/recommended-event-card';

import { getRecommendedEvents } from '@/lib/recommended-events';

export default async function RecommendedEventsPage() {
  const recommendedEvents = await getRecommendedEvents();

  return (
    <>
      <PageLayout subtitle="各パートリーダーがピックアップした、おすすめの企画です" title="おすすめ企画">
        <div className="flex flex-col gap-4">
          {recommendedEvents.map(({ partId, recommender, recommenderIcon, whyRecom, event }) => (
            <RecommendedEventCard
              key={partId}
              event={event}
              recommender={recommender}
              recommenderIcon={recommenderIcon}
              whyRecom={whyRecom}
            />
          ))}
        </div>
      </PageLayout>
      <EventSearchSection variant="compact" />
    </>
  );
}
