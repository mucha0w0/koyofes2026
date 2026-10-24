'use client';

import { useEffect, useMemo, useState } from 'react';

import { StampBoothGroup } from '@/components/stamp/stamp-booth-rows';
import { InkTextLink } from '@/components/ui/ink-text-link';
import { Progress } from '@/components/ui/progress';

import type { StampBooth, StampStorageData } from '@/lib/types/stamp';

import { findLastCollectedBooth, pickNextStampBooths } from '@/lib/stamp/next-booths';
import { readStampStorage } from '@/lib/stamp/storage';

interface StampRallyPreviewClientProps {
  booths: StampBooth[];
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

          <p className="text-center">
            <InkTextLink href="/stamp">スタンプ帳を見る</InkTextLink>
          </p>

          {totalCount > 0 ? (
            <>
              {ready && lastCollected ? (
                <StampBoothGroup ready booths={[lastCollected]} heading="直前に獲得したスタンプ" skeletonCount={1} />
              ) : null}
              <StampBoothGroup booths={nearbyBooths} heading="近くの未獲得スタンプ" ready={ready} skeletonCount={3} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
