"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Search, ChevronDown, RotateCcw } from "lucide-react"
import Link from "next/link"
import eventsData from "@/lib/events.json"
import { Event } from "@/lib/types/event"
import { getLucideIcon } from "@/lib/lucide-icons"

export const dynamic = "force-dynamic"

// ジャンルマッピング
const genreLabels: Record<string, string> = {
  "class-exhibit": "クラス・学科展",
  "volunteer-exhibit": "有志展示",
  "booth": "模擬店",
  "stage": "ステージ",
  "performance": "パフォーマンス",
}

// ロケーションラベル（データベースから一意に抽出）
function getUniqueLocations(events: Event[]): string[] {
  const locations = new Set(events.map((e) => e.location || ""))
  return Array.from(locations).filter((l) => l).sort()
}

export default function EventListPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <EventListContent />
    </Suspense>
  )
}

function EventListContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [participantMax, setParticipantMax] = useState(5)
  const [durationMax, setDurationMax] = useState(30)
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  // URLクエリパラメータから検索文字を取得
  useEffect(() => {
    const q = searchParams.get("q")
    if (q) {
      setSearchQuery(decodeURIComponent(q))
    }
  }, [searchParams])

  const events = (eventsData.events as Event[]) || []
  const uniqueLocations = useMemo(() => getUniqueLocations(events), [])

  // フィルタリングロジック
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 検索クエリ（企画名優先）
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const titleMatch = event.title.toLowerCase().includes(query)
        const orgMatch = event.organization.toLowerCase().includes(query)
        if (!titleMatch && !orgMatch) return false
      }

      // ジャンルフィルター
      if (selectedGenres.length > 0 && !selectedGenres.includes(event.category)) {
        return false
      }

      // 参加人数フィルター（下限値~上限値の間に選択値が入っていれば表示）
      if (participantMax < 5) {
        // participantMax が 1-4 の場合、参加人数が selectedValue と一致または範囲内か確認
        // 1-2人 → 1か2が選択されていたら表示
        const participantsLL = event.participantsLL || 1
        const participantsUL = event.participantsUL || 1
        if (participantMax < participantsLL || participantMax > participantsUL) {
          return false
        }
      }

      // 所要時間フィルター（duration分）
      if (event.duration && event.duration > durationMax) {
        return false
      }

      // 設営場所フィルター
      if (selectedLocation && event.location !== selectedLocation) {
        return false
      }

      return true
    })
  }, [
    events,
    searchQuery,
    selectedGenres,
    participantMax,
    durationMax,
    selectedLocation,
  ])

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedGenres([])
    setParticipantMax(5)
    setDurationMax(30)
    setSelectedLocation("")
  }

  return (
    <>
      <SiteHeader />
      <PageLayout
        title="企画一覧・検索"
        subtitle="開催されるすべての企画をカテゴリやキーワードで検索できます"
      >
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
              {["class-exhibit", "volunteer-exhibit", "booth"].map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    selectedGenres.includes(genre)
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {genreLabels[genre]}
                </button>
              ))}
            </div>
          </div>

          {/* 詳細検索（アコーディオン） */}
          <div className="border-t border-b border-border py-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              詳細検索
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </button>

            {showAdvanced && (
              <div className="mt-6 space-y-8">
                {/* 参加人数フィルター */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-4">
                    参加人数（おすすめ）
                  </p>
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
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-muted-foreground">さくっと</span>
                    <p className="text-sm font-medium text-foreground">
                      所要時間
                    </p>
                    <span className="text-xs text-muted-foreground">じっくり</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={durationMax}
                    onChange={(e) => setDurationMax(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {durationMax === 30 ? "30分以上" : `${durationMax}分まで`}
                  </p>
                </div>

                {/* 設営場所フィルター */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-3">
                    設営場所
                  </label>
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
            )}
          </div>

          {/* ヒット件数とリセットボタン */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {filteredEvents.length}件が見つかりました。
            </p>
            {(searchQuery ||
              selectedGenres.length > 0 ||
              participantMax < 5 ||
              durationMax < 30 ||
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
          <div className="space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => {
                const IconComponent = getLucideIcon(event.icon)
                // キャッチフレーズを1行にする（長い場合は省略）
                const displayCatchphrase = event.catchphrase
                  ? event.catchphrase.split('\n')[0].length > 40
                    ? event.catchphrase.split('\n')[0].substring(0, 40) + '...'
                    : event.catchphrase.split('\n')[0]
                  : ''
                return (
                  <Link key={event.slug} href={`/events/${event.slug}`}>
                    <div className="flex gap-4 bg-card p-6 hover:bg-muted transition-colors cursor-pointer border border-[#e6e9ed]">
                      {/* アイコン */}
                      <div className="w-16 h-16 bg-muted flex items-center justify-center shrink-0">
                        {IconComponent ? (
                          <IconComponent className="h-8 w-8 text-foreground" />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        )}
                      </div>

                      {/* コンテンツ */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-lg">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {event.organization}
                        </p>
                        {displayCatchphrase && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {displayCatchphrase}
                          </p>
                        )}
                        <div className="flex gap-3 mt-3 flex-wrap text-xs">
                          <span className="px-2 py-1 bg-muted text-foreground">
                            {genreLabels[event.category] || event.category}
                          </span>
                          <span className="px-2 py-1 bg-muted text-foreground">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  検索条件に該当する企画が見つかりません。
                </p>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
