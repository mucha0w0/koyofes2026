import { notFound } from 'next/navigation';

import { EventCarousel } from '@/components/events/event-carousel';
import { EventMarkdown } from '@/components/events/event-markdown';
import { EventRankingBadge } from '@/components/events/event-ranking-badge';
import { EventSearchSection } from '@/components/events/event-search';
import { RelatedLinks } from '@/components/layout/related-links';
import { HelpButton } from '@/components/ui/help-button';
import { InkPhoto } from '@/components/ui/ink-photo';

import { isRankingAggregationOpen, isRankingEnabled } from '@/lib/config/rankingConfig';
import { formatDaySchedule, formatDuration, formatLocation, formatParticipants } from '@/lib/event-display';
import { getEventBySlug, getEvents } from '@/lib/events';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * ビルド時に無い slug はページを作らない。
 * クローラーが適当な slug を踏むたびに ISR Write が増えるのを防ぐ。
 * 公開後に増えた企画は、Webhook の Deploy Hook による再ビルドで追加する。
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const events = await getEvents();
  return events
    .filter((event) => event.slug)
    .map((event) => ({
      slug: event.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: 'イベントが見つかりません',
    };
  }

  return {
    title: `${event.title} | こうよう祭`,
    description: event.catchphrase || event.description.split('\n')[0],
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const timeDay1 = formatDaySchedule(event['time-day1']);
  const timeDay2 = formatDaySchedule(event['time-day2']);
  const locationDisplay = formatLocation(event);
  const participantsDisplay = formatParticipants(event);
  const durationDisplay = formatDuration(event.duration);

  return (
    <main className="flex flex-1 flex-col">
      <EventCarousel images={event.images} title={event.title} />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-16">
        <div className="mb-12 md:mb-16">
          <div className="mb-6 flex items-start gap-4 md:gap-8">
            <InkPhoto alt={event.title} className="size-16 md:size-24" size={96} src={event.icon} />

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-1">
                <h1 className="min-w-0 text-2xl font-bold text-foreground md:text-3xl">{event.title}</h1>
                <HelpButton className="shrink-0" title="掲載内容について">
                  <p>掲載内容は執筆当時のものです。開催当日までに、内容や仕様が変わることがあります。</p>
                </HelpButton>
              </div>
              <p className="text-base text-muted-foreground md:text-lg">{event.organization}</p>
              {isRankingEnabled() ? (
                <EventRankingBadge serverOpen={isRankingAggregationOpen()} slug={event.slug} />
              ) : null}
            </div>
          </div>

          <p className="text-lg font-medium text-foreground md:text-xl">{event.catchphrase}</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="ink-shell bg-card p-4">
                <p className="text-xs text-muted-foreground">場所</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-foreground">{locationDisplay.firstLine}</p>
                  {locationDisplay.secondLine ? (
                    <p className="text-sm font-medium text-foreground">{locationDisplay.secondLine}</p>
                  ) : null}
                </div>
              </div>

              <div className="ink-shell bg-card p-4">
                <p className="text-xs text-muted-foreground">時間</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-foreground">１日目：{timeDay1}</p>
                  <p className="text-xs font-medium text-foreground">２日目：{timeDay2}</p>
                </div>
              </div>

              <div className="ink-shell bg-card p-4">
                <p className="text-xs text-muted-foreground">人数</p>
                <p className="mt-2 text-sm font-medium text-foreground">{participantsDisplay}</p>
              </div>

              <div className="ink-shell bg-card p-4">
                <p className="text-xs text-muted-foreground">所要時間</p>
                <p className="mt-2 text-sm font-medium text-foreground">{durationDisplay}</p>
              </div>
            </div>

            <section>
              <h2 className="mb-6 text-2xl font-medium text-foreground">企画について</h2>
              <div className="prose max-w-none">
                <EventMarkdown content={event.description} />
              </div>
              <div className="mt-6 hidden pt-6 lg:block">
                <p className="text-xs text-muted-foreground">執筆者: {event.author}</p>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="ink-shell bg-card p-8">
              <h3 className="mb-4 text-lg font-medium text-foreground">企画団体</h3>
              <p className="mb-6 text-2xl font-medium text-foreground">{event.organization}</p>

              <div className="prose max-w-none">
                <EventMarkdown className="text-sm" content={event['organ-description']} />
              </div>

              <div className="mt-6 pt-6 lg:hidden">
                <p className="text-xs text-muted-foreground">執筆者: {event.author}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-auto">
        <EventSearchSection variant="compact" />
        <RelatedLinks background="paper" pages={['/events/list', '/ranking', '/stamp']} />
      </div>
    </main>
  );
}
