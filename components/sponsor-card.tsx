import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

import type { SponsorItem } from '@/lib/types/sponsor';

interface SponsorCardProps {
  item: SponsorItem;
}

export function SponsorCard({ item }: SponsorCardProps) {
  const isIconUrl = item.icon.startsWith('http://') || item.icon.startsWith('https://') || item.icon.startsWith('/');

  return (
    <Card className="py-0">
      <CardContent className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-4 sm:p-5 sm:gap-y-2">
        <div className="row-start-1 col-start-1 sm:row-span-2 w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-muted flex items-center justify-center overflow-hidden mt-0.5">
          {isIconUrl ? (
            <Image alt={item.name} className="w-full h-full object-cover" height={56} src={item.icon} width={56} />
          ) : (
            <span className="text-xs text-muted-foreground">No logo</span>
          )}
        </div>

        <div className="row-start-1 col-start-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 min-w-0">
          <h3 className="font-medium text-base sm:text-lg text-foreground leading-snug">{item.name}</h3>

          {item.link && (
            <a
              aria-label={`${item.name}の公式サイト`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              href={item.link}
              rel="noopener noreferrer"
              target="_blank"
            >
              公式サイト
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          )}
        </div>

        <p className="row-start-2 col-start-1 col-span-2 sm:col-start-2 sm:col-span-1 text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}
