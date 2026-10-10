import Link from 'next/link';

import { InkPhoto } from '@/components/ui/ink-photo';

import { Event } from '@/lib/types/event';

interface ExhibitionCardProps {
  event: Event;
}

export function ExhibitionCard({ event }: ExhibitionCardProps) {
  const rawLine = event.catchphrase?.split('\n')[0] ?? '';
  const displayCatchphrase = rawLine.length > 40 ? rawLine.substring(0, 40) + '...' : rawLine;

  return (
    <Link className="ink-shell ink-lift block bg-card" href={`/events/${event.slug}`}>
      <div className="flex gap-4 p-6">
        <InkPhoto alt={event.title} className="ink-shell-sm size-16" size={64} src={event.icon} />

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-medium text-foreground">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{event.organization}</p>
          {displayCatchphrase ? <p className="mt-1 truncate text-xs text-muted-foreground">{displayCatchphrase}</p> : null}
        </div>
      </div>
    </Link>
  );
}
