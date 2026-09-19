'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { InkPhoto } from '@/components/ui/ink-photo';

import type { RankingApiError, RankingOverallItem, RankingResponse } from '@/lib/types/ranking';

const PREVIEW_COUNT = 3;

function formatAverage(value: number): string {
  return value.toFixed(1);
}

function RankingRow({ item }: { item: RankingOverallItem }) {
  return (
    <Link className="ink-shell ink-lift flex items-center gap-4 bg-card p-4 text-ink md:p-5" href={`/events/${item.slug}`}>
      <span className="w-10 shrink-0 font-display text-xl tabular-nums md:text-2xl">
        {String(item.rank).padStart(2, '0')}
      </span>
      <InkPhoto alt={item.title} className="ink-shell-sm size-14" size={56} src={item.icon} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{item.title}</p>
        <p className="truncate text-sm text-ink-soft">{item.organization}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="tabular-nums">{formatAverage(item.average)}</p>
        <p className="text-xs text-ink-soft">{item.voteCount} 票</p>
      </div>
    </Link>
  );
}

function PreviewSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="ink-shell flex items-center gap-4 bg-card p-4">
          <div className="h-7 w-10 shrink-0 rounded-[var(--radius)] bg-paper-2" />
          <div className="size-14 shrink-0 rounded-[var(--radius)] bg-paper-2" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded-[var(--radius)] bg-paper-2" />
            <div className="h-3 w-1/3 rounded-[var(--radius)] bg-paper-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RankingPreviewClient() {
  const [items, setItems] = useState<RankingOverallItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch('/api/ranking?tab=overall', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as RankingApiError | null;
          throw new Error(body?.error ?? 'ランキングを取得できませんでした');
        }
        const body = (await response.json()) as RankingResponse;
        if (body.tab !== 'overall') {
          throw new Error('ランキングを取得できませんでした');
        }
        setItems(body.items.slice(0, PREVIEW_COUNT));
        setErrorMessage(null);
      } catch (error) {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'ランキングを取得できませんでした');
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  const loading = items === null && !errorMessage;

  return (
    <section aria-busy={loading} className="bg-paper-2 py-16 md:py-24" data-palette="green">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-medium md:text-2xl">リアルタイムランキング</h2>
            <p className="mt-1 text-sm text-muted-foreground">星の総合評価 上位{PREVIEW_COUNT}企画</p>
            <p className="mt-3">
              <Link className="ink-link text-sm" href="/ranking">
                ランキングを見る
              </Link>
            </p>
          </div>

          {loading ? <PreviewSkeleton /> : null}

          {errorMessage ? (
            <div className="ink-shell bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{errorMessage}</p>
            </div>
          ) : null}

          {items && items.length === 0 && !errorMessage ? (
            <div className="ink-shell bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                まだ投票がありません。スタンプ帳の獲得画面から星を付けてください。
              </p>
            </div>
          ) : null}

          {items && items.length > 0 ? (
            <ol className="space-y-3">
              {items.map((item) => (
                <li key={item.slug}>
                  <RankingRow item={item} />
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  );
}
