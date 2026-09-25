'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { InkPhoto } from '@/components/ui/ink-photo';
import { InkTextLink } from '@/components/ui/ink-text-link';

import type { RecommendedEvent } from '@/lib/recommended-events';

function CompactPick({ pick }: { pick: RecommendedEvent }) {
  const { event, recommender, recommenderIcon, whyRecom } = pick;

  return (
    <div className="ink-shell space-y-3 bg-card p-3">
      <div className="flex items-start gap-3">
        <InkPhoto alt={recommender} className="ink-shell-sm size-8" size={32} src={recommenderIcon} />
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-medium">{recommender}</p>
          {whyRecom ? <p className="mt-1 line-clamp-2 text-sm leading-snug">{whyRecom}</p> : null}
        </div>
      </div>

      <Link className="ink-shell ink-lift flex items-center gap-3 bg-card p-2" href={`/events/${event.slug}`}>
        <InkPhoto alt={event.title} className="ink-shell-sm size-12" size={48} src={event.icon} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{event.title}</p>
          {event.catchphrase ? <p className="line-clamp-1 text-xs text-muted-foreground">{event.catchphrase}</p> : null}
        </div>
      </Link>
    </div>
  );
}

function PickSkeleton() {
  return (
    <div className="ink-shell space-y-3 bg-card p-3">
      <div className="flex items-start gap-3">
        <div className="ink-shell-sm size-8 bg-paper-2" />
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <div className="h-3.5 w-24 rounded-(--radius) bg-paper-2" />
          <div className="h-3.5 w-full rounded-(--radius) bg-paper-2" />
        </div>
      </div>
      <div className="ink-shell flex items-center gap-3 bg-card p-2">
        <div className="ink-shell-sm size-12 bg-paper-2" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-1/2 rounded-(--radius) bg-paper-2" />
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
    <section aria-busy={pick === null} className="bg-paper-2 py-10 md:py-12" data-palette="orange">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-xl font-medium md:text-2xl">おすすめ企画</h2>

          {pick ? <CompactPick pick={pick} /> : <PickSkeleton />}

          <div className="mt-5 text-center">
            <InkTextLink href="/events/recommended">おすすめ企画を見る</InkTextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
