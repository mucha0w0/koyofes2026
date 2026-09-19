import Link from 'next/link';

import { InkPhoto } from '@/components/ui/ink-photo';

import { getEventCategoryLabel } from '@/lib/config/event-categories';
import { Event } from '@/lib/types/event';

interface ExhibitionCardProps {
  event: Event;
}

export function ExhibitionCard({ event }: ExhibitionCardProps) {
  const rawLine = event.catchphrase?.split('\n')[0] ?? '';
  const displayCatchphrase = rawLine.length > 40 ? rawLine.substring(0, 40) + '...' : rawLine;

  return (
    <Link className="ink-shell ink-lift block bg-card" href={`/events/${event.slug}`}>
      <div className="flex items-stretch gap-3 p-3.5 sm:gap-4 sm:p-4">
        <InkPhoto
          alt={event.title}
          className="ink-shell-sm ink-card-icon"
          size={160}
          src={event.icon}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="text-lg font-medium text-foreground">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{event.organization}</p>
          {displayCatchphrase ? <p className="mt-1 truncate text-xs text-muted-foreground">{displayCatchphrase}</p> : null}
          <div className="mt-2 flex flex-wrap gap-2 text-xs sm:mt-3 sm:gap-3">
            <span className="ink-tag">{getEventCategoryLabel(event.category)}</span>
            <span className="ink-tag">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
