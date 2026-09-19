'use client';

import Link from 'next/link';

import { InkPhoto } from '@/components/ui/ink-photo';

import type { StampBooth } from '@/lib/types/stamp';

import { isImageUrl } from '@/lib/utils';

interface StampBoothCardProps {
  booth: StampBooth;
  collected: boolean;
}

export function StampBoothCard({ booth, collected }: StampBoothCardProps) {
  const hasIcon = isImageUrl(booth.icon);

  return (
    <Link className="group flex shrink-0 flex-col items-center gap-2" href={`/events/${booth.slug}`}>
      <div className="relative">
        <InkPhoto
          alt={booth.title}
          className="size-20 md:size-32"
          dimmed={!collected}
          size={128}
          src={hasIcon ? booth.icon : undefined}
        />
        <span className="absolute inset-x-1 bottom-1 rounded-[4px] bg-card/90 py-0.5 text-center text-[10px] font-medium text-ink md:text-xs">
          {collected ? '獲得済み' : '未獲得'}
        </span>
      </div>
      <div className="max-w-20 text-center md:max-w-32">
        <p className="truncate text-xs font-medium md:text-sm">{booth.title}</p>
        {booth.organization ? (
          <p className="truncate text-xs text-muted-foreground md:text-sm">{booth.organization}</p>
        ) : null}
      </div>
    </Link>
  );
}
