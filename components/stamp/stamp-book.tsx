'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { InAppBrowserNotice } from '@/components/stamp/in-app-browser-notice';
import { StampBoothCard } from '@/components/stamp/stamp-booth-card';
import { StampEarnedDialog } from '@/components/stamp/stamp-earned-dialog';
import { StampProgress } from '@/components/stamp/stamp-progress';
import { StampRedeemPanel } from '@/components/stamp/stamp-redeem-panel';
import { Separator } from '@/components/ui/separator';

import type { StampBoothGroup, StampStorageData, StampVerifySuccess } from '@/lib/types/stamp';

import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import { isInAppBrowser } from '@/lib/stamp/in-app-browser';
import { markStampRedeemed, readStampStorage, writeStampStorage } from '@/lib/stamp/storage';

interface StampBookProps {
  groups: StampBoothGroup[];
}

function formatRedeemedAt(iso: string | null): string {
  if (!iso) {
    return '';
  }
  try {
    return new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function StampBook({ groups }: StampBookProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [storage, setStorage] = useState<StampStorageData | null>(null);
  const [validSlugs, setValidSlugs] = useState<string[]>([]);
  const [isCleared, setIsCleared] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showInAppNotice, setShowInAppNotice] = useState(false);
  const [earnedOpen, setEarnedOpen] = useState(false);
  const [earnedTitle, setEarnedTitle] = useState<string | null>(null);
  const [alreadyOwned, setAlreadyOwned] = useState(false);

  const allBooths = useMemo(() => groups.flatMap((group) => group.booths), [groups]);
  const totalCount = allBooths.length;
  const titleBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const booth of allBooths) {
      map.set(booth.slug, booth.title);
    }
    return map;
  }, [allBooths]);

  const collectedCount = validSlugs.length;
  const requiredCount = STAMP_CONFIG.clearConditions.requiredStampCount;

  useEffect(() => {
    setShowInAppNotice(isInAppBrowser());
    setStorage(readStampStorage());
  }, []);

  useEffect(() => {
    if (!storage) {
      return;
    }

    let cancelled = false;

    async function verify() {
      setIsVerifying(true);
      try {
        const response = await fetch('/api/stamp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stamps: storage!.stamps }),
        });
        if (!response.ok) {
          if (!cancelled) {
            setValidSlugs([]);
            setIsCleared(false);
          }
          return;
        }
        const data = (await response.json()) as StampVerifySuccess;
        if (!cancelled) {
          setValidSlugs(data.validSlugs);
          setIsCleared(data.isCleared);
        }
      } catch {
        if (!cancelled) {
          setValidSlugs([]);
          setIsCleared(false);
        }
      } finally {
        if (!cancelled) {
          setIsVerifying(false);
        }
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [storage]);

  useEffect(() => {
    const earned = searchParams.get('earned');
    if (!earned || !storage) {
      return;
    }
    const already = searchParams.get('already') === '1';
    setEarnedTitle(titleBySlug.get(earned) ?? earned);
    setAlreadyOwned(already);
    setEarnedOpen(true);
    router.replace('/stamp', { scroll: false });
  }, [searchParams, storage, titleBySlug, router]);

  const handleRedeem = () => {
    if (!storage) {
      return;
    }
    const next = markStampRedeemed(storage);
    writeStampStorage(next);
    setStorage(next);
  };

  if (storage?.isRedeemed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-primary text-primary-foreground px-6 py-16 text-center space-y-6">
        <p className="font-display text-[15px] tracking-[0.03em] text-white/70 uppercase">Redeemed</p>
        <h2 className="text-3xl md:text-5xl font-medium tracking-[0.1em] leading-[1.35]">引き換え済みです</h2>
        {storage.redeemedAt && (
          <p className="text-sm text-white/80 leading-[2] tracking-[0.05em]">
            引き換え日時: {formatRedeemedAt(storage.redeemedAt)}
          </p>
        )}
      </div>
    );
  }

  const validSet = new Set(validSlugs);

  return (
    <div className="space-y-10 max-w-3xl">
      <p className="text-sm text-muted-foreground leading-[2] tracking-[0.05em]">
        ※通常のブラウザ（Safari / Chrome 等）でご参加ください
      </p>

      {showInAppNotice && <InAppBrowserNotice />}

      <StampProgress collectedCount={collectedCount} totalCount={totalCount} />

      {groups.length === 0 ? (
        <div className="bg-card p-6">
          <p className="text-sm text-muted-foreground leading-[2] tracking-[0.05em]">
            現在表示できるスタンプ対象ブースがありません。
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.category} className="space-y-4">
              <div className="space-y-1">
                <p className="font-display text-[15px] tracking-[0.03em] text-muted-foreground uppercase">
                  {group.category === 'class-exhibit' ? 'Class' : 'Volunteer'}
                </p>
                <h2 className="text-lg font-medium tracking-normal">{group.label}</h2>
              </div>
              <Separator className="bg-border" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {group.booths.map((booth) => (
                  <StampBoothCard key={booth.slug} booth={booth} collected={validSet.has(booth.slug)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <StampRedeemPanel
        collectedCount={collectedCount}
        isCleared={isCleared}
        isVerifying={isVerifying}
        requiredCount={requiredCount}
        onRedeem={handleRedeem}
      />

      <StampEarnedDialog
        alreadyOwned={alreadyOwned}
        open={earnedOpen}
        title={earnedTitle}
        onOpenChange={setEarnedOpen}
      />
    </div>
  );
}
