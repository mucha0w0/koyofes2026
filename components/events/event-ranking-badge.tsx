'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import type { RankingPodiumResponse } from '@/lib/types/ranking';

import { RANKING_AGGREGATION_START_MS, RANKING_CONFIG, isRankingAggregationOpen } from '@/lib/config/rankingConfig';

const PLACE_DIGITS = ['', '１', '２', '３'] as const;

function subscribeRankingAggregation(onStoreChange: () => void) {
  const remaining = RANKING_AGGREGATION_START_MS - Date.now();
  if (remaining <= 0) {
    return () => {};
  }
  const timer = window.setTimeout(onStoreChange, remaining);
  return () => window.clearTimeout(timer);
}

function getRankingAggregationClientSnapshot() {
  return isRankingAggregationOpen();
}

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

export function EventRankingBadge({ slug, serverOpen }: { slug: string; serverOpen: boolean }) {
  const getServerSnapshot = useCallback(() => serverOpen, [serverOpen]);
  const open = useSyncExternalStore(
    subscribeRankingAggregation,
    getRankingAggregationClientSnapshot,
    getServerSnapshot,
  );
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    async function load(signal?: AbortSignal) {
      try {
        const response = await fetch('/api/ranking/podium', { cache: 'no-store', signal });
        if (!response.ok) {
          return;
        }
        const body = (await response.json()) as RankingPodiumResponse;
        if (signal?.aborted || !Array.isArray(body.overall) || !Array.isArray(body.trend)) {
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
        if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }
      }
    }

    void load(controller.signal);

    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') {
        return;
      }
      void load(controller.signal);
    }, RANKING_CONFIG.pollIntervalMs);

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [open, slug]);

  if (!open || labels.length === 0) {
    return null;
  }

  return (
    <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </p>
  );
}
