import { Clock } from 'lucide-react';
import Link from 'next/link';

import { CmsPageLayout } from '@/components/cms/cms-page-layout';
import { EventSearchSection } from '@/components/events/event-search';
import { InkPhoto } from '@/components/ui/ink-photo';

import { getStageEvents, toScheduleLayoutEvents, type ScheduleLayoutEvent } from '@/lib/timetable';

const DAY1_START_HOUR = 9;
const DAY1_END_HOUR = 18;
const DAY2_START_HOUR = 9;
const DAY2_END_HOUR = 18;
const PX_PER_HOUR = 80;
const CARD_HEIGHT = 88;

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
      {/* 時間ラベル列 */}
      <div className="relative shrink-0 w-12" style={{ height: `${totalHeight}px` }}>
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

      {/* 軸エリア（縦線 + 正方形ドット） */}
      <div className="relative w-6 shrink-0" style={{ height: `${totalHeight}px` }}>
        <div className="absolute left-2.75 top-0 bottom-0 w-px bg-mist" />
        {events.map((event, idx) => (
          <div
            key={idx}
            className="absolute w-2 h-2 rounded-[4px] bg-ink"
            style={{ left: '7px', top: `${event.topPx - 4}px` }}
          />
        ))}
      </div>

      {/* タイムライン本体 */}
      <div className="relative flex-1" style={{ height: `${totalHeight}px` }}>
        {events.map((event, idx) => (
          <Link
            key={idx}
            className="absolute left-0 right-0 ink-shell ink-lift flex items-stretch gap-4 bg-card py-1.5 pr-4 pl-1.5"
            href={`/events/${event.slug}`}
            style={{ top: `${event.topPx - 16}px`, height: `${CARD_HEIGHT}px` }} //あえて16pxずらす
          >
            {event.icon ? (
              <InkPhoto
                alt={event.title}
                className="ink-shell-sm ink-row-icon h-full min-w-0 w-auto shrink overflow-hidden"
                size={128}
                src={event.icon}
              />
            ) : (
              <div className="ink-row-icon h-full min-w-0 w-auto shrink" />
            )}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="truncate font-medium leading-snug text-foreground">{event.title}</h3>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{event.organization}</p>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">{event.timeRange}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
      <CmsPageLayout meta="eventTimetable">
        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-medium text-foreground">1日目</h2>
            </div>
            <TimelineView endHour={DAY1_END_HOUR} events={day1Events} startHour={DAY1_START_HOUR} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-medium text-foreground">2日目</h2>
            </div>
            <TimelineView endHour={DAY2_END_HOUR} events={day2Events} startHour={DAY2_START_HOUR} />
          </div>
        </div>
      </CmsPageLayout>
      <EventSearchSection variant="compact" />
    </>
  );
}
