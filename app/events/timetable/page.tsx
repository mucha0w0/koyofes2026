import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"

const timetable = [
  { time: "09:00", events: [{ name: "開会式", location: "体育館", type: "公式" }] },
  { time: "10:00", events: [
    { name: "吹奏楽部演奏", location: "体育館", type: "ステージ" },
    { name: "企画開始", location: "各教室", type: "展示" },
  ]},
  { time: "11:00", events: [{ name: "書道パフォーマンス", location: "体育館", type: "ステージ" }] },
  { time: "12:00", events: [{ name: "昼休憩", location: "-", type: "休憩" }] },
  { time: "13:00", events: [{ name: "ライブステージ", location: "体育館", type: "ステージ" }] },
  { time: "14:00", events: [{ name: "ダンスステージ", location: "体育館", type: "ステージ" }] },
  { time: "15:00", events: [{ name: "有志バンド", location: "体育館", type: "ステージ" }] },
  { time: "16:00", events: [{ name: "企画終了", location: "各教室", type: "展示" }] },
  { time: "16:30", events: [{ name: "閉会式", location: "体育館", type: "公式" }] },
]

export default function TimetablePage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="タイムテーブル" subtitle="こうよう祭当日のスケジュールです">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">時間</th>
                <th className="text-left py-3 px-4 font-medium">イベント</th>
                <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">場所</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">種類</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((slot, i) => (
                slot.events.map((event, j) => (
                  <tr key={`${i}-${j}`} className="border-b border-border hover:bg-muted transition-colors">
                    {j === 0 && (
                      <td className="py-3 px-4 font-medium text-foreground align-top" rowSpan={slot.events.length}>
                        {slot.time}
                      </td>
                    )}
                    <td className="py-3 px-4">{event.name}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{event.location}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs px-2 py-1 bg-secondary">{event.type}</span>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
