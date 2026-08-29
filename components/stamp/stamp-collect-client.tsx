'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { InAppBrowserNotice } from '@/components/stamp/in-app-browser-notice';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { isInAppBrowser } from '@/lib/stamp/in-app-browser';
import { addStampEntry, readStampStorage, writeStampStorage } from '@/lib/stamp/storage';
import type { StampCollectError, StampCollectSuccess } from '@/lib/types/stamp';

type CollectStatus = 'idle' | 'loading' | 'error';

export function StampCollectClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const started = useRef(false);

  const [status, setStatus] = useState<CollectStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInAppNotice, setShowInAppNotice] = useState(false);

  useEffect(() => {
    setShowInAppNotice(isInAppBrowser());
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('トークンが見つかりません。NFC / QR から読み取り直してください。');
      return;
    }

    if (started.current) {
      return;
    }
    started.current = true;

    async function collect() {
      setStatus('loading');
      try {
        const response = await fetch('/api/stamp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        window.history.replaceState({}, '', '/stamp/collect');

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as StampCollectError | null;
          setStatus('error');
          setErrorMessage(data?.error ?? 'スタンプの獲得に失敗しました。');
          return;
        }

        const data = (await response.json()) as StampCollectSuccess;
        const storage = readStampStorage();
        const already = storage.stamps.some((stamp) => stamp.slug === data.slug);
        const next = addStampEntry(storage, {
          slug: data.slug,
          signature: data.signature,
          obtainedAt: data.obtainedAt,
        });
        writeStampStorage(next);

        const params = new URLSearchParams({ earned: data.slug });
        if (already) {
          params.set('already', '1');
        }
        router.replace(`/stamp?${params.toString()}`);
      } catch {
        setStatus('error');
        setErrorMessage('通信に失敗しました。ネットワークを確認して、もう一度読み取り直してください。');
      }
    }

    void collect();
  }, [token, router]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {showInAppNotice && <InAppBrowserNotice />}

      {status === 'loading' || status === 'idle' ? (
        <div className="bg-card p-8 flex flex-col items-center gap-4 text-center">
          <Spinner className="size-6" />
          <p className="text-sm text-muted-foreground leading-[2] tracking-[0.05em]">スタンプを確認しています…</p>
        </div>
      ) : null}

      {status === 'error' && (
        <Alert className="rounded-none shadow-none" variant="destructive">
          <AlertTitle className="font-medium tracking-wide">獲得できませんでした</AlertTitle>
          <AlertDescription className="leading-[2] tracking-[0.05em]">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Button asChild className="w-full rounded-none" size="lg">
          <Link href="/stamp">スタンプ帳を開く</Link>
        </Button>
      )}
    </div>
  );
}
