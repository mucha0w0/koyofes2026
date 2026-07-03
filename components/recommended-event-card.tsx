import Image from "next/image"
import Link from "next/link"
import type { Event } from "@/lib/types/event"

interface RecommendedEventCardProps {
  recommender: string
  event: Event
}

export function RecommendedEventCard({ recommender, event }: RecommendedEventCardProps) {
  const isIconUrl =
    event.icon && (event.icon.startsWith("http://") || event.icon.startsWith("https://"))

  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex items-center gap-4 bg-card p-5 hover:opacity-80 transition-opacity"
    >
      <div className="shrink-0 w-16 h-16 bg-muted flex items-center justify-center overflow-hidden">
        {isIconUrl ? (
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
        <p className="text-sm text-muted-foreground">{recommender}</p>
        <p className="font-medium truncate">{event.title}</p>
        {event.catchphrase && (
          <p className="text-sm text-muted-foreground line-clamp-2">{event.catchphrase}</p>
        )}
      </div>
    </Link>
  )
}