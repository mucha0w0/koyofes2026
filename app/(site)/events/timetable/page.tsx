import { Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { EventSearchSection } from '@/components/events/event-search';
import { PageLayout } from '@/components/layout/page-layout';

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
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
        {events.map((event, idx) => (
          <div
            key={idx}
            className="absolute w-2 h-2 bg-foreground"
            style={{ left: '7px', top: `${event.topPx - 4}px` }}
          />
        ))}
      </div>

      {/* タイムライン本体 */}
      <div className="relative flex-1" style={{ height: `${totalHeight}px` }}>
        {/* グリッド線 */}
        {timeLabels.map((label, i) => (
          <div
            key={label}
            className="absolute left-0 right-0"
            style={{
              top: `${i * (PX_PER_HOUR / 2)}px`,
              borderTop: i % 2 === 0 ? '1px solid hsl(var(--border))' : '1px dashed hsl(var(--border) / 0.5)',
            }}
          />
        ))}

        {/* カード */}
        {events.map((event, idx) => (
          <Link
            key={idx}
            className="absolute left-0 right-0 bg-card px-4 flex items-center gap-3 transition-opacity hover:opacity-80"
            href={`/events/${event.slug}`}
            style={{ top: `${event.topPx - 16}px`, height: `${CARD_HEIGHT}px` }} //あえて16pxずらす
          >
            {event.icon && (
              <Image
                alt={event.title}
                className="w-10 h-10 object-contain shrink-0"
                height={40}
                src={event.icon}
                width={40}
              />
            )}
            <div className="min-w-0">
              <h3 className="font-medium text-foreground leading-snug truncate">{event.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{event.organization}</p>
            </div>
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">{event.timeRange}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
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
      <PageLayout subtitle="2日間のタイムテーブルです" title="タイムテーブル">
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
      </PageLayout>
      <EventSearchSection variant="compact" />
    </>
  );
}
