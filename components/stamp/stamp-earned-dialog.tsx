'use client';

import { StampVotePanel } from '@/components/stamp/stamp-vote-panel';
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
  rankingEnabled: boolean;
  slug: string | null;
  icon: string;
  signature: string | null;
  obtainedAt: string | null;
  onOpenChange: (open: boolean) => void;
}

export function StampEarnedDialog({
  open,
  title,
  alreadyOwned,
  rankingEnabled,
  slug,
  icon,
  signature,
  obtainedAt,
  onOpenChange,
}: StampEarnedDialogProps) {
  const displayTitle = title ?? '';
  const canVote =
    rankingEnabled && slug !== null && signature !== null && obtainedAt !== null && displayTitle.length > 0;

  function close() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[min(90vh,40rem)] overflow-y-auto sm:max-w-md"
      >
        {canVote && slug && signature && obtainedAt ? (
          <StampVotePanel
            key={`${slug}-${obtainedAt}-${open ? 'open' : 'closed'}`}
            alreadyOwned={alreadyOwned}
            icon={icon}
            obtainedAt={obtainedAt}
            signature={signature}
            slug={slug}
            title={displayTitle}
            onSkip={close}
            onVoted={close}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-medium">
                {alreadyOwned ? 'すでに獲得済みです' : 'スタンプを獲得しました！'}
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
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
              <Button className="w-full sm:w-auto" type="button" onClick={close}>
                スタンプ帳を見る
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
