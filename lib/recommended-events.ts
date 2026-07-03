import { fetchPartsFromMicroCMS, getEvents, type MicroCMSPart } from "@/lib/microcms"
import type { Event } from "@/lib/types/event"

export interface RecommendedEvent {
  partId: string
  recommender: string
  recommenderIcon: string
  whyRecom: string
  event: Event
}

export async function getRecommendedEvents(): Promise<RecommendedEvent[]> {
  const [parts, events] = await Promise.all([
    fetchPartsFromMicroCMS(),
    getEvents(),
  ])

  const eventMap = new Map<string, Event>(
    (events as Event[]).map((event) => [event.slug, event])
  )

  return parts
    .filter((part): part is MicroCMSPart & { recommend: string } =>
      Boolean(part.recommend)
    )
    .map((part) => {
      const event = eventMap.get(part.recommend)
      if (!event) {
        console.warn(
          `おすすめ企画が見つかりません: recommender=${part.name}, slug=${part.recommend}`
        )
        return null
      }
      return {
        partId: part.id,
        recommender: part.name,
        recommenderIcon: part.icon?.url ?? "",
        whyRecom: part.whyrecom ?? "",
        event,
      }
    })
    .filter((item): item is RecommendedEvent => item !== null)
}