'use client';

import Image from 'next/image';

import { Badge } from '@/components/ui/badge';

import type { StampBooth } from '@/lib/types/stamp';
import { isImageUrl } from '@/lib/utils';

interface StampBoothCardProps {
  booth: StampBooth;
  collected: boolean;
}

export function StampBoothCard({ booth, collected }: StampBoothCardProps) {
  const hasIcon = isImageUrl(booth.icon);

  return (
    <article className={`bg-card p-4 space-y-3 ${collected ? '' : 'opacity-70'}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug tracking-normal text-foreground">{booth.title}</h3>
        <Badge className="rounded-none shrink-0" variant={collected ? 'default' : 'outline'}>
          {collected ? '獲得済み' : '未獲得'}
        </Badge>
      </div>
      <div
        className={`mx-auto flex h-20 w-20 items-center justify-center overflow-hidden bg-muted ${
          collected ? '' : 'grayscale'
        }`}
      >
        {hasIcon ? (
          <Image
            alt={booth.title}
            className="h-full w-full object-cover"
            height={80}
            src={booth.icon}
            width={80}
          />
        ) : (
          <span className="font-display text-[10px] uppercase tracking-[0.03em] text-muted-foreground">Stamp</span>
        )}
      </div>
    </article>
  );
}
