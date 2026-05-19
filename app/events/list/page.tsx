import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { MapPin, Clock, Search } from "lucide-react"

const allEvents = [
  { id: 1, name: "お化け屋敷", organizer: "3年A組", location: "本館3階", time: "10:00-16:00", category: "クラス展示" },
  { id: 2, name: "ライブステージ", organizer: "軽音楽部", location: "体育館", time: "13:00-15:00", category: "ステージ" },
  { id: 3, name: "カフェ", organizer: "2年B組", location: "調理室", time: "10:00-15:00", category: "クラス展示" },
  { id: 4, name: "プラネタリウム", organizer: "科学部", location: "理科室", time: "10:30-15:30", category: "有志展示" },
  { id: 5, name: "縁日", organizer: "1年C組", location: "中庭", time: "10:00-16:00", category: "クラス展示" },
  { id: 6, name: "書道パフォーマンス", organizer: "書道部", location: "体育館", time: "11:00-11:30", category: "ステージ" },
  { id: 7, name: "写真展", organizer: "写真部", location: "美術室", time: "10:00-16:00", category: "有志展示" },
  { id: 8, name: "ダンスステージ", organizer: "ダンス部", location: "体育館", time: "14:00-14:30", category: "ステージ" },
  { id: 9, name: "模擬店", organizer: "3年B組", location: "中庭", time: "10:00-15:00", category: "クラス展示" },
  { id: 10, name: "開会式", organizer: "実行委員会", location: "体育館", time: "09:00-09:30", category: "公式" },
]

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
          {allEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4 bg-card p-4 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-foreground font-medium shrink-0">
                {event.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{event.name}</h3>
                <p className="text-sm text-muted-foreground">{event.organizer}</p>
              </div>
              <span className="hidden sm:block text-xs px-2 py-1 bg-muted">{event.category}</span>
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
