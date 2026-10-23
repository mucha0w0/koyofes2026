'use client';

import { useEffect, useMemo, useState } from 'react';

import { StampBoothGroup } from '@/components/stamp/stamp-booth-rows';

import type { StampBooth, StampStorageData } from '@/lib/types/stamp';

import { findLastCollectedBooth, pickNextStampBooths } from '@/lib/stamp/next-booths';
import { readStampStorage } from '@/lib/stamp/storage';

interface StampSuggestionsProps {
  booths: StampBooth[];
}

export function StampSuggestions({ booths }: StampSuggestionsProps) {
  const [storage, setStorage] = useState<StampStorageData | null>(null);

  useEffect(() => {
    setStorage(readStampStorage());
  }, []);

  const ready = storage !== null;
  const boothSlugSet = useMemo(() => new Set(booths.map((booth) => booth.slug)), [booths]);

  const collectedSlugs = useMemo(() => {
    if (!storage) {
      return new Set<string>();
    }
    return new Set(storage.stamps.map((stamp) => stamp.slug).filter((slug) => boothSlugSet.has(slug)));
  }, [storage, boothSlugSet]);

  const lastCollected = storage ? findLastCollectedBooth(booths, storage.stamps) : undefined;
  const nearbyBooths = ready
    ? pickNextStampBooths(booths, collectedSlugs, {
        preferClassroom: lastCollected?.classroom,
        preferFloor: lastCollected?.floor,
        preferLocation: lastCollected?.location,
      })
    : [];

  if (booths.length === 0) {
    return null;
  }

  const showLast = ready && Boolean(lastCollected);
  const showNearby = !ready || nearbyBooths.length > 0;

  if (!showLast && !showNearby) {
    return null;
  }

  return (
    <section className="bg-paper-2 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {showLast && lastCollected ? (
            <StampBoothGroup
              ready
              booths={[lastCollected]}
              heading="直前に獲得したスタンプ"
              headingLevel="h2"
              skeletonCount={1}
            />
          ) : null}
          {showNearby ? (
            <StampBoothGroup
              booths={nearbyBooths}
              heading="近くの未獲得スタンプ"
              headingLevel="h2"
              ready={ready}
              skeletonCount={3}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
