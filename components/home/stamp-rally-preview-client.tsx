'use client';

import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import type { StampBooth, StampStorageData } from '@/lib/types/stamp';

import { getEventCategoryLabel } from '@/lib/config/event-categories';
import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import { formatLocation } from '@/lib/event-display';
import { findLastCollectedBooth, pickNextStampBooths } from '@/lib/stamp/next-booths';
import { readStampStorage } from '@/lib/stamp/storage';
import { isImageUrl } from '@/lib/utils';

interface StampRallyPreviewClientProps {
  booths: StampBooth[];
}

function boothLocationLabel(booth: StampBooth): string {
  const display = formatLocation(booth);
  return [display.firstLine, display.secondLine].filter(Boolean).join(' ');
}

function LotterySlots({ emphasized, filled, total }: { emphasized: boolean; filled: number; total: number }) {
  return (
    <div aria-hidden className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-2.5 w-2.5 ${
            index < filled ? (emphasized ? 'bg-white' : 'bg-primary') : emphasized ? 'bg-white/25' : 'bg-foreground/20'
          }`}
        />
      ))}
    </div>
  );
}

function NextBoothRow({ booth }: { booth: StampBooth }) {
  const hasIcon = isImageUrl(booth.icon);
  const locationLabel = boothLocationLabel(booth);
  const categoryLabel = getEventCategoryLabel(booth.category);

  return (
    <Link
      className="group flex items-center gap-4 bg-card p-4 transition-opacity hover:opacity-80"
      href={`/events/${booth.slug}`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-muted md:h-16 md:w-16">
        {hasIcon ? (
          <Image alt={booth.title} className="h-full w-full object-cover" height={64} src={booth.icon} width={64} />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{booth.title}</p>
        {booth.organization ? <p className="truncate text-xs text-muted-foreground">{booth.organization}</p> : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{categoryLabel}</span>
          {locationLabel ? (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </span>
          ) : null}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function NextBoothSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-card p-4">
      <div className="h-14 w-14 shrink-0 bg-muted md:h-16 md:w-16" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-1/2 bg-muted" />
        <div className="h-3 w-1/3 bg-muted" />
      </div>
    </div>
  );
}

export function StampRallyPreviewClient({ booths }: StampRallyPreviewClientProps) {
  const [storage, setStorage] = useState<StampStorageData | null>(null);

  useEffect(() => {
    setStorage(readStampStorage());
  }, []);

  const requiredCount = STAMP_CONFIG.clearConditions.requiredStampCount;
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
  const isRedeemed = storage?.isRedeemed ?? false;
  const isCleared = collectedCount >= requiredCount;
  const remainingToClear = Math.max(requiredCount - collectedCount, 0);
  const emphasized = ready && (isCleared || isRedeemed);
  const safeTotal = Math.max(totalCount, 1);
  const progressValue = ready ? Math.min(100, Math.round((collectedCount / safeTotal) * 100)) : 0;
  const lotteryMark = totalCount > 0 ? Math.min(100, Math.round((requiredCount / safeTotal) * 100)) : 0;
  const lotteryFilled = ready ? Math.min(collectedCount, requiredCount) : 0;

  const lastCollected = storage ? findLastCollectedBooth(booths, storage.stamps) : undefined;
  const nextBooths = ready
    ? pickNextStampBooths(booths, collectedSlugs, {
        preferClassroom: lastCollected?.classroom,
        preferFloor: lastCollected?.floor,
        preferLocation: lastCollected?.location,
      })
    : [];
  const prefersNearby = nextBooths.some(
    (booth) =>
      Boolean(lastCollected?.classroom && booth.classroom === lastCollected.classroom) ||
      Boolean(lastCollected?.floor && booth.floor === lastCollected.floor),
  );

  const statusMessage = (() => {
    if (!ready) {
      return 'クラス・学科展・有志展示を回ってスタンプを集めよう';
    }
    if (totalCount === 0) {
      return '現在表示できるスタンプ対象ブースがありません';
    }
    if (collectedCount === totalCount && totalCount > 0) {
      return '対象ブースのスタンプをすべて集めました';
    }
    if (isRedeemed) {
      return 'ふくびき参加券は引き換え済みです。スタンプ集めは続けられます';
    }
    if (isCleared) {
      return '条件達成です。スタンプ帳でふくびき参加券を表示できます';
    }
    if (collectedCount === 0) {
      return `クラス・学科展・有志展示を回ってスタンプを集めよう。${requiredCount}個でふくびき券`;
    }
    return `あと ${remainingToClear} 個でふくびき券 GET！`;
  })();

  const nextHeading = (() => {
    if (!ready) {
      return '次に目指すブース';
    }
    if (nextBooths.length === 0) {
      return null;
    }
    if (collectedCount === 0) {
      return 'まずはここから';
    }
    if (isCleared) {
      return 'まだ回れるブース';
    }
    if (prefersNearby) {
      return '近くの未獲得ブース';
    }
    return '次に目指すブース';
  })();

  const ctaLabel = ready && isCleared && !isRedeemed ? 'ふくびき参加券を表示する' : 'スタンプ帳を開く';

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">Rally</p>
              <h2 className="text-xl font-medium md:text-2xl">スタンプラリー</h2>
            </div>
            <Link
              className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              href="/stamp"
            >
              スタンプ帳を見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div
            className={`space-y-5 p-6 ${emphasized ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <p
                  className={`text-sm leading-loose tracking-wider ${
                    emphasized ? 'text-white/85' : 'text-muted-foreground'
                  }`}
                >
                  {statusMessage}
                </p>
              </div>
              <p className="shrink-0 text-sm tracking-wider">
                {ready && totalCount > 0 ? (
                  <span className="text-3xl font-medium tracking-normal tabular-nums">{collectedCount}</span>
                ) : (
                  <span className="text-3xl font-medium tracking-normal text-muted-foreground tabular-nums">—</span>
                )}
                <span className={emphasized ? 'text-white/70' : 'text-muted-foreground'}> / {totalCount}</span>
              </p>
            </div>

            {totalCount > 0 ? (
              <div className="relative">
                <Progress
                  className={`h-2.5 rounded-none ${
                    emphasized ? 'bg-white/25 **:data-[slot=progress-indicator]:bg-white' : 'bg-muted'
                  }`}
                  value={progressValue}
                />
                {lotteryMark > 0 && lotteryMark < 100 ? (
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute top-1/2 h-4 w-px -translate-y-1/2 ${
                      emphasized ? 'bg-white/55' : 'bg-foreground/35'
                    }`}
                    style={{ left: `${lotteryMark}%` }}
                    title={`ふくびき条件: ${requiredCount} 個`}
                  />
                ) : null}
              </div>
            ) : null}

            <div
              className={`flex flex-wrap items-center justify-between gap-3 text-xs tracking-wider ${
                emphasized ? 'text-white/65' : 'text-muted-foreground'
              }`}
            >
              <span>ふくびき条件 {requiredCount} 個</span>
              <LotterySlots emphasized={emphasized} filled={lotteryFilled} total={requiredCount} />
            </div>

            <Button
              asChild
              className={`w-full rounded-none ${
                emphasized ? 'bg-white/20 text-white hover:bg-white/30 hover:opacity-100' : ''
              }`}
              size="lg"
              variant={emphasized ? 'ghost' : 'default'}
            >
              <Link href="/stamp">{ctaLabel}</Link>
            </Button>
          </div>

          {totalCount > 0 && nextHeading ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">{nextHeading}</h3>
              <div className="grid gap-2">
                {ready
                  ? nextBooths.map((booth) => <NextBoothRow key={booth.slug} booth={booth} />)
                  : Array.from({ length: 3 }, (_, index) => <NextBoothSkeleton key={index} />)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
