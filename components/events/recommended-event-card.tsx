import Link from 'next/link';

import { InkPhoto } from '@/components/ui/ink-photo';

import type { Event } from '@/lib/types/event';

interface RecommendedEventCardProps {
  recommender: string;
  recommenderIcon: string;
  whyRecom: string;
  event: Event;
}

export function RecommendedEventCard({ recommender, recommenderIcon, whyRecom, event }: RecommendedEventCardProps) {
  return (
    <div className="ink-shell space-y-4 bg-card p-5">
      <div className="flex items-center gap-3">
        <InkPhoto alt={recommender} className="ink-shell-sm size-10" size={40} src={recommenderIcon} />
        <p className="text-sm font-medium text-muted-foreground">{recommender}</p>
      </div>

      {whyRecom ? <p className="text-sm leading-relaxed text-foreground">{whyRecom}</p> : null}

      <Link className="ink-shell ink-lift flex items-center gap-4 bg-card p-4" href={`/events/${event.slug}`}>
        <InkPhoto alt={event.title} className="ink-shell-sm size-16" size={64} src={event.icon} />

        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-medium">{event.title}</p>
          {event.catchphrase ? <p className="line-clamp-2 text-sm text-muted-foreground">{event.catchphrase}</p> : null}
        </div>
      </Link>
    </div>
  );
}
