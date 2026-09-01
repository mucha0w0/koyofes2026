import { CmsPageLayout } from '@/components/cms/cms-page-layout';
import { EventSearchSection } from '@/components/events/event-search';
import { RecommendedEventCard } from '@/components/events/recommended-event-card';

import { getRecommendedEvents } from '@/lib/recommended-events';

export default async function RecommendedEventsPage() {
  const recommendedEvents = await getRecommendedEvents();

  return (
    <>
      <CmsPageLayout meta="eventRecommended">
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
      </CmsPageLayout>
      <EventSearchSection variant="compact" />
    </>
  );
}
