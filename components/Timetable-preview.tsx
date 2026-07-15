import { Clock, ArrowRight, EllipsisVertical } from 'lucide-react';
import Link from 'next/link';

import { getEvents } from '@/lib/microcms';
import { Event } from '@/lib/types/event';

const PREVIEW_COUNT = 3;

function parseTime(timeStr: string): { startMin: number; endMin: number } | null {
  if (!timeStr || timeStr.length !== 8) return null;
  const sh = parseInt(timeStr.substring(0, 2), 10);
  const sm = parseInt(timeStr.substring(2, 4), 10);
  const eh = parseInt(timeStr.substring(4, 6), 10);
  const em = parseInt(timeStr.substring(6, 8), 10);
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return null;
  return { startMin: sh * 60 + sm, endMin: eh * 60 + em };
}

function minToTimeStr(min: number): string {
  return `${Math.floor(min / 60)
    .toString()
    .padStart(2, '0')}:${(min % 60).toString().padStart(2, '0')}`;
}

// ─── サブコンポーネント ──────────────────────────────

interface EventRowProps {
  slug: string;
  icon?: string;
  title: string;
  organization: string;
  timeRange: string;
  duration: number;
}

function EventRow({ slug, icon, title, organization, timeRange, duration }: EventRowProps) {
  return (
    <Link
      className="flex items-center gap-4 p-4 bg-card transition-opacity hover:opacity-80 group"
      href={`/events/${slug}`}
    >
      {/* アイコン画像：背景なし、最大サイズで表示 */}
      {icon ? (
        <img alt={title} className="w-10 h-10 object-contain shrink-0" src={icon} />
      ) : (
        <div className="w-10 h-10 shrink-0" />
      )}

      {/* テキスト情報 */}
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm">{title}</span>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{organization}</p>
      </div>

      {/* 時間情報 + 矢印 */}
      <div className="shrink-0 flex items-center gap-2">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{timeRange}</p>
          <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
            <Clock className="h-3 w-3" />
            {duration}分
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

interface DaySectionProps {
  label: string;
  events: EventRowProps[];
}

function DaySection({ label, events }: DaySectionProps) {
  if (events.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">{label}</h2>
      </div>
      <div className="grid gap-2">
        {events.map((event) => (
          <EventRow key={event.slug} {...event} />
        ))}
      </div>
      {/* 縦向き三点リーダー（図形） */}
      <div className="flex justify-center py-2">
        <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

// ─── メインコンポーネント ────────────────────────────

export async function TimetablePreview() {
  let stageEvents: Event[] = [];
  try {
    const events = await getEvents();
    stageEvents = (events).filter((e) => e.category === 'stage');
  } catch (error) {
    console.error('イベント取得エラー:', error);
  }

  function toRowsSorted(timeKey: 'time-day1' | 'time-day2'): EventRowProps[] {
    return stageEvents
      .map((event): (EventRowProps & { startMin: number }) | null => {
        const parsed = parseTime(event[timeKey]);
        if (!parsed) return null;
        return {
          slug: event.slug,
          icon: event.icon ?? undefined,
          title: event.title,
          organization: event.organization,
          timeRange: `${minToTimeStr(parsed.startMin)}〜${minToTimeStr(parsed.endMin)}`,
          duration: parsed.endMin - parsed.startMin,
          startMin: parsed.startMin,
        };
      })
      .filter((e): e is EventRowProps & { startMin: number } => e !== null)
      .sort((a, b) => a.startMin - b.startMin)
      .slice(0, PREVIEW_COUNT)
      .map(({ startMin: _s, ...rest }) => rest);
  }

  const day1Rows = toRowsSorted('time-day1');
  const day2Rows = toRowsSorted('time-day2');

  return (
    <section className="bg-muted py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-medium text-foreground">タイムテーブル</h2>
        </div>

        {/* 2日分のグリッド */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <DaySection events={day1Rows} label="DAY 1" />
          <DaySection events={day2Rows} label="DAY 2" />
        </div>

        {/* 「すべて見る」リンク（中央揃え） */}
        <div className="flex justify-center">
          <Link
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="/events/timetable"
          >
            タイムテーブルを見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
