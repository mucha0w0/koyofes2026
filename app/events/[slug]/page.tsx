import { notFound } from 'next/navigation'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { EventMarkdown } from '@/components/event-markdown'
import { EventCarousel } from '@/components/event-carousel'
import { getLucideIcon } from '@/lib/lucide-icons'
import eventsData from '@/lib/events.json'
import { Event } from '@/lib/types/event'
import { Clock, MapPin, Users, Building2, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string): Promise<Event | null> {
  const event = (eventsData.events as Event[]).find((e) => e.slug === slug)
  return event || null
}

export async function generateStaticParams() {
  return (eventsData.events as Event[]).map((event) => ({
    slug: event.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return {
      title: 'イベントが見つかりません',
    }
  }

  return {
    title: `${event.title} | こうよう祭`,
    description: event.description.split('\n')[0],
  }
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  const IconComponent = getLucideIcon(event.icon)

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Banner Carousel */}
        <EventCarousel images={event.images} title={event.title} />

        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Title Section with Icon */}
          <div className="mb-12 flex items-start gap-6">
            {/* Icon */}
            <div className="shrink-0 w-20 h-20 bg-muted flex items-center justify-center">
              {IconComponent ? (
                <IconComponent className="h-10 w-10 text-foreground" />
              ) : (
                <span className="text-sm text-muted-foreground">No icon</span>
              )}
            </div>

            {/* Title and Organization */}
            <div>
              <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-2">{event.title}</h1>
              <p className="text-lg text-muted-foreground">{event.organization}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Quick Info Cards - 3等分 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium">場所</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{event.location}</p>
                </div>

                <div className="bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">開催時間</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">{event.time.day1}</p>
                    <p className="text-xs font-medium text-foreground">{event.time.day2}</p>
                  </div>
                </div>

                <div className="bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium">推奨人数</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{event.recommendedParticipants}</p>
                </div>
              </div>

              {/* Event Description */}
              <section>
                <h2 className="text-2xl font-medium mb-6 text-foreground">企画について</h2>
                <div className="prose max-w-none">
                  <EventMarkdown content={event.description} />
                </div>
              </section>

              {/* Image Gallery */}
              {event.images.length > 1 && (
                <section>
                  <h2 className="text-2xl font-medium mb-6 text-foreground">ギャラリー</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.images.slice(1).map((img, idx) => (
                      <div key={idx} className="overflow-hidden">
                        <div className="relative aspect-square">
                          {img.url ? (
                            <Image src={img.url} alt={img.alt} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center bg-muted h-full text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                        {img.caption && (
                          <p className="text-sm text-muted-foreground mt-2 italic">{img.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Organization Card */}
              <div className="bg-muted p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-foreground" />
                  <h3 className="text-lg font-medium text-foreground">企画団体</h3>
                </div>
                <p className="text-2xl font-medium text-foreground mb-6">{event.organization}</p>

                <div className="prose max-w-none">
                  <EventMarkdown content={event.organizationDescription} className="text-sm" />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-medium text-background mb-4">企画一覧へ</h2>
            <p className="text-background/70 mb-8">他の企画もチェックしましょう</p>
            <a
              href="/events/list"
              className="inline-flex items-center gap-2 px-8 py-3 bg-background text-foreground font-medium hover:opacity-80 transition-opacity"
            >
              企画を探す
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
