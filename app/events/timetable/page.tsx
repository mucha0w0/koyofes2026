import { Clock } from 'lucide-react';
import Link from 'next/link';

import { SimpleSerch } from '@/components/Simple-serch';
import { PageLayout } from '@/components/page-layout';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';


import { getEvents } from '@/lib/microcms';
import { Event } from '@/lib/types/event';



export const dynamic = 'force-dynamic';

const DAY1_START_HOUR = 9;
const DAY1_END_HOUR = 18;
const DAY2_START_HOUR = 9;
const DAY2_END_HOUR = 18;
const PX_PER_HOUR = 80;
const PX_PER_MIN = PX_PER_HOUR / 60;
const CARD_HEIGHT = 88;

function parseTime(timeStr: string): { startMin: number; endMin: number } | null {
  if (!timeStr || timeStr.length !== 8) return null;
  const sh = parseInt(timeStr.substring(0, 2), 10);
  const sm = parseInt(timeStr.substring(2, 4), 10);
  const eh = parseInt(timeStr.substring(4, 6), 10);
  const em = parseInt(timeStr.substring(6, 8), 10);
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return null;
  return {
    startMin: sh * 60 + sm,
    endMin: eh * 60 + em,
  };
}

// 分 → "HH:MM" 変換
function minToTimeStr(min: number): string {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, '0');
  const m = (min % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function calcDuration(startMin: number, endMin: number): number {
  return endMin - startMin;
}

interface ScheduleEvent {
  title: string;
  organization: string;
  icon?: string;
  slug: string; // 追加
  startMin: number;
  endMin: number;
  duration: number;
  topPx: number;
  timeRange: string;
}

function TimelineView({ events, startHour, endHour }: { events: ScheduleEvent[]; startHour: number; endHour: number }) {
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
            {event.icon && <img alt={event.title} className="w-10 h-10 object-contain shrink-0" src={event.icon} />}
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
  let stageEvents: Event[] = [];
  try {
    const events = await getEvents();
    stageEvents = (events).filter((e) => e.category === 'stage');
  } catch (error) {
    console.error('イベント取得エラー:', error);
  }

  const toScheduleEvents = (timeKey: 'time-day1' | 'time-day2', startHour: number) =>
    stageEvents
      .map((event): ScheduleEvent | null => {
        const parsed = parseTime(event[timeKey]);
        if (!parsed) return null;
        return {
          title: event.title,
          organization: event.organization,
          icon: event.icon ?? undefined,
          slug: event.slug,
          startMin: parsed.startMin,
          endMin: parsed.endMin,
          duration: calcDuration(parsed.startMin, parsed.endMin),
          topPx: (parsed.startMin - startHour * 60) * PX_PER_MIN,
          timeRange: `${minToTimeStr(parsed.startMin)}~${minToTimeStr(parsed.endMin)}`,
        };
      })
      .filter((e): e is ScheduleEvent => e !== null)
      .sort((a, b) => a.startMin - b.startMin);

  const day1Events = toScheduleEvents('time-day1', DAY1_START_HOUR);
  const day2Events = toScheduleEvents('time-day2', DAY2_START_HOUR);

  return (
    <>
      <SiteHeader />
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
      <SimpleSerch />
      <SiteFooter />
    </>
  );
}
