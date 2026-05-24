"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"

const categories = [
  { id: "all", label: "すべて" },
  { id: "class", label: "クラス・学科展示" },
  { id: "club", label: "有志展示" },
  { id: "stage", label: "ステージイベント" },
  { id: "official", label: "模擬店" },
]

const filters = [
  { id: "food", label: "飲食あり" },
  { id: "free", label: "入場無料" },
  { id: "reservation", label: "予約不要" },
  { id: "accessible", label: "バリアフリー" },
]

export function EventSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    )
  }

  const clearAll = () => {
    setSearchQuery("")
    setActiveCategory("all")
    setActiveFilters([])
  }

  const hasActiveFilters = activeFilters.length > 0 || activeCategory !== "all" || searchQuery !== ""

  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-medium mb-2">
            企画を探す
          </h2>
          <p className="text-muted-foreground">キーワードやカテゴリから企画を検索</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="企画名、キーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 text-sm font-medium transition-opacity ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:opacity-80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="h-4 w-4" />
            絞り込みオプション
            {activeFilters.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-card">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-3 py-1.5 text-sm transition-opacity ${
                    activeFilters.includes(filter.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:opacity-80"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear & Search Button */}
        <div className="flex justify-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              クリア
            </button>
          )}
          <button className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity">
            検索する
          </button>
        </div>
      </div>
    </section>
  )
}
