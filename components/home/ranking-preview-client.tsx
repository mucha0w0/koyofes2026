'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { RankingApiError, RankingOverallItem, RankingResponse } from '@/lib/types/ranking';

import { isImageUrl } from '@/lib/utils';

const PREVIEW_COUNT = 3;

function formatAverage(value: number): string {
  return value.toFixed(1);
}

function BoothIcon({ icon, large, title }: { icon: string; large?: boolean; title: string }) {
  const size = large ? 96 : 56;

  if (!isImageUrl(icon)) {
    return (
      <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-paper-2 ${large ? 'size-24' : 'size-14'}`}>
        <span className="text-[10px] text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div className={`shrink-0 overflow-hidden rounded-md bg-paper-2 ${large ? 'size-24' : 'size-14'}`}>
      <Image alt={title} className="size-full object-cover" height={size} src={icon} width={size} />
    </div>
  );
}

function FeaturedRow({ item }: { item: RankingOverallItem }) {
  return (
    <Link
      className="flex items-center gap-4 rounded-md bg-card p-5 text-ink transition-colors hover:bg-mist-hover md:gap-6 md:p-6"
      href={`/events/${item.slug}`}
    >
      <span className="w-12 shrink-0 font-display text-3xl tabular-nums md:text-4xl">
        {String(item.rank).padStart(2, '0')}
      </span>
      <BoothIcon large icon={item.icon} title={item.title} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium">{item.title}</p>
        <p className="truncate text-sm text-ink-soft">{item.organization}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="tabular-nums text-lg md:text-xl">{formatAverage(item.average)}</p>
        <p className="text-xs text-ink-soft">{item.voteCount} 票</p>
      </div>
    </Link>
  );
}

function CompactRow({ item }: { item: RankingOverallItem }) {
  return (
    <Link
      className="flex items-center gap-4 rounded-md bg-mist p-4 text-ink transition-colors hover:bg-mist-hover"
      href={`/events/${item.slug}`}
    >
      <span className="w-10 shrink-0 font-display text-xl tabular-nums text-ink">
        {String(item.rank).padStart(2, '0')}
      </span>
      <BoothIcon icon={item.icon} title={item.title} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{item.title}</p>
        <p className="truncate text-sm text-ink-soft">{item.organization}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="tabular-nums text-sm">{formatAverage(item.average)}</p>
        <p className="text-xs text-ink-soft">{item.voteCount} 票</p>
      </div>
    </Link>
  );
}

function PreviewSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 bg-card p-5 md:p-6">
        <div className="h-9 w-12 shrink-0 rounded-md bg-paper-2" />
        <div className="size-24 shrink-0 rounded-md bg-paper-2" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-1/2 rounded-md bg-paper-2" />
          <div className="h-4 w-1/3 rounded-md bg-paper-2" />
        </div>
      </div>
      <div className="flex items-center gap-4 bg-card p-4">
        <div className="h-7 w-10 shrink-0 rounded-md bg-paper-2" />
        <div className="size-14 shrink-0 rounded-md bg-paper-2" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded-md bg-paper-2" />
          <div className="h-3 w-1/3 rounded-md bg-paper-2" />
        </div>
      </div>
      <div className="flex items-center gap-4 bg-card p-4">
        <div className="h-7 w-10 shrink-0 rounded-md bg-paper-2" />
        <div className="size-14 shrink-0 rounded-md bg-paper-2" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-2/5 rounded-md bg-paper-2" />
          <div className="h-3 w-1/4 rounded-md bg-paper-2" />
        </div>
      </div>
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

  const featured = items?.[0];
  const rest = items?.slice(1) ?? [];
  const loading = items === null && !errorMessage;

  return (
    <section aria-busy={loading} className="bg-paper-2 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <h2 className="text-xl font-medium md:text-2xl">リアルタイムランキング</h2>
              <p className="text-sm text-muted-foreground">星の総合評価 上位{PREVIEW_COUNT}企画</p>
            </div>
            <Link
              className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              href="/ranking"
            >
              ランキングを見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? <PreviewSkeleton /> : null}

          {errorMessage ? (
            <div className="bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{errorMessage}</p>
            </div>
          ) : null}

          {items && items.length === 0 && !errorMessage ? (
            <div className="bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                まだ投票がありません。スタンプ帳の獲得画面から星を付けてください。
              </p>
            </div>
          ) : null}

          {featured ? (
            <ol className="space-y-2">
              <li key={featured.slug}>
                <FeaturedRow item={featured} />
              </li>
              {rest.map((item) => (
                <li key={item.slug}>
                  <CompactRow item={item} />
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  );
}
