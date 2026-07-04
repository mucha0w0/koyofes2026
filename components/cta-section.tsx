"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/events/list?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="py-10 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center flex flex-col gap-2 mb-8">
          <h2 className="text-xl md:text-2xl font-medium tracking-tight">
            企画を探す
          </h2>
          <p className="text-foreground/70 text-sm md:text-base">
            他の企画もチェックしましょう
          </p>
        </div>

        {/* 検索フォーム */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="企画名、キーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-12 pl-12 pr-10 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="検索キーワードをクリア"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="h-12 px-8 bg-foreground text-background font-medium hover:opacity-80 cursor-pointer transition-opacity whitespace-nowrap"
          >
            検索する
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/events/list"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            すべての企画を見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
