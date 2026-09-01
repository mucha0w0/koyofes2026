import { Suspense } from 'react';

import { EventListClient } from './client';

import { EventListSkeleton } from '@/components/cms/skeletons/event-list-skeleton';
import { PageLayout } from '@/components/layout/page-layout';
import { getEvents } from '@/lib/events';

export default async function EventListPage() {
  const events = await getEvents();

  return (
    <PageLayout subtitle="開催されるすべての企画をカテゴリやキーワードで検索できます" title="企画一覧・検索">
      <Suspense fallback={<EventListSkeleton />}>
        <EventListClient events={events} />
      </Suspense>
    </PageLayout>
  );
}
