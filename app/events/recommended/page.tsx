import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"

const recommendedEvents = [
  { id: 1, recommender: "実行委員長", ID: "2E" },
  { id: 2, recommender: "副実行委員長", ID: "1I" },
  { id: 3, recommender: "システムパート", ID: "kyudobu" },
  { id: 4, recommender: "マネジメントパート", ID: "科学部" },
  { id: 5, recommender: "司会", ID: "1年C組" },
  { id: 6, recommender: "ステージパート", ID: "書道部" },
]

export default function RecommendedEventsPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="おすすめ企画" subtitle="各パートリーダーがピックアップした、おすすめの企画です">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedEvents.map((event) => (
            <div key={event.id} className="bg-card p-5 space-y-2">
              <p className="text-sm text-muted-foreground">{event.recommender}</p>
              <p className="font-medium">{event.ID}</p>
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