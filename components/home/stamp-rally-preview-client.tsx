'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { InkPhoto } from '@/components/ui/ink-photo';
import { InkTextLink } from '@/components/ui/ink-text-link';
import { Progress } from '@/components/ui/progress';

import type { StampBooth, StampStorageData } from '@/lib/types/stamp';

import { getEventCategoryLabel } from '@/lib/config/event-categories';
import { formatLocation } from '@/lib/event-display';
import { findLastCollectedBooth, pickNextStampBooths } from '@/lib/stamp/next-booths';
import { readStampStorage } from '@/lib/stamp/storage';

interface StampRallyPreviewClientProps {
  booths: StampBooth[];
}

function boothLocationLabel(booth: StampBooth): string {
  const display = formatLocation(booth);
  return [display.firstLine, display.secondLine].filter(Boolean).join(' ');
}

function BoothRow({ booth }: { booth: StampBooth }) {
  const locationLabel = boothLocationLabel(booth);
  const categoryLabel = getEventCategoryLabel(booth.category);

  return (
    <Link className="ink-shell ink-lift group flex items-center gap-4 bg-card p-4" href={`/events/${booth.slug}`}>
      <InkPhoto alt={booth.title} className="ink-shell-sm size-14" size={56} src={booth.icon} />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{booth.title}</p>
        {booth.organization ? <p className="truncate text-xs text-muted-foreground">{booth.organization}</p> : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{categoryLabel}</span>
          {locationLabel ? <span className="truncate">{locationLabel}</span> : null}
        </div>
      </div>
    </Link>
  );
}

function BoothRowSkeleton() {
  return (
    <div className="ink-shell flex items-center gap-4 bg-card p-4">
      <div className="size-14 shrink-0 rounded-[var(--radius)] bg-paper-2" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded-[var(--radius)] bg-paper-2" />
        <div className="h-3 w-1/3 rounded-[var(--radius)] bg-paper-2" />
      </div>
    </div>
  );
}

function BoothGroup({
  heading,
  booths,
  ready,
  skeletonCount,
}: {
  heading: string;
  booths: StampBooth[];
  ready: boolean;
  skeletonCount: number;
}) {
  if (ready && booths.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-center text-sm font-medium">{heading}</h3>
      <div className="grid gap-3">
        {ready
          ? booths.map((booth) => <BoothRow key={booth.slug} booth={booth} />)
          : Array.from({ length: skeletonCount }, (_, index) => <BoothRowSkeleton key={index} />)}
      </div>
    </div>
  );
}

export function StampRallyPreviewClient({ booths }: StampRallyPreviewClientProps) {
  const [storage, setStorage] = useState<StampStorageData | null>(null);

  useEffect(() => {
    setStorage(readStampStorage());
  }, []);

  const totalCount = booths.length;
  const ready = storage !== null;
  const boothSlugSet = useMemo(() => new Set(booths.map((booth) => booth.slug)), [booths]);

  const collectedSlugs = useMemo(() => {
    if (!storage) {
      return new Set<string>();
    }
    return new Set(storage.stamps.map((stamp) => stamp.slug).filter((slug) => boothSlugSet.has(slug)));
  }, [storage, boothSlugSet]);

  const collectedCount = collectedSlugs.size;
  const safeTotal = Math.max(totalCount, 1);
  const progressValue = ready ? Math.min(100, Math.round((collectedCount / safeTotal) * 100)) : 0;

  const lastCollected = storage ? findLastCollectedBooth(booths, storage.stamps) : undefined;
  const nearbyBooths = ready
    ? pickNextStampBooths(booths, collectedSlugs, {
        preferClassroom: lastCollected?.classroom,
        preferFloor: lastCollected?.floor,
        preferLocation: lastCollected?.location,
      })
    : [];

  return (
    <section className="bg-background py-16 md:py-24" data-palette="green">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-medium md:text-2xl">スタンプラリー</h2>
            <p className="mt-3">
              <InkTextLink href="/stamp">スタンプ帳を見る</InkTextLink>
            </p>
          </div>

          {totalCount > 0 ? (
            <div className="ink-shell flex items-center gap-4 bg-card px-4 py-3">
              <p className="shrink-0 text-sm">
                {ready ? (
                  <span className="text-lg font-medium tracking-normal tabular-nums">{collectedCount}</span>
                ) : (
                  <span className="text-lg font-medium tracking-normal text-muted-foreground tabular-nums">—</span>
                )}
                <span className="text-muted-foreground"> / {totalCount}</span>
              </p>
              <Progress className="h-1.5 bg-mist" value={progressValue} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">現在表示できるスタンプ対象ブースがありません</p>
          )}

          {totalCount > 0 ? (
            <>
              {ready && lastCollected ? (
                <BoothGroup ready booths={[lastCollected]} heading="直前に獲得したスタンプ" skeletonCount={1} />
              ) : null}
              <BoothGroup booths={nearbyBooths} heading="近くのスタンプ未獲得ブース" ready={ready} skeletonCount={3} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
