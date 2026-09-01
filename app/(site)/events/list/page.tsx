import { Suspense } from 'react';

import { EventListClient } from './client';

import { PageLayout } from '@/components/page-layout';
import { getEvents } from '@/lib/events';
import { Event } from '@/lib/types/event';

export const dynamic = 'force-dynamic';

export default async function EventListPage() {
  let events: Event[] = [];
  let error: string | null = null;

  try {
    const fetchedEvents = await getEvents();
    events = fetchedEvents;
  } catch (err) {
    console.error('イベント取得エラー:', err);
    error = 'イベント情報の読み込みに失敗しました。';
  }

  return (
    <PageLayout subtitle="開催されるすべての企画をカテゴリやキーワードで検索できます" title="企画一覧・検索">
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <Suspense fallback={<div>読み込み中...</div>}>
          <EventListClient events={events} />
        </Suspense>
      )}
    </PageLayout>
  );
}
