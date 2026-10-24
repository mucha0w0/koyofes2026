import { Clock } from 'lucide-react';
import Link from 'next/link';

import { CmsPageLayout } from '@/components/cms/cms-page-layout';
import { EventSearchSection } from '@/components/events/event-search';
import { Illustration } from '@/components/illustration/illustration';
import { RelatedLinks } from '@/components/layout/related-links';
import { InkPhoto } from '@/components/ui/ink-photo';

import { getStageEvents, toScheduleLayoutEvents, type ScheduleLayoutEvent } from '@/lib/timetable';

const DAY1_START_HOUR = 9;
const DAY1_END_HOUR = 18;
const DAY2_START_HOUR = 9;
const DAY2_END_HOUR = 18;
const PX_PER_HOUR = 320;
const CARD_HEIGHT = 112;
/** 描画の左端を、関連ページ先頭カードの左端に揃える。time.png の左の透明幅は 100px */
const TIME_ILLUSTRATION_SIZE = 'clamp(148px, 20vw, 240px)';
const TIME_ILLUSTRATION_LEFT = `calc(max(1rem, (100vw - 80rem) / 2 + 1rem) - ${TIME_ILLUSTRATION_SIZE} * ${100 / 1024})`;

function TimelineView({
  events,
  startHour,
  endHour,
}: {
  events: ScheduleLayoutEvent[];
  startHour: number;
  endHour: number;
}) {
  const totalHeight = (endHour - startHour) * PX_PER_HOUR;
  const timeLabels: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    timeLabels.push(`${h}:00`);
    if (h < endHour) timeLabels.push(`${h}:30`);
  }

  return (
    <div className="relative flex gap-4">
      {/* 時間ラベルと軸。詳細検索のスライダーと同じ、細い文字と 8px の軌跡・インク枠のつまみ */}
      <div className="flex shrink-0 gap-2">
        <div className="relative w-12" style={{ height: `${totalHeight}px` }}>
          {timeLabels.map((label, i) => (
            <div
              key={label}
              className="absolute right-0 text-xs text-muted-foreground"
              style={{
                top: `${i * (PX_PER_HOUR / 2) - 8}px`,
                lineHeight: '16px',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div aria-hidden className="relative w-6" style={{ height: `${totalHeight}px` }}>
          <div className="absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2 overflow-hidden rounded-[4px] bg-mist">
            {events.map((event) => (
              <div
                key={`${event.slug}-fill`}
                className="absolute inset-x-0 bg-festival-accent"
                style={{
                  top: `${event.topPx}px`,
                  height: `${(event.duration / 60) * PX_PER_HOUR}px`,
                }}
              />
            ))}
          </div>
          {events.map((event) => (
            <div
              key={event.slug}
              className="absolute left-1/2 z-10 size-5.5 -translate-x-1/2 rounded-full border-(length:--shell-stroke) border-ink bg-card"
              style={{ top: `${event.topPx - 11}px` }}
            />
          ))}
        </div>
      </div>

      {/* タイムライン本体 */}
      <div className="relative flex-1" style={{ height: `${totalHeight}px` }}>
        {events.map((event, idx) => (
          <Link
            key={idx}
            className="absolute left-0 right-0 ink-shell ink-lift flex items-center gap-3 bg-card py-3 pr-3 pl-2 sm:gap-5 sm:pr-5"
            href={`/events/${event.slug}`}
            prefetch={false}
            style={{ top: `${event.topPx - 16}px`, height: `${CARD_HEIGHT}px` }} //あえて16pxずらす
          >
            {event.icon ? (
              <InkPhoto
                alt={event.title}
                className="ink-shell-sm ink-row-icon h-16 w-16 shrink-0 self-center overflow-hidden sm:h-20 sm:w-20"
                size={128}
                src={event.icon}
              />
            ) : (
              <div className="ink-row-icon h-16 w-16 shrink-0 self-center sm:h-20 sm:w-20" />
            )}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="truncate font-medium leading-snug text-foreground">{event.title}</h3>
              <p className="mt-1.5 truncate text-sm text-muted-foreground">{event.organization}</p>
            </div>
            <div className="ml-auto flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs whitespace-nowrap text-muted-foreground">{event.timeRange}</span>
              <span className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground">
                <Clock className="h-3 w-3" />
                {event.duration}分
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function StageEventsPage() {
  const stageEvents = await getStageEvents();

  const layout = { pxPerHour: PX_PER_HOUR };
  const day1Events = toScheduleLayoutEvents(stageEvents, 'time-day1', {
    ...layout,
    startHour: DAY1_START_HOUR,
  });
  const day2Events = toScheduleLayoutEvents(stageEvents, 'time-day2', {
    ...layout,
    startHour: DAY2_START_HOUR,
  });

  return (
    <>
      <CmsPageLayout
        illustration={<Illustration alt="" left={TIME_ILLUSTRATION_LEFT} src="time.png" />}
        meta="eventTimetable"
      >
        <div className="space-y-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xl font-medium text-foreground">1日目</h2>
            </div>
            <TimelineView endHour={DAY1_END_HOUR} events={day1Events} startHour={DAY1_START_HOUR} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xl font-medium text-foreground">2日目</h2>
            </div>
            <TimelineView endHour={DAY2_END_HOUR} events={day2Events} startHour={DAY2_START_HOUR} />
          </div>
        </div>
      </CmsPageLayout>
      <EventSearchSection variant="compact" />
      <RelatedLinks background="paper" pages={['/events/list', '/events/recommended', '/guide/map']} />
    </>
  );
}
