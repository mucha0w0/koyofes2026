'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { StampBooth } from '@/lib/types/stamp';

import { isImageUrl } from '@/lib/utils';

interface StampBoothCardProps {
  booth: StampBooth;
  collected: boolean;
}

export function StampBoothCard({ booth, collected }: StampBoothCardProps) {
  const hasIcon = isImageUrl(booth.icon);

  return (
    <Link
      className={`flex flex-col items-center gap-2 shrink-0 group ${collected ? '' : 'opacity-70'}`}
      href={`/events/${booth.slug}`}
    >
      <div
        className={`relative w-20 h-20 md:w-32 md:h-32 bg-muted overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center ${
          collected ? '' : 'grayscale'
        }`}
      >
        {hasIcon ? (
          <Image alt={booth.title} className="w-full h-full object-cover" height={128} src={booth.icon} width={128} />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
        <span
          className={`absolute bottom-0 inset-x-0 py-0.5 text-center text-[10px] md:text-xs font-medium tracking-wider ${
            collected ? 'bg-primary text-primary-foreground' : 'bg-background/85 text-muted-foreground'
          }`}
        >
          {collected ? '獲得済み' : '未獲得'}
        </span>
      </div>
      <div className="text-center max-w-20 md:max-w-32">
        <p className="text-xs md:text-sm font-medium truncate">{booth.title}</p>
        {booth.organization ? (
          <p className="text-xs md:text-sm text-muted-foreground truncate">{booth.organization}</p>
        ) : null}
      </div>
    </Link>
  );
}
