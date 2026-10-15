import Link from 'next/link';

import { InkPhoto } from '@/components/ui/ink-photo';

import type { StampBooth } from '@/lib/types/stamp';

import { getEventCategoryLabel } from '@/lib/config/event-categories';
import { formatLocation } from '@/lib/event-display';

function boothLocationLabel(booth: StampBooth): string {
  const display = formatLocation(booth);
  return [display.firstLine, display.secondLine].filter(Boolean).join(' ');
}

export function StampBoothRow({ booth }: { booth: StampBooth }) {
  const locationLabel = boothLocationLabel(booth);
  const categoryLabel = getEventCategoryLabel(booth.category);

  return (
    <Link
      className="ink-shell ink-lift group flex h-24 items-stretch gap-4 bg-card py-1.5 pr-4 pl-1.5"
      href={`/events/${booth.slug}`}
      prefetch={false}
    >
      <InkPhoto
        alt={booth.title}
        className="ink-shell-sm ink-row-icon h-full min-w-0 w-auto shrink overflow-hidden"
        size={128}
        src={booth.icon}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1">
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

export function StampBoothRowSkeleton() {
  return (
    <div className="ink-shell flex h-24 items-stretch gap-4 bg-card py-1.5 pr-4 pl-1.5">
      <div className="ink-row-icon rounded-(--radius) bg-paper-2" />
      <div className="flex min-w-0 flex-1 flex-col justify-center space-y-2">
        <div className="h-4 w-1/2 rounded-(--radius) bg-paper-2" />
        <div className="h-3 w-1/3 rounded-(--radius) bg-paper-2" />
      </div>
    </div>
  );
}

export function StampBoothGroup({
  heading,
  headingLevel: Heading = 'h3',
  booths,
  ready,
  skeletonCount,
}: {
  heading: string;
  headingLevel?: 'h2' | 'h3';
  booths: StampBooth[];
  ready: boolean;
  skeletonCount: number;
}) {
  if (ready && booths.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Heading className="text-center text-sm font-medium">{heading}</Heading>
      <div className="grid gap-3">
        {ready
          ? booths.map((booth) => <StampBoothRow key={booth.slug} booth={booth} />)
          : Array.from({ length: skeletonCount }, (_, index) => <StampBoothRowSkeleton key={index} />)}
      </div>
    </div>
  );
}
