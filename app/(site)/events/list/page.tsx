import { Suspense } from 'react';

import { CmsPageLayout } from '@/components/cms/cms-page-layout';
import { EventListSkeleton } from '@/components/cms/skeletons/event-list-skeleton';

import { EventListClient } from './client';

import { getEvents } from '@/lib/events';

export default async function EventListPage() {
  const events = await getEvents();

  return (
    <CmsPageLayout
      meta="eventList"
      related={{
        pages: ['/guide/map', '/events/recommended', '/events/timetable'],
        background: 'paper-2',
      }}
    >
      <Suspense fallback={<EventListSkeleton />}>
        <EventListClient events={events} />
      </Suspense>
    </CmsPageLayout>
  );
}
