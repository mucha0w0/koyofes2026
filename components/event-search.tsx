"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

export function EventSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    router.push(`/events/list?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

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
              onKeyPress={handleKeyPress}
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

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-foreground text-background font-medium hover:opacity-80 cursor-pointer transition-opacity"
          >
            検索する
          </button>
        </div>
      </div>
    </section>
  )
}
