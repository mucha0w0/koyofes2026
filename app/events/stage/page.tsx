import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Clock, MapPin } from "lucide-react"

const stageEvents = [
  { id: 1, time: "09:00", name: "開会式", organizer: "実行委員会", duration: "30分" },
  { id: 2, time: "10:00", name: "吹奏楽部演奏", organizer: "吹奏楽部", duration: "45分" },
  { id: 3, time: "11:00", name: "書道パフォーマンス", organizer: "書道部", duration: "30分" },
  { id: 4, time: "13:00", name: "ライブステージ", organizer: "軽音楽部", duration: "2時間" },
  { id: 5, time: "14:00", name: "ダンスステージ", organizer: "ダンス部", duration: "30分" },
  { id: 6, time: "15:00", name: "有志バンド", organizer: "有志", duration: "1時間" },
  { id: 7, time: "16:30", name: "閉会式", organizer: "実行委員会", duration: "30分" },
]

export default function StageEventsPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="ステージ企画" subtitle="体育館で行われるステージイベントの一覧です">
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          会場：体育館メインステージ
        </div>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {stageEvents.map((event) => (
              <div key={event.id} className="relative flex gap-4 pl-12">
                <div className="absolute left-4 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div className="flex-1 bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg font-bold text-primary">{event.time}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{event.duration}
                    </span>
                  </div>
                  <h3 className="font-bold">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.organizer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
