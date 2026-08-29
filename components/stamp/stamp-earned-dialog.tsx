'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StampEarnedDialogProps {
  open: boolean;
  title: string | null;
  alreadyOwned: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StampEarnedDialog({ open, title, alreadyOwned, onOpenChange }: StampEarnedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="rounded-none border-border bg-card shadow-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-medium tracking-wide">
            {alreadyOwned ? 'すでに獲得済みです' : 'スタンプを獲得しました！'}
          </DialogTitle>
          <DialogDescription className="leading-[2] tracking-[0.05em]">
            {title
              ? alreadyOwned
                ? `「${title}」のスタンプはすでに持っています。`
                : `「${title}」ブースのスタンプを獲得しました！`
              : alreadyOwned
                ? 'このブースのスタンプはすでに持っています。'
                : 'スタンプを獲得しました！'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="rounded-none w-full sm:w-auto" type="button" onClick={() => onOpenChange(false)}>
            スタンプ帳を見る
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
