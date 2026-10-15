'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { HelpButton } from '@/components/ui/help-button';
import { InkPhoto } from '@/components/ui/ink-photo';

import type {
  RankingApiError,
  RankingOverallItem,
  RankingResponse,
  RankingTrendItem,
  RankingWaitItem,
} from '@/lib/types/ranking';

import { RANKING_CONFIG, getWaitLevelLabel, type RankingTab } from '@/lib/config/rankingConfig';
import { formatWaitAgo } from '@/lib/ranking/score';

function formatAverage(value: number): string {
  return value.toFixed(1);
}

function rowClass() {
  return 'ink-shell ink-lift flex items-center gap-4 bg-card p-4';
}

function OverallRow({ item }: { item: RankingOverallItem }) {
  return (
    <li>
      <Link className={rowClass()} href={`/events/${item.slug}`} prefetch={false}>
        <span className="flex w-10 shrink-0 items-center justify-center text-center font-display text-xl tabular-nums text-ink">
          {String(item.rank).padStart(2, '0')}
        </span>
        <InkPhoto alt={item.title} className="ink-shell-sm size-14" size={56} src={item.icon} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{item.title}</p>
          <p className="truncate text-sm text-muted-foreground">{item.organization}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tabular-nums text-sm">{formatAverage(item.average)}</p>
          <p className="text-xs text-muted-foreground">{item.voteCount} 票</p>
        </div>
      </Link>
    </li>
  );
}

function TrendRow({ item }: { item: RankingTrendItem }) {
  return (
    <li>
      <Link className={rowClass()} href={`/events/${item.slug}`} prefetch={false}>
        <span className="flex w-10 shrink-0 items-center justify-center text-center font-display text-xl tabular-nums text-ink">
          {String(item.rank).padStart(2, '0')}
        </span>
        <InkPhoto alt={item.title} className="ink-shell-sm size-14" size={56} src={item.icon} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{item.title}</p>
          <p className="truncate text-sm text-muted-foreground">{item.organization}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tabular-nums text-sm">{item.uniqueVisitors}</p>
          <p className="text-xs text-muted-foreground">人</p>
        </div>
      </Link>
    </li>
  );
}

function WaitRow({ item, generatedAt }: { item: RankingWaitItem; generatedAt: string }) {
  return (
    <li>
      <Link className={rowClass()} href={`/events/${item.slug}`} prefetch={false}>
        <span className="flex w-10 shrink-0 items-center justify-center text-center font-display text-xl tabular-nums text-ink">
          {String(item.rank).padStart(2, '0')}
        </span>
        <InkPhoto alt={item.title} className="ink-shell-sm size-14" size={56} src={item.icon} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{item.title}</p>
          <p className="truncate text-sm text-muted-foreground">{item.organization}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm">{getWaitLevelLabel(item.level)}</p>
          <p className="text-xs text-muted-foreground">{formatWaitAgo(item.lastVotedAt, generatedAt)}</p>
          <p className="text-xs text-muted-foreground">{item.voteCount} 件</p>
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
  const waitItems = tab === 'wait' && data?.tab === 'wait' ? data.items : [];
  const awaitingTab = data?.tab !== tab;
  const generatedAt = data?.generatedAt ?? new Date().toISOString();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            aria-pressed={tab === 'overall'}
            size="lg"
            type="button"
            variant="outline"
            onClick={() => setTab('overall')}
          >
            総合
          </Button>
          <Button
            aria-pressed={tab === 'trend'}
            size="lg"
            type="button"
            variant="outline"
            onClick={() => setTab('trend')}
          >
            トレンド
          </Button>
          <Button
            aria-pressed={tab === 'wait'}
            size="lg"
            type="button"
            variant="outline"
            onClick={() => setTab('wait')}
          >
            待ち
          </Button>
        </div>
        <HelpButton description="" title="リアルタイムランキングとは">
          <p>
            リアルタイムランキングとは、ユーザーの投票をもとに、現在の待ち時間やトレンドをランキング表示する機能です。
            <br />
            60秒ごとに更新されます。
            <br />
          </p>
          <h2>総合</h2>
          <p>体験した人の評価の平均をもとにした順位です。</p>
          <h2>トレンド</h2>
          <p>直近20分にスタンプを獲得した人数をもとにした順位です。</p>
          <h2>待ち</h2>
          <p>来場者が見た、いまの並びの目安です。</p>
        </HelpButton>
      </div>

      {awaitingTab || (loading && !data) ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-6" />
        </div>
      ) : null}

      {errorMessage && !awaitingTab ? (
        <div className="ink-shell bg-card p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{errorMessage}</p>
        </div>
      ) : null}

      {!awaitingTab && !errorMessage && tab === 'overall' && overallItems.length === 0 ? (
        <div className="ink-shell bg-card p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            まだ投票がありません。スタンプ帳の獲得画面から星を付けてください。
          </p>
        </div>
      ) : null}

      {!awaitingTab && !errorMessage && tab === 'trend' && trendItems.length === 0 ? (
        <div className="ink-shell bg-card p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">直近20分の来訪はまだありません。</p>
        </div>
      ) : null}

      {!awaitingTab && !errorMessage && tab === 'wait' && waitItems.length === 0 ? (
        <div className="ink-shell bg-card p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            直近15分の待ち情報はまだありません。スタンプ帳の獲得画面から、いまの並びを教えてください。
          </p>
        </div>
      ) : null}

      {!awaitingTab && overallItems.length > 0 ? (
        <ol className="space-y-3">
          {overallItems.map((item) => (
            <OverallRow key={item.slug} item={item} />
          ))}
        </ol>
      ) : null}

      {!awaitingTab && trendItems.length > 0 ? (
        <ol className="space-y-3">
          {trendItems.map((item) => (
            <TrendRow key={item.slug} item={item} />
          ))}
        </ol>
      ) : null}

      {!awaitingTab && waitItems.length > 0 && data?.tab === 'wait' ? (
        <ol className="space-y-3">
          {waitItems.map((item) => (
            <WaitRow key={item.slug} generatedAt={generatedAt} item={item} />
          ))}
        </ol>
      ) : null}
    </div>
  );
}
