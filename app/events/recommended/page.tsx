import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Star, MapPin, Clock } from "lucide-react"
import Link from "next/link"

const recommendedEvents = [
  { id: 1, name: "お化け屋敷", organizer: "3年A組", location: "本館3階", time: "10:00-16:00", tag: "展示" },
  { id: 2, name: "ライブステージ", organizer: "軽音楽部", location: "体育館", time: "13:00-15:00", tag: "ステージ" },
  { id: 3, name: "カフェ", organizer: "2年B組", location: "調理室", time: "10:00-15:00", tag: "飲食" },
  { id: 4, name: "プラネタリウム", organizer: "科学部", location: "理科室", time: "10:30-15:30", tag: "展示" },
  { id: 5, name: "縁日", organizer: "1年C組", location: "中庭", time: "10:00-16:00", tag: "体験" },
  { id: 6, name: "書道パフォーマンス", organizer: "書道部", location: "体育館", time: "11:00-11:30", tag: "ステージ" },
]

export default function RecommendedEventsPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="おすすめ企画" subtitle="各パートリーダーがピックアップした、おすすめの企画です">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedEvents.map((event) => (
            <div key={event.id} className="bg-card p-5 hover:opacity-80 transition-opacity">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium px-2 py-1 bg-muted text-foreground">{event.tag}</span>
                <Star className="h-5 w-5 text-foreground fill-current" />
              </div>
              <h3 className="font-medium text-lg mb-1">{event.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{event.organizer}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/events/list" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity">
            すべての企画を見る
          </Link>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
