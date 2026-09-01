import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { Event } from '@/lib/types/event';

import { isImageUrl } from '@/lib/utils';

interface RecommendedEventCardProps {
  recommender: string;
  recommenderIcon: string;
  whyRecom: string;
  event: Event;
}

export function RecommendedEventCard({ recommender, recommenderIcon, whyRecom, event }: RecommendedEventCardProps) {
  const isEventIconUrl = isImageUrl(event.icon);

  return (
    <div className="bg-card p-5 space-y-4">
      {/* パート情報（外枠） */}
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 bg-muted flex items-center justify-center overflow-hidden">
          {recommenderIcon ? (
            <Image
              alt={recommender}
              className="w-full h-full object-cover"
              height={40}
              src={recommenderIcon}
              width={40}
            />
          ) : (
            <span className="text-[10px] text-muted-foreground">No icon</span>
          )}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{recommender}</p>
      </div>

      {/* おすすめ理由 */}
      {whyRecom && <p className="text-sm text-foreground leading-relaxed">{whyRecom}</p>}

      {/* 企画紹介カード（内側） */}
      {/* 企画紹介カード（内側） */}
      <Link
        className="flex items-center gap-4 bg-muted p-4 hover:opacity-80 transition-opacity"
        href={`/events/${event.slug}`}
      >
        <div className="shrink-0 w-16 h-16 bg-background flex items-center justify-center overflow-hidden">
          {isEventIconUrl ? (
            <Image alt={event.title} className="w-full h-full object-cover" height={64} src={event.icon} width={64} />
          ) : (
            <span className="text-xs text-muted-foreground">No icon</span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-medium truncate">{event.title}</p>
          {event.catchphrase && <p className="text-sm text-muted-foreground line-clamp-2">{event.catchphrase}</p>}
        </div>

        <span className="ml-auto shrink-0 text-sm text-muted-foreground flex items-center gap-1">
          詳細を見る
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}
