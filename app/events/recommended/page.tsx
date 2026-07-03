import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { RecommendedEventCard } from "@/components/recommended-event-card"
import { getRecommendedEvents } from "@/lib/recommended-events"
import Link from "next/link"

// 常に最新データを動的にレンダリング（microCMS更新を反映）
export const dynamic = "force-dynamic"

export default async function RecommendedEventsPage() {
  const recommendedEvents = await getRecommendedEvents()

  return (
    <>
      <SiteHeader />
      <PageLayout title="おすすめ企画" subtitle="各パートリーダーがピックアップした、おすすめの企画です">
        <div className="flex flex-col gap-4">
          {recommendedEvents.map(({ partId, recommender, event }) => (
            <RecommendedEventCard key={partId} recommender={recommender} event={event} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/events/list"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity"
          >
            すべての企画を見る
          </Link>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}