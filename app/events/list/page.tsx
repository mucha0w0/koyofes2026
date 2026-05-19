import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { MapPin, Clock, Search } from "lucide-react"
import Link from "next/link"
import eventsData from "@/lib/events.json"
import { Event } from "@/lib/types/event"

const categoryLabels: Record<string, string> = {
  exhibition: "展示",
  food: "飲食",
  stage: "ステージ",
  performance: "パフォーマンス",
  workshop: "ワークショップ",
}

export default function EventListPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="企画一覧" subtitle="こうよう祭2026のすべての企画をご覧いただけます">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="企画名・団体名で検索..."
              className="w-full pl-10 pr-4 py-3 bg-input border border-border focus:outline-none focus:border-ring"
            />
          </div>
        </div>
        <div className="space-y-3">
          {(eventsData.events as Event[]).map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`}>
              <div className="flex items-center gap-4 bg-card p-4 hover:bg-muted transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-muted flex items-center justify-center text-foreground font-medium shrink-0">
                  {event.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.organization}</p>
                </div>
                <span className="hidden sm:block text-xs px-2 py-1 bg-muted">
                  {categoryLabels[event.category] || event.category}
                </span>
                <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time.day1}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
