'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageLayout } from '@/components/page-layout';
import { Search, RotateCcw } from 'lucide-react';
import { Event } from '@/lib/types/event';
import { ExhibitionCard } from '@/components/ui/exhibition-card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// ジャンルマッピング
const genreLabels: Record<string, string> = {
  'class-exhibit': 'クラス・学科展',
  'volunteer-exhibit': '有志展示',
  booth: '模擬店',
  stage: 'ステージ',
  'food-truck': 'キッチンカー',
};

// ロケーションラベル（データベースから一意に抽出）
function getUniqueLocations(events: Event[]): string[] {
  const locations = new Set(events.map((e) => e.location || ''));
  return Array.from(locations)
    .filter((l) => l)
    .sort();
}

interface EventListClientProps {
  events: Event[];
  error: string | null;
}

export function EventListClient({ events, error }: EventListClientProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [participantMax, setParticipantMax] = useState(1);
  const [enableParticipantFilter, setEnableParticipantFilter] = useState(false);
  const [durationValue, setDurationValue] = useState(15);
  const [enableDurationFilter, setEnableDurationFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  // URLクエリパラメータから検索文字を取得
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(decodeURIComponent(q));
    }
  }, [searchParams]);

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
        if (participantMax < participantsLL || participantMax > participantsUL) {
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
  };

  if (error) {
    return (
      <>
        <SiteHeader />
        <PageLayout title="企画一覧・検索" subtitle="開催されるすべての企画をカテゴリやキーワードで検索できます">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </PageLayout>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <PageLayout title="企画一覧・検索" subtitle="開催されるすべての企画をカテゴリやキーワードで検索できます">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* 検索バー */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="企画名・団体名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input border border-border focus:outline-none focus:border-ring"
              />
            </div>
          </div>

          {/* ジャンルフィルター */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">ジャンル</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(genreLabels).map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {genreLabels[genre]}
                </button>
              ))}
            </div>
          </div>

          {/* 詳細検索（アコーディオン） */}
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-b border-border last:border-b">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline hover:text-muted-foreground py-4">
                詳細検索
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-8 pt-2">
                  {/* 参加人数フィルター */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="enable-participant"
                        checked={enableParticipantFilter}
                        onChange={(e) => setEnableParticipantFilter(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="enable-participant"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        参加人数
                      </label>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={participantMax}
                      onChange={(e) => setParticipantMax(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5〜</span>
                    </div>
                  </div>

                  {/* 所要時間フィルター */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="enable-duration"
                        checked={enableDurationFilter}
                        onChange={(e) => setEnableDurationFilter(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="enable-duration" className="text-sm font-medium text-foreground cursor-pointer">
                        所要時間
                      </label>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={durationValue}
                      onChange={(e) => setDurationValue(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>さくっと</span>
                      <span className="mx-auto">{durationValue}分程度</span>
                      <span>じっくり</span>
                    </div>
                  </div>

                  {/* 設営場所フィルター */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">設営場所</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-2 bg-input border border-border focus:outline-none focus:border-ring text-foreground"
                    >
                      <option value="">すべて</option>
                      {uniqueLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* ヒット件数とリセットボタン */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{filteredEvents.length}件が見つかりました。</p>
            {(searchQuery ||
              selectedGenres.length > 0 ||
              enableParticipantFilter ||
              enableDurationFilter ||
              selectedLocation) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                リセット
              </button>
            )}
          </div>

          {/* 企画カード */}
          <div className="space-y-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => <ExhibitionCard key={event.slug} event={event} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">検索条件に該当する企画が見つかりません。</p>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
