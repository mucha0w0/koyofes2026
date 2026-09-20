'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { InkPhoto } from '@/components/ui/ink-photo';
import { InkTextLink } from '@/components/ui/ink-text-link';

import type { RankingApiError, RankingOverallItem, RankingResponse } from '@/lib/types/ranking';

const PREVIEW_COUNT = 3;

function formatAverage(value: number): string {
  return value.toFixed(1);
}

function RankingRow({ item }: { item: RankingOverallItem }) {
  return (
    <Link
      className="ink-shell ink-lift flex h-[100px] items-stretch gap-4 bg-card px-4 py-1.5 text-ink md:px-5"
      href={`/events/${item.slug}`}
    >
      <span className="flex w-10 shrink-0 items-center font-display text-xl tabular-nums md:text-2xl">
        {String(item.rank).padStart(2, '0')}
      </span>
      <InkPhoto alt={item.title} className="ink-shell-sm ink-row-icon h-full min-w-0 w-auto shrink overflow-hidden" size={128} src={item.icon} />
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="truncate font-medium">{item.title}</p>
        <p className="truncate text-sm text-ink-soft">{item.organization}</p>
      </div>
      <div className="flex shrink-0 flex-col justify-center text-right">
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
        <div key={index} className="ink-shell flex h-[100px] items-stretch gap-4 bg-card px-4 py-1.5">
          <div className="h-7 w-10 shrink-0 self-center rounded-[var(--radius)] bg-paper-2" />
          <div className="ink-row-icon rounded-[var(--radius)] bg-paper-2" />
          <div className="flex min-w-0 flex-1 flex-col justify-center space-y-2">
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
    <section aria-busy={loading} className="bg-paper-2 py-12 md:py-16" data-palette="green">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-xl font-medium md:text-2xl">リアルタイムランキング</h2>

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

          <div className="mt-8 text-center">
            <InkTextLink href="/ranking">ランキングを見る</InkTextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
