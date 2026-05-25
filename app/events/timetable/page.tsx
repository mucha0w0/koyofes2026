import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Clock } from "lucide-react"
import { getEvents } from "@/lib/microcms"
import { Event } from "@/lib/types/event"

// Convert time format from HHMMMM to HH:MM~HH:MM
function formatTimeDisplay(timeStr: string): string {
  if (!timeStr || timeStr.length !== 8) return timeStr
  const startHour = timeStr.substring(0, 2)
  const startMin = timeStr.substring(2, 4)
  const endHour = timeStr.substring(4, 6)
  const endMin = timeStr.substring(6, 8)
  return `${startHour}:${startMin}~${endHour}:${endMin}`
}

interface ScheduleEvent {
  title: string
  timeRange: string
  organization: string
  duration: number
}

export default async function StageEventsPage() {
  // Get all stage events from microCMS
  let stageEvents: Event[] = []
  
  try {
    const events = await getEvents()
    stageEvents = (events as Event[]).filter((e) => e.category === "stage")
  } catch (error) {
    console.error("イベント取得エラー:", error)
  }

  // Group events by day
  const day1Events: ScheduleEvent[] = stageEvents
    .map((event) => ({
      title: event.title,
      timeRange: formatTimeDisplay(event["time-day1"]),
      organization: event.organization,
      duration: event.duration,
    }))
    .sort((a, b) => a.timeRange.localeCompare(b.timeRange))

  const day2Events: ScheduleEvent[] = stageEvents
    .map((event) => ({
      title: event.title,
      timeRange: formatTimeDisplay(event["time-day2"]),
      organization: event.organization,
      duration: event.duration,
    }))
    .sort((a, b) => a.timeRange.localeCompare(b.timeRange))

  const renderEventList = (events: ScheduleEvent[]) => (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
      <div className="space-y-6">
        {events.map((event, idx) => (
          <div key={idx} className="relative flex gap-4 pl-12">
            <div className="absolute left-4 w-3 h-3 bg-primary" />
            <div className="flex-1 bg-card p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-lg font-medium text-foreground">{event.timeRange}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.duration}分
                </span>
              </div>
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.organization}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <SiteHeader />
      <PageLayout title="タイムテーブル" subtitle="2日間のタイムテーブルです">
        <div className="space-y-12">
          {/* Day 1 */}
          <div>
            <h2 className="text-2xl font-medium mb-6 text-foreground">1日目</h2>
            {renderEventList(day1Events)}
          </div>

          {/* Day 2 */}
          <div>
            <h2 className="text-2xl font-medium mb-6 text-foreground">2日目</h2>
            {renderEventList(day2Events)}
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
