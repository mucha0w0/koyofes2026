'use client';

import { Check, ChevronDown, Search, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, type CSSProperties, type ReactNode } from 'react';

import { EventSortMenu } from '@/components/events/event-sort-menu';
import { ExhibitionCard } from '@/components/events/exhibition-card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpButton } from '@/components/ui/help-button';

import { EVENT_CATEGORY_OPTIONS } from '@/lib/config/event-categories';
import { RANKING_CONFIG, type RankingTab } from '@/lib/config/rankingConfig';
import {
  DEFAULT_EVENT_SORT_KEY,
  fetchRankingScoreMap,
  getEventSortResultHint,
  isRankingSortKey,
  sortEvents,
  type EventSortKey,
} from '@/lib/event-sort';
import { Event } from '@/lib/types/event';
import { cn } from '@/lib/utils';

// ロケーションラベル（データベースから一意に抽出）
function getUniqueLocations(events: Event[]): string[] {
  const locations = new Set(events.map((e) => e.location || ''));
  return Array.from(locations)
    .filter((l) => l)
    .sort();
}

const PARTICIPANT_FILTER_OPEN_MAX = 5;

const PARTICIPANT_MARKS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: PARTICIPANT_FILTER_OPEN_MAX, label: '5〜' },
] as const;

interface EventListClientProps {
  events: Event[];
}

