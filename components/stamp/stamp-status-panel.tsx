'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface StampStatusPanelProps {
  collectedCount: number | null;
  progressCount: number;
  totalCount: number;
  requiredCount: number;
  isCleared: boolean;
  isRedeemed: boolean;
  isVerifying: boolean;
  redeemedAtLabel: string;
  onRedeem: () => void;
}

export function StampStatusPanel({
  collectedCount,
  progressCount,
  totalCount,
  requiredCount,
  isCleared,
  isRedeemed,
  isVerifying,
  redeemedAtLabel,
  onRedeem,
}: StampStatusPanelProps) {
  const [open, setOpen] = useState(false);
  const safeTotal = Math.max(totalCount, 1);
  const progressValue = Math.min(100, Math.round((progressCount / safeTotal) * 100));
  const remaining = Math.max(requiredCount - (collectedCount ?? progressCount), 0);
  const lotteryMark = Math.min(100, Math.round((requiredCount / safeTotal) * 100));

  return (
    <div className="ink-shell space-y-5 bg-card p-6 text-ink">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm leading-relaxed text-ink-soft">
          {isRedeemed
            ? redeemedAtLabel
              ? `ふくびき参加券は引き換え済みです（${redeemedAtLabel}）`
              : 'ふくびき参加券は引き換え済みです'
            : isCleared
              ? '条件達成です。ふくびき参加券を表示できます'
              : `ふくびき券まであと ${remaining} 個`}
        </p>
        <p className="text-sm shrink-0">
          {collectedCount === null ? (
            <span className="text-3xl font-medium tabular-nums text-ink-soft">—</span>
          ) : (
            <span className="text-3xl font-medium tabular-nums">{collectedCount}</span>
          )}
          <span className="text-ink-soft"> / {totalCount}</span>
          {isVerifying ? <span className="ml-2 text-xs text-ink-soft">確認中</span> : null}
        </p>
      </div>

      <div className="relative">
        <Progress className="h-2.5 bg-mist" value={progressValue} />
        {lotteryMark > 0 && lotteryMark < 100 ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-4 w-px -translate-y-1/2 bg-ink/35"
            style={{ left: `${lotteryMark}%` }}
            title={`ふくびき条件: ${requiredCount} 個`}
          />
        ) : null}
      </div>

      {isRedeemed ? (
        <p className="text-sm leading-relaxed text-ink-soft">スタンプ集めは引き続き楽しめます。</p>
      ) : isCleared ? (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button className="w-full" disabled={isVerifying} size="lg" type="button">
              {isVerifying ? '確認中…' : 'ふくびき参加券を表示する'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-medium">引き換えを実行しますか？</AlertDialogTitle>
              <AlertDialogDescription className="leading-relaxed text-ink">
                スタッフの確認後に実行してください。引き換え後もスタンプ集めは続けられます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onRedeem();
                  setOpen(false);
                }}
              >
                引き換えを実行する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button disabled className="w-full" size="lg" type="button" variant="default">
          ふくびき参加券を表示する
        </Button>
      )}
    </div>
  );
}
