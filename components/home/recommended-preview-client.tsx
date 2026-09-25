'use client';

import { useEffect, useState } from 'react';

import { RecommendedEventCard } from '@/components/events/recommended-event-card';
import { InkTextLink } from '@/components/ui/ink-text-link';

import type { RecommendedEvent } from '@/lib/recommended-events';

function PickSkeleton() {
  return (
    <div className="ink-shell space-y-4 bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="ink-shell-sm size-10 bg-paper-2" />
        <div className="h-4 w-24 rounded-(--radius) bg-paper-2" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded-(--radius) bg-paper-2" />
        <div className="h-4 w-4/5 rounded-(--radius) bg-paper-2" />
      </div>
      <div className="ink-shell flex items-center gap-4 bg-card p-4">
        <div className="ink-shell-sm size-16 bg-paper-2" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded-(--radius) bg-paper-2" />
          <div className="h-3 w-2/3 rounded-(--radius) bg-paper-2" />
        </div>
      </div>
    </div>
  );
}

export function RecommendedPreviewClient({ items }: { items: RecommendedEvent[] }) {
  const [pick, setPick] = useState<RecommendedEvent | null>(null);

  useEffect(() => {
    const index = Math.floor(Math.random() * items.length);
    setPick(items[index] ?? null);
  }, [items]);

  return (
    <section aria-busy={pick === null} className="bg-paper-2 py-16 md:py-24" data-palette="orange">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-medium md:text-3xl">おすすめ企画</h2>
            <p className="text-muted-foreground">パートリーダーからのひとこと</p>
          </div>

          {pick ? (
            <RecommendedEventCard
              event={pick.event}
              recommender={pick.recommender}
              recommenderIcon={pick.recommenderIcon}
              whyRecom={pick.whyRecom}
            />
          ) : (
            <PickSkeleton />
          )}

          <div className="mt-8 text-center">
            <InkTextLink href="/events/recommended">おすすめ企画を見る</InkTextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
