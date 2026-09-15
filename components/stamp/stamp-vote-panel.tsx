'use client';

import { Star, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { RankingVoteError } from '@/lib/types/ranking';

import { RANKING_CONFIG, type WaitLevel } from '@/lib/config/rankingConfig';
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

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; error: string | null }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return { ok: true, error: null };
    }
    const data = (await response.json().catch(() => null)) as RankingVoteError | null;
    return { ok: false, error: data?.error ?? '投票に失敗しました。スタンプは獲得済みです。' };
  } catch {
    return { ok: false, error: '通信に失敗しました。スタンプは獲得済みです。' };
  }
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
  const [stars, setStars] = useState(3);
  const [waitLevel, setWaitLevel] = useState<WaitLevel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasIcon = isImageUrl(icon);

  async function handleWaitSelect(nextWaitLevel: WaitLevel) {
    if (submitting) {
      return;
    }
    setWaitLevel(nextWaitLevel);
    setSubmitting(true);
    setErrorMessage(null);

    const proof = { slug, signature, obtainedAt };
    const tasks = [
      postJson('/api/ranking/wait', { ...proof, level: nextWaitLevel }),
      postJson('/api/ranking/vote', { ...proof, stars }),
    ];

    const results = await Promise.all(tasks);
    const failed = results.find((result) => !result.ok);
    if (failed) {
      setErrorMessage(failed.error);
      setSubmitting(false);
      return;
    }

    onVoted();
  }

  return (
    <div className="space-y-5">
      <DialogHeader className="space-y-1 text-left">
        <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">Vote</p>
        <DialogTitle className="text-lg font-medium tracking-wide">
          {alreadyOwned ? 'すでに獲得済みです' : 'スタンプを獲得しました'}
        </DialogTitle>
        <DialogDescription className="text-sm leading-loose tracking-wider">
          {alreadyOwned
            ? `「${title}」の感想を、もう一度送れます。`
            : '星を確認して、いまの並びを押してください。'}
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
            const filled = value <= stars;
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

      <div>
        <p className="mb-1 text-sm tracking-wider">いまの並び</p>
        <p className="mb-3 text-sm text-muted-foreground leading-loose tracking-wider">
          いま見えている並びを押してください。押すと送信されます。
        </p>
        <div aria-busy={submitting} aria-label="いまの並び" className="grid grid-cols-2 gap-2" role="group">
          {RANKING_CONFIG.waitLevels.map((option) => {
            const selected = waitLevel === option.value;
            return (
              <button
                key={option.value}
                aria-label={`${option.label}を送信`}
                className={`flex flex-col items-center justify-center gap-2 border px-2 py-3 transition-opacity hover:opacity-80 ${
                  selected ? 'border-foreground bg-foreground text-background' : 'border-foreground'
                }`}
                disabled={submitting}
                type="button"
                onClick={() => void handleWaitSelect(option.value)}
              >
                <span className="flex gap-0.5">
                  {RANKING_CONFIG.waitLevels.map((iconLevel) => {
                    const filled = iconLevel.value <= option.value;
                    return (
                      <User
                        key={iconLevel.value}
                        className={`size-4 ${
                          filled
                            ? selected
                              ? 'fill-background text-background'
                              : 'fill-foreground text-foreground'
                            : selected
                              ? 'fill-none text-background/40'
                              : 'fill-none text-[#bcbfc3]'
                        }`}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </span>
                <span className="text-xs tracking-wider">
                  {submitting && selected ? '送信中…' : option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive leading-loose tracking-wider">{errorMessage}</p>
      ) : null}

      <div className="text-center">
        <Button
          className="text-muted-foreground"
          disabled={submitting}
          size="sm"
          type="button"
          variant="ghost"
          onClick={onSkip}
        >
          スキップ
        </Button>
      </div>
    </div>
  );
}
