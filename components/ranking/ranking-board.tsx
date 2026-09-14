'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';

import type { RankingApiError, RankingOverallItem, RankingResponse, RankingTrendItem } from '@/lib/types/ranking';

import { RANKING_CONFIG, type RankingTab } from '@/lib/config/rankingConfig';
import { isImageUrl } from '@/lib/utils';

function formatAverage(value: number): string {
  return value.toFixed(1);
}

function BoothIcon({ icon, title }: { icon: string; title: string }) {
  if (!isImageUrl(icon)) {
    return (
      <div className="flex size-14 shrink-0 items-center justify-center bg-muted">
        <span className="text-[10px] text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div className="size-14 shrink-0 overflow-hidden bg-muted">
      <Image alt={title} className="size-full object-cover" height={56} src={icon} width={56} />
    </div>
  );
}

function OverallRow({ item }: { item: RankingOverallItem }) {
  return (
    <li>
      <Link className="flex items-center gap-4 bg-card p-4 transition-opacity hover:opacity-80" href={`/events/${item.slug}`}>
        <span className="w-10 shrink-0 font-display text-xl tabular-nums tracking-wide text-foreground">
          {String(item.rank).padStart(2, '0')}
        </span>
        <BoothIcon icon={item.icon} title={item.title} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium tracking-wide">{item.title}</p>
          <p className="truncate text-sm text-muted-foreground">{item.organization}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tabular-nums text-sm tracking-wider">{formatAverage(item.average)}</p>
          <p className="text-xs text-muted-foreground tracking-wider">{item.voteCount} 票</p>
        </div>
      </Link>
    </li>
  );
}

function TrendRow({ item }: { item: RankingTrendItem }) {
  return (
    <li>
      <Link className="flex items-center gap-4 bg-card p-4 transition-opacity hover:opacity-80" href={`/events/${item.slug}`}>
        <span className="w-10 shrink-0 font-display text-xl tabular-nums tracking-wide text-foreground">
          {String(item.rank).padStart(2, '0')}
        </span>
        <BoothIcon icon={item.icon} title={item.title} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium tracking-wide">{item.title}</p>
          <p className="truncate text-sm text-muted-foreground">{item.organization}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tabular-nums text-sm tracking-wider">{item.uniqueVisitors}</p>
          <p className="text-xs text-muted-foreground tracking-wider">人</p>
        </div>
      </Link>
    </li>
  );
}

export function RankingBoard() {
  const [tab, setTab] = useState<RankingTab>('overall');
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const [data, setData] = useState<RankingResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      const requestedTab = tab;
      try {
        const response = await fetch(`/api/ranking?tab=${requestedTab}`, {
          cache: 'no-store',
          signal,
        });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as RankingApiError | null;
          throw new Error(body?.error ?? 'ランキングを取得できませんでした');
        }
        const body = (await response.json()) as RankingResponse;
        if (signal?.aborted || body.tab !== tabRef.current) {
          return;
        }
        setData(body);
        setErrorMessage(null);
      } catch (error) {
        if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'ランキングを取得できませんでした');
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [tab],
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    void load(controller.signal);

    const timer = window.setInterval(() => {
      void load();
    }, RANKING_CONFIG.pollIntervalMs);

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [load]);

  const overallItems = tab === 'overall' && data?.tab === 'overall' ? data.items : [];
  const trendItems = tab === 'trend' && data?.tab === 'trend' ? data.items : [];
  const awaitingTab = data?.tab !== tab;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">
          {tab === 'overall' ? 'Ranking' : 'Now'}
        </p>
        <p className="text-sm text-muted-foreground leading-loose tracking-wider">
          {tab === 'overall'
            ? '体験した人の星評価による総合順位です。約15秒ごとに更新します。'
            : '直近20分にスタンプを獲得した人数の順位です。約15秒ごとに更新します。'}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          className="rounded-none"
          size="lg"
          type="button"
          variant={tab === 'overall' ? 'default' : 'outline'}
          onClick={() => setTab('overall')}
        >
          総合
        </Button>
        <Button
          className="rounded-none"
          size="lg"
          type="button"
          variant={tab === 'trend' ? 'default' : 'outline'}
          onClick={() => setTab('trend')}
        >
          トレンド
        </Button>
      </div>

      {awaitingTab || (loading && !data) ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-6" />
        </div>
      ) : null}

      {errorMessage && !awaitingTab ? (
        <div className="bg-card p-6">
          <p className="text-sm text-muted-foreground leading-loose tracking-wider">{errorMessage}</p>
        </div>
      ) : null}

      {!awaitingTab && !errorMessage && tab === 'overall' && overallItems.length === 0 ? (
        <div className="bg-card p-6">
          <p className="text-sm text-muted-foreground leading-loose tracking-wider">
            まだ投票がありません。スタンプ獲得画面から星を付けてください。
          </p>
        </div>
      ) : null}

      {!awaitingTab && !errorMessage && tab === 'trend' && trendItems.length === 0 ? (
        <div className="bg-card p-6">
          <p className="text-sm text-muted-foreground leading-loose tracking-wider">
            直近20分の来訪はまだありません。
          </p>
        </div>
      ) : null}

      {!awaitingTab && overallItems.length > 0 ? (
        <ol className="space-y-2">
          {overallItems.map((item) => (
            <OverallRow key={item.slug} item={item} />
          ))}
        </ol>
      ) : null}

      {!awaitingTab && trendItems.length > 0 ? (
        <ol className="space-y-2">
          {trendItems.map((item) => (
            <TrendRow key={item.slug} item={item} />
          ))}
        </ol>
      ) : null}
    </div>
  );
}
