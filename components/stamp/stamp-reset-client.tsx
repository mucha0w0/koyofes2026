'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';

import { STAMP_CONFIG } from '@/lib/config/stampConfig';

export function StampResetClient() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.removeItem(STAMP_CONFIG.storageKey);
    } catch {
      // ignore
    }
    setDone(true);
    const timer = window.setTimeout(() => {
      router.replace('/stamp');
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-card p-8 flex flex-col items-center gap-4 text-center">
        {!done ? (
          <>
            <Spinner className="size-6" />
            <p className="text-sm text-muted-foreground leading-loose tracking-wider">記録をリセットしています…</p>
          </>
        ) : (
          <>
            <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">Reset</p>
            <p className="text-foreground leading-loose tracking-wider">スタンプ記録をリセットしました。</p>
            <p className="text-sm text-muted-foreground leading-loose tracking-wider">スタンプ帳へ移動します…</p>
            <Button asChild className="rounded-none" size="lg">
              <Link href="/stamp">今すぐスタンプ帳を開く</Link>
            </Button>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-loose tracking-wider text-center">
        ※このページはこの端末・このブラウザの記録だけを消します（デバッグ用）。
      </p>
    </div>
  );
}
