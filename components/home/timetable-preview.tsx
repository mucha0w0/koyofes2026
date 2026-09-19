import Link from 'next/link';

import { InkPhoto } from '@/components/ui/ink-photo';

import { getStageEvents, toTimedEvents } from '@/lib/timetable';
import { type Event } from '@/lib/types/event';

const PREVIEW_COUNT = 3;

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
    <Link className="ink-shell ink-lift group flex items-center gap-4 bg-card p-4" href={`/events/${slug}`}>
      {icon ? (
        <InkPhoto alt={title} className="ink-shell-sm size-10" size={40} src={icon} />
      ) : (
        <div className="size-10 shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium">{title}</span>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{organization}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground">{timeRange}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{duration}分</p>
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
      <h2 className="text-center text-sm font-medium text-foreground">{label}</h2>
      <div className="grid gap-3">
        {events.map((event) => (
          <EventRow key={event.slug} {...event} />
        ))}
      </div>
    </div>
  );
}

export async function TimetablePreview() {
  let stageEvents: Event[] = [];
  try {
    stageEvents = await getStageEvents();
  } catch (error) {
    console.error('イベント取得エラー:', error);
  }

  function toPreviewRows(dayKey: 'time-day1' | 'time-day2'): EventRowProps[] {
    return toTimedEvents(stageEvents, dayKey, { timeRangeSeparator: '〜' })
      .slice(0, PREVIEW_COUNT)
      .map(({ slug, icon, title, organization, timeRange, duration }) => ({
        slug,
        icon,
        title,
        organization,
        timeRange,
        duration,
      }));
  }

  const day1Rows = toPreviewRows('time-day1');
  const day2Rows = toPreviewRows('time-day2');

  return (
    <section className="bg-paper-2 py-10 md:py-14" data-palette="orange">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-medium text-foreground md:text-2xl">タイムテーブル</h2>
        </div>

        <div className="mb-10 grid gap-8 md:grid-cols-2">
          <DaySection events={day1Rows} label="DAY 1" />
          <DaySection events={day2Rows} label="DAY 2" />
        </div>

        <div className="flex justify-center">
          <Link className="ink-link text-sm" href="/events/timetable">
            タイムテーブルを見る
          </Link>
        </div>
      </div>
    </section>
  );
}
