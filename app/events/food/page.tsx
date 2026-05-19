import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { MapPin, Clock, Utensils } from "lucide-react"

const foodEvents = [
  { id: 1, name: "カフェ", organizer: "2年B組", location: "調理室", time: "10:00-15:00", menu: "コーヒー、紅茶、ケーキ" },
  { id: 2, name: "たこ焼き屋", organizer: "3年B組", location: "中庭テント", time: "10:00-15:00", menu: "たこ焼き" },
  { id: 3, name: "焼きそば", organizer: "PTA", location: "中庭テント", time: "11:00-14:00", menu: "焼きそば、フランクフルト" },
  { id: 4, name: "クレープ", organizer: "2年A組", location: "中庭テント", time: "10:00-15:00", menu: "クレープ各種" },
  { id: 5, name: "かき氷", organizer: "1年B組", location: "中庭テント", time: "10:00-15:30", menu: "かき氷" },
]

export default function FoodEventsPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="飲食企画" subtitle="美味しい食べ物・飲み物を提供する企画の一覧です">
        <div className="bg-muted p-4 mb-8 text-sm">
          <p className="text-foreground">飲食企画は売り切れ次第終了となる場合があります。ご了承ください。</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {foodEvents.map((event) => (
            <div key={event.id} className="bg-card p-5 hover:opacity-80 transition-opacity">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted flex items-center justify-center shrink-0">
                  <Utensils className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg mb-1">{event.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.organizer}</p>
                  <p className="text-sm text-foreground mb-3">{event.menu}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />{event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />{event.time}
                    </span>
                  </div>
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
