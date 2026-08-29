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
  collectedCount: number;
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
  const progressValue = Math.min(100, Math.round((collectedCount / safeTotal) * 100));
  const remaining = Math.max(requiredCount - collectedCount, 0);
  const lotteryMark = Math.min(100, Math.round((requiredCount / safeTotal) * 100));
  const emphasized = isCleared || isRedeemed;

  return (
    <div
      className={`p-6 space-y-5 ${
        emphasized ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
      }`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p
            className={`font-display text-[15px] tracking-[0.03em] uppercase ${
              emphasized ? 'text-white/70' : 'text-muted-foreground'
            }`}
          >
            Rally
          </p>
          <p className={`text-sm leading-loose tracking-wider ${emphasized ? 'text-white/85' : 'text-muted-foreground'}`}>
            {isRedeemed
              ? 'ふくびき参加券は引き換え済みです'
              : isCleared
                ? '条件達成です。ふくびき参加券を表示できます'
                : `あと ${remaining} 個でふくびき券 GET！`}
          </p>
        </div>
        <p className="text-sm tracking-wider shrink-0">
          <span className="text-3xl font-medium tracking-normal tabular-nums">{collectedCount}</span>
          <span className={emphasized ? 'text-white/70' : 'text-muted-foreground'}> / {totalCount}</span>
        </p>
      </div>

      <div className="relative">
        <Progress
          className={`rounded-none h-2.5 ${emphasized ? 'bg-white/25 **:data-[slot=progress-indicator]:bg-white' : 'bg-muted'}`}
          value={progressValue}
        />
        {lotteryMark > 0 && lotteryMark < 100 ? (
          <span
            aria-hidden
            className={`pointer-events-none absolute top-1/2 h-4 w-px -translate-y-1/2 ${
              emphasized ? 'bg-white/55' : 'bg-foreground/35'
            }`}
            style={{ left: `${lotteryMark}%` }}
            title={`ふくびき条件: ${requiredCount} 個`}
          />
        ) : null}
      </div>

      <p className={`text-xs tracking-wider ${emphasized ? 'text-white/65' : 'text-muted-foreground'}`}>
        ふくびき条件 {requiredCount} 個
        {isRedeemed && redeemedAtLabel ? ` · 引き換え ${redeemedAtLabel}` : null}
      </p>

      {isRedeemed ? (
        <p className="text-sm leading-loose tracking-wider text-white/85">
          スタンプ集めは引き続き楽しめます。
        </p>
      ) : isCleared ? (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full rounded-none bg-white/20 text-white hover:opacity-100 hover:bg-white/30"
              disabled={isVerifying}
              size="lg"
              type="button"
              variant="ghost"
            >
              {isVerifying ? '確認中…' : 'ふくびき参加券を表示する'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border-border bg-card shadow-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-medium tracking-wide">引き換えを実行しますか？</AlertDialogTitle>
              <AlertDialogDescription className="leading-loose tracking-wider">
                スタッフの確認後に実行してください。引き換え後もスタンプ集めは続けられます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-none">キャンセル</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-none"
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
        <Button disabled className="w-full rounded-none" size="lg" type="button" variant="default">
          ふくびき参加券を表示する
        </Button>
      )}
    </div>
  );
}
