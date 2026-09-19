'use client';

import { Star, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InkPhoto } from '@/components/ui/ink-photo';

import type { RankingVoteError } from '@/lib/types/ranking';

import { RANKING_CONFIG, type WaitLevel } from '@/lib/config/rankingConfig';

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
        <p className="font-display text-[15px] text-muted-foreground">Vote</p>
        <DialogTitle className="text-lg font-medium">
          {alreadyOwned ? 'すでに獲得済みです' : 'スタンプを獲得しました'}
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed">
          {alreadyOwned
            ? `「${title}」の感想を、もう一度送れます。`
            : '星を確認して、いまの並びを押してください。'}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-4">
        <InkPhoto alt={title} className="ink-shell-sm size-16" size={64} src={icon} />
        <p className="font-medium">{title}</p>
      </div>

      <div>
        <p className="mb-3 text-sm">評価</p>
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
                  className={`size-8 ${filled ? 'fill-ink text-ink' : 'fill-none text-mist'}`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm">いまの並び</p>
        <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
          いま見えている並びを押してください。押すと送信されます。
        </p>
        <div aria-busy={submitting} aria-label="いまの並び" className="grid grid-cols-2 gap-2" role="group">
          {RANKING_CONFIG.waitLevels.map((option) => {
            const selected = waitLevel === option.value;
            return (
              <button
                key={option.value}
                aria-label={`${option.label}を送信`}
                className="ink-shell ink-lift flex min-h-11 flex-col items-center justify-center gap-2 bg-mist px-2 py-3"
                aria-pressed={selected}
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
                              ? 'fill-ink text-ink'
                              : 'fill-ink text-ink'
                            : selected
                              ? 'fill-none text-mist'
                              : 'fill-none text-mist'
                        }`}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </span>
                <span className="text-xs">
                  {submitting && selected ? '送信中…' : option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage ? (
        <p className="text-sm text-ink leading-relaxed">{errorMessage}</p>
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
