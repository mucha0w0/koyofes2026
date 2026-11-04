'use client';

import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function FestivalEndedNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 px-6 pt-14 pb-8 sm:max-w-sm">
        <DialogHeader className="gap-3 text-center sm:text-center">
          <DialogTitle className="font-display text-xl leading-snug font-medium">
            今年度のこうよう祭は
            <br />
            終了しました
          </DialogTitle>
          <DialogDescription className="text-foreground text-base leading-relaxed">
            またのお越しをお待ちしております。
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
