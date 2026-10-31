'use client';

import { useEffect, useState } from 'react';

import type { RankingPodiumResponse } from '@/lib/types/ranking';

import { RANKING_CONFIG, isRankingAggregationOpen } from '@/lib/config/rankingConfig';

const PLACE_DIGITS = ['', '１', '２', '３'] as const;

function currentRankingLabel(kind: 'overall' | 'trend', rank: number): string | null {
  const digit = PLACE_DIGITS[rank];
  if (!digit || rank > RANKING_CONFIG.podiumSize) {
    return null;
  }
  if (kind === 'overall') {
    return `現在総合${digit}位！`;
  }
  return `現在トレンド${digit}位！`;
}

function rankForSlug(entries: RankingPodiumResponse['overall'], slug: string): number | null {
  const found = entries.find((entry) => entry.slug === slug);
  if (!found || found.rank < 1 || found.rank > RANKING_CONFIG.podiumSize) {
    return null;
  }
  return found.rank;
}

export function EventRankingBadge({ slug }: { slug: string }) {
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!isRankingAggregationOpen()) {
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch('/api/ranking/podium', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) {
          return;
        }
        const body = (await response.json()) as RankingPodiumResponse;
        if (controller.signal.aborted || !Array.isArray(body.overall) || !Array.isArray(body.trend)) {
          return;
        }
        const overallRank = rankForSlug(body.overall, slug);
        const trendRank = rankForSlug(body.trend, slug);
        const next = [
          overallRank ? currentRankingLabel('overall', overallRank) : null,
          trendRank ? currentRankingLabel('trend', trendRank) : null,
        ].filter((label): label is string => label !== null);
        setLabels(next);
      } catch (error) {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [slug]);

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2">
      {labels.map((label) => (
        <span
          key={label}
          className="inline-flex items-center rounded-(--radius) border-[2.5px] border-ink bg-card px-2 py-0.5 text-xs leading-snug whitespace-nowrap text-ink shadow-[2px_3px_0_0_var(--ink)]"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
