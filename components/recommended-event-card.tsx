import Image from "next/image"
import Link from "next/link"
import type { Event } from "@/lib/types/event"

interface RecommendedEventCardProps {
  recommender: string
  recommenderIcon: string
  whyRecom: string
  event: Event
}

export function RecommendedEventCard({
  recommender,
  recommenderIcon,
  whyRecom,
  event,
}: RecommendedEventCardProps) {
  const isEventIconUrl =
    event.icon && (event.icon.startsWith("http://") || event.icon.startsWith("https://"))

  return (
    <div className="bg-card p-5 space-y-4">
      {/* パート情報（外枠） */}
      <div className="flex items-center gap-3">
      <div className="shrink-0 w-10 h-10 bg-muted flex items-center justify-center overflow-hidden">
          {recommenderIcon ? (
            <Image
              src={recommenderIcon}
              alt={recommender}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-muted-foreground">No icon</span>
          )}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{recommender}</p>
      </div>

      {/* おすすめ理由 */}
      {whyRecom && (
        <p className="text-sm text-foreground leading-relaxed">{whyRecom}</p>
      )}

      {/* 企画紹介カード（内側） */}
      <Link
        href={`/events/${event.slug}`}
        className="flex items-center gap-4 bg-muted p-4 hover:opacity-80 transition-opacity"
      >
        <div className="shrink-0 w-16 h-16 bg-background flex items-center justify-center overflow-hidden">
          {isEventIconUrl ? (
            <Image
              src={event.icon}
              alt={event.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">No icon</span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-medium truncate">{event.title}</p>
          {event.catchphrase && (
            <p className="text-sm text-muted-foreground line-clamp-2">{event.catchphrase}</p>
          )}
        </div>
      </Link>
    </div>
  )
}