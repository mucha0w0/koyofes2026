import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { MapPin, Clock } from "lucide-react"

const exhibitions = [
  { id: 1, name: "お化け屋敷", organizer: "3年A組", location: "本館3階 3-A教室", time: "10:00-16:00" },
  { id: 2, name: "プラネタリウム", organizer: "科学部", location: "理科室", time: "10:30-15:30" },
  { id: 3, name: "写真展", organizer: "写真部", location: "美術室", time: "10:00-16:00" },
  { id: 4, name: "迷路", organizer: "2年C組", location: "本館2階 2-C教室", time: "10:00-16:00" },
  { id: 5, name: "美術作品展示", organizer: "美術部", location: "美術室", time: "10:00-16:00" },
  { id: 6, name: "ゲームコーナー", organizer: "1年A組", location: "本館1階 1-A教室", time: "10:00-15:30" },
]

export default function ExhibitionPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="展示企画" subtitle="教室や特別教室で行われる展示企画の一覧です">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exhibitions.map((event) => (
            <div key={event.id} className="bg-card p-5 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-foreground font-medium text-lg mb-4">
                {event.name.charAt(0)}
              </div>
              <h3 className="font-medium text-lg mb-1">{event.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{event.organizer}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  {event.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
