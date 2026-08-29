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

interface StampRedeemPanelProps {
  collectedCount: number;
  requiredCount: number;
  isCleared: boolean;
  isVerifying: boolean;
  onRedeem: () => void;
}

export function StampRedeemPanel({
  collectedCount,
  requiredCount,
  isCleared,
  isVerifying,
  onRedeem,
}: StampRedeemPanelProps) {
  const [open, setOpen] = useState(false);
  const remaining = Math.max(requiredCount - collectedCount, 0);

  if (!isCleared) {
    return (
      <div className="bg-card p-6 space-y-4">
        <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">Lottery</p>
        <p className="text-foreground leading-loose tracking-wider">
          あと <span className="font-medium">{remaining}</span> 個でふくびき券 GET！
        </p>
        <Button disabled className="w-full rounded-none" size="lg" type="button" variant="default">
          ふくびき参加券を表示する
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-primary p-6 space-y-4 text-primary-foreground">
      <p className="font-display text-[15px] tracking-[0.03em] text-white/70 uppercase">Lottery</p>
      <p className="leading-loose tracking-wider">条件達成です。ふくびき参加券を表示できます。</p>
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
              スタッフの確認後に実行してください。引き換え後はこの端末ではスタンプ帳に戻れなくなります。
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
    </div>
  );
}
