'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { RankingVoteError } from '@/lib/types/ranking';

import { isImageUrl } from '@/lib/utils';

export interface StampVotePanelProps {
  slug: string;
  title: string;
  icon: string;
  signature: string;
  obtainedAt: string;
  alreadyOwned: boolean;
  onSkip: () => void;
  onVoted: () => void;
}

export function StampVotePanel({
  slug,
  title,
  icon,
  signature,
  obtainedAt,
  alreadyOwned,
  onSkip,
  onVoted,
}: StampVotePanelProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasIcon = isImageUrl(icon);

  async function handleVote() {
    if (stars === null || submitting) {
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/ranking/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, stars, signature, obtainedAt }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as RankingVoteError | null;
        setErrorMessage(data?.error ?? '投票に失敗しました。スタンプは獲得済みです。');
        setSubmitting(false);
        return;
      }

      onVoted();
    } catch {
      setErrorMessage('通信に失敗しました。スタンプは獲得済みです。');
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DialogHeader className="space-y-1 text-left">
        <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">Vote</p>
        <DialogTitle className="text-lg font-medium tracking-wide">
          {alreadyOwned ? 'すでに獲得済みです' : 'スタンプを獲得しました'}
        </DialogTitle>
        <DialogDescription className="text-sm leading-loose tracking-wider">
          {alreadyOwned
            ? `「${title}」の感想を、もう一度投票できます。`
            : `「${title}」の感想を星で教えてください。スキップもできます。`}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden bg-muted">
          {hasIcon ? (
            <Image alt={title} className="size-full object-cover" height={64} src={icon} width={64} />
          ) : (
            <span className="text-xs text-muted-foreground">No image</span>
          )}
        </div>
        <p className="font-medium tracking-wide">{title}</p>
      </div>

      <div>
        <p className="mb-3 text-sm tracking-wider">評価</p>
        <div aria-label="星評価" className="flex gap-1 sm:gap-2" role="radiogroup">
          {[1, 2, 3, 4, 5].map((value) => {
            const filled = stars !== null && value <= stars;
            return (
              <button
                key={value}
                aria-checked={stars === value}
                aria-label={`${value}星`}
                className="flex size-12 items-center justify-center transition-opacity hover:opacity-80"
                disabled={submitting}
                role="radio"
                type="button"
                onClick={() => setStars(value)}
              >
                <Star
                  className={`size-8 ${filled ? 'fill-foreground text-foreground' : 'fill-none text-[#bcbfc3]'}`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive leading-loose tracking-wider">{errorMessage}</p>
      ) : null}

      <div className="space-y-3">
        <Button
          className="w-full rounded-none"
          disabled={stars === null || submitting}
          size="lg"
          type="button"
          onClick={() => void handleVote()}
        >
          {submitting ? '送信中…' : '投票する'}
        </Button>
        <Button
          className="w-full rounded-none"
          disabled={submitting}
          size="lg"
          type="button"
          variant="outline"
          onClick={onSkip}
        >
          スキップ
        </Button>
      </div>
    </div>
  );
}