export function EventListClient({ events }: EventListClientProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [participantMax, setParticipantMax] = useState(1);
  const [enableParticipantFilter, setEnableParticipantFilter] = useState(false);
  const [durationValue, setDurationValue] = useState(15);
  const [enableDurationFilter, setEnableDurationFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortKey, setSortKey] = useState<EventSortKey>(DEFAULT_EVENT_SORT_KEY);
  const [scoreMaps, setScoreMaps] = useState<Record<RankingTab, Map<string, number> | null>>({
    overall: null,
    trend: null,
    wait: null,
  });

  // URLクエリパラメータから検索文字を取得（useSearchParams は既にデコード済み）
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isRankingSortKey(sortKey)) {
      return;
    }

    const tab = sortKey;
    const controller = new AbortController();

    const load = async () => {
      try {
        const map = await fetchRankingScoreMap(tab, controller.signal);
        setScoreMaps((prev) => ({ ...prev, [tab]: map }));
      } catch (error) {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }
        setScoreMaps((prev) => ({ ...prev, [tab]: prev[tab] ?? new Map() }));
      }
    };

    void load();
    const timer = window.setInterval(() => {
      void load();
    }, RANKING_CONFIG.pollIntervalMs);

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [sortKey]);

  const uniqueLocations = useMemo(() => getUniqueLocations(events), [events]);

  // フィルタリングロジック
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = event.title.toLowerCase().includes(query);
        const orgMatch = event.organization.toLowerCase().includes(query);
        if (!titleMatch && !orgMatch) return false;
      }
      if (selectedGenres.length > 0 && !selectedGenres.includes(event.category)) {
        return false;
      }
      if (enableParticipantFilter) {
        const participantsLL = event.participantsLL || 1;
        const participantsUL = event.participantsUL || 1;
        // スライダー最大値「5〜」は 5 人以上として扱う
        if (participantMax >= PARTICIPANT_FILTER_OPEN_MAX) {
          if (participantsUL < PARTICIPANT_FILTER_OPEN_MAX) return false;
        } else if (participantMax < participantsLL || participantMax > participantsUL) {
          return false;
        }
      }
      if (enableDurationFilter) {
        if (event.duration) {
          if (event.duration < durationValue - 3 || event.duration > durationValue + 3) {
            return false;
          }
        }
      }
      if (selectedLocation && event.location !== selectedLocation) {
        return false;
      }
      return true;
    });
  }, [
    events,
    searchQuery,
    selectedGenres,
    participantMax,
    enableParticipantFilter,
    durationValue,
    enableDurationFilter,
    selectedLocation,
  ]);

  const displayedEvents = useMemo(() => {
    const scores = isRankingSortKey(sortKey) ? scoreMaps[sortKey] : null;
    return sortEvents(filteredEvents, sortKey, scores, searchQuery);
  }, [filteredEvents, sortKey, scoreMaps, searchQuery]);

  const sortHint = getEventSortResultHint(sortKey);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setParticipantMax(1);
    setEnableParticipantFilter(false);
    setDurationValue(15);
    setEnableDurationFilter(false);
    setSelectedLocation('');
    setSortKey(DEFAULT_EVENT_SORT_KEY);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 検索バー */}
      <div className="flex items-stretch gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            className="ink-shell min-h-11 w-full bg-card py-3 pr-4 pl-10 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
            placeholder="企画名・団体名で検索..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <EventSortMenu value={sortKey} onChange={setSortKey} />
      </div>

      {/* ジャンルフィルター */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {EVENT_CATEGORY_OPTIONS.map(({ id, label }) => (
            <Button
              key={id}
              aria-pressed={selectedGenres.includes(id)}
              type="button"
              variant="outline"
              onClick={() => handleGenreToggle(id)}
            >
              {label}
            </Button>
          ))}
        </div>
        <HelpButton className="shrink-0" description="" title="企画一覧・検索機能について">
          <p>学科展、クラス展、有志展示、模擬店、ステージ、キッチンカーの全企画を一括検索できます。</p>
          <h2>詳細検索</h2>
          <p>参加可能な人数、所要時間、設営場所から企画を絞り込むことができます。</p>
        </HelpButton>
      </div>

      {/* 詳細検索（アコーディオン）。FAQ と同じ白いインク殻 */}
      <Accordion collapsible className="ink-shell bg-card px-6" type="single">
        <AccordionItem value="advanced">
          <AccordionTrigger className="py-5 text-lg font-medium text-foreground">
            <span className="flex min-w-0 items-center gap-3">
              詳細検索
              {enableParticipantFilter || enableDurationFilter || selectedLocation ? (
                <span className="ink-tag">絞り込み中</span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pr-4 pb-6">
            <div className="space-y-6 pt-1">
              <div>
                <FilterToggle
                  checked={enableParticipantFilter}
                  id="enable-participant"
                  onCheckedChange={setEnableParticipantFilter}
                >
                  参加人数
                </FilterToggle>
                <div className={cn('px-4', !enableParticipantFilter && 'pointer-events-none opacity-40')}>
                  <input
                    aria-label="参加人数"
                    aria-valuetext={participantMax >= PARTICIPANT_FILTER_OPEN_MAX ? '5人以上' : `${participantMax}人`}
                    className="w-full"
                    disabled={!enableParticipantFilter}
                    max={PARTICIPANT_FILTER_OPEN_MAX}
                    min={1}
                    style={rangeFillStyle(participantMax, 1, PARTICIPANT_FILTER_OPEN_MAX)}
                    type="range"
                    value={participantMax}
                    onChange={(e) => setParticipantMax(Number(e.target.value))}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    {PARTICIPANT_MARKS.map((mark) => (
                      <span
                        key={mark.value}
                        className={cn(
                          enableParticipantFilter && participantMax === mark.value && 'font-medium text-ink',
                        )}
                      >
                        {mark.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <FilterToggle
                  checked={enableDurationFilter}
                  id="enable-duration"
                  onCheckedChange={setEnableDurationFilter}
                >
                  所要時間
                </FilterToggle>
                <div className={cn('px-4', !enableDurationFilter && 'pointer-events-none opacity-40')}>
                  <input
                    aria-label="所要時間"
                    aria-valuetext={`${durationValue}分程度`}
                    className="w-full"
                    disabled={!enableDurationFilter}
                    max="30"
                    min="5"
                    style={rangeFillStyle(durationValue, 5, 30)}
                    type="range"
                    value={durationValue}
                    onChange={(e) => setDurationValue(Number(e.target.value))}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>さくっと</span>
                    <span className={cn('mx-auto', enableDurationFilter && 'font-medium text-ink')}>
                      {durationValue}分程度
                    </span>
                    <span>じっくり</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-foreground" htmlFor="event-location">
                  設営場所
                </label>
                <div className="relative">
                  <select
                    className="ink-shell min-h-11 w-full appearance-none bg-card py-2 pr-11 pl-4 text-foreground focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
                    id="event-location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">すべて</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-soft"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* ヒット件数とリセットボタン */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {displayedEvents.length}件が見つかりました{sortHint ? `（${sortHint}）` : ''}。
        </p>
        {(searchQuery ||
          selectedGenres.length > 0 ||
          enableParticipantFilter ||
          enableDurationFilter ||
          selectedLocation ||
          sortKey !== DEFAULT_EVENT_SORT_KEY) && (
          <button className="ink-link flex items-center gap-1 text-xs" onClick={handleResetFilters}>
            <RotateCcw className="h-3 w-3" />
            リセット
          </button>
        )}
      </div>

      {/* 企画カード */}
      <div className="space-y-4">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event) => <ExhibitionCard key={event.slug} event={event} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">検索条件に該当する企画が見つかりません。</p>
          </div>
        )}
      </div>
    </div>
  );
}

function rangeFillStyle(value: number, min: number, max: number): CSSProperties {
  const fill = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return { '--range-fill': `${fill}%` } as CSSProperties;
}

function FilterToggle({
  id,
  checked,
  onCheckedChange,
  children,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label
      className="mb-2 flex min-h-11 w-fit cursor-pointer items-center gap-3 text-sm font-medium text-foreground"
      htmlFor={id}
    >
      <input
        checked={checked}
        className="peer sr-only focus:outline-none"
        id={id}
        type="checkbox"
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span
        aria-hidden
        className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border-(length:--shell-stroke) border-ink bg-mist text-ink peer-checked:bg-card peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink"
      >
        <Check className={cn('size-3.5', checked ? 'opacity-100' : 'opacity-0')} strokeWidth={2.75} />
      </span>
      {children}
    </label>
  );
}
