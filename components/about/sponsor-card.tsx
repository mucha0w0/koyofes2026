import { ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { InkPhoto } from '@/components/ui/ink-photo';

import type { SponsorItem } from '@/lib/types/sponsor';

const actionClassName =
  'inline-flex shrink-0 items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground';

interface SponsorCardProps {
  item: SponsorItem;
}

export function SponsorCard({ item }: SponsorCardProps) {
  return (
    <Card className="py-0">
      <CardContent className="flex h-[98px] items-stretch gap-4 py-1.5 pr-4 pl-1.5 sm:pr-5">
        <InkPhoto
          alt={item.name}
          className="ink-shell-sm ink-row-icon h-full min-w-0 w-auto shrink overflow-hidden"
          size={128}
          src={item.icon}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <h3 className="truncate font-medium text-base leading-snug text-foreground sm:text-lg">{item.name}</h3>

            {item.href ? (
              <Link aria-label={`${item.name}の詳細`} className={actionClassName} href={item.href}>
                詳細
                <ChevronRight className="h-3 w-3 opacity-60" />
              </Link>
            ) : item.link ? (
              <a
                aria-label={`${item.name}の公式サイト`}
                className={actionClassName}
                href={item.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                公式サイト
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            ) : null}
          </div>

          {item.description ? (
            <p className="truncate text-sm text-muted-foreground">{item.description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
