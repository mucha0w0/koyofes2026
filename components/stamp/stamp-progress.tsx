'use client';

import { Progress } from '@/components/ui/progress';

interface StampProgressProps {
  collectedCount: number;
  totalCount: number;
}

export function StampProgress({ collectedCount, totalCount }: StampProgressProps) {
  const safeTotal = Math.max(totalCount, 1);
  const value = Math.min(100, Math.round((collectedCount / safeTotal) * 100));

  return (
    <div className="bg-card p-5 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">Progress</p>
        <p className="text-sm text-foreground">
          集めたスタンプ{' '}
          <span className="text-lg font-medium tracking-normal">
            {collectedCount} / {totalCount}
          </span>{' '}
          個
        </p>
      </div>
      <Progress className="rounded-none h-2 bg-muted" value={value} />
    </div>
  );
}
