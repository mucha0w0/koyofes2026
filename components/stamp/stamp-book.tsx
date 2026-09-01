'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { CategorySection } from '@/components/category-section';
import { InAppBrowserNotice } from '@/components/stamp/in-app-browser-notice';
import { StampBoothCard } from '@/components/stamp/stamp-booth-card';
import { StampEarnedDialog } from '@/components/stamp/stamp-earned-dialog';
import { StampStatusPanel } from '@/components/stamp/stamp-status-panel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import type { StampBoothGroup, StampStorageData } from '@/lib/types/stamp';

import { getStampCategoryIcon } from '@/lib/config/category-icons';
import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import { isInAppBrowser } from '@/lib/stamp/in-app-browser';
import { markStampRedeemed, readStampStorage, writeStampStorage } from '@/lib/stamp/storage';
import { useStampVerify } from '@/lib/stamp/use-stamp-verify';
import { getStampVerifyDisplay } from '@/lib/stamp/verify-display';

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
  const [showInAppNotice, setShowInAppNotice] = useState(false);
  const [earnedOpen, setEarnedOpen] = useState(false);
  const [earnedTitle, setEarnedTitle] = useState<string | null>(null);
  const [alreadyOwned, setAlreadyOwned] = useState(false);

  const { verifyState, retry } = useStampVerify(storage?.stamps);

  const allBooths = useMemo(() => groups.flatMap((group) => group.booths), [groups]);
  const totalCount = allBooths.length;
  const titleBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const booth of allBooths) {
      map.set(booth.slug, booth.title);
    }
    return map;
  }, [allBooths]);

  const localSlugs = useMemo(() => storage?.stamps.map((stamp) => stamp.slug) ?? [], [storage]);
  const display = getStampVerifyDisplay(verifyState, localSlugs);
  const requiredCount = STAMP_CONFIG.clearConditions.requiredStampCount;

  useEffect(() => {
    setShowInAppNotice(isInAppBrowser());
    setStorage(readStampStorage());
  }, []);

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

  return (
    <div className="space-y-8 max-w-3xl">
      {showInAppNotice && <InAppBrowserNotice />}
      {display.verifyFailed ? (
        <Alert variant="destructive">
          <AlertTitle className="font-medium tracking-wide">スタンプの確認に失敗しました</AlertTitle>
          <AlertDescription className="leading-loose tracking-wider space-y-3">
            <p>通信エラーのため正確な獲得数を表示できません。表示は端末内の記録に基づいています。</p>
            <Button disabled={display.isVerifying} size="sm" type="button" variant="outline" onClick={retry}>
              {display.isVerifying ? '確認中…' : '再試行'}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}
      <StampStatusPanel
        collectedCount={display.collectedCount}
        isCleared={display.isCleared}
        isRedeemed={storage?.isRedeemed ?? false}
        isVerifying={display.isVerifying}
        progressCount={display.progressCount}
        redeemedAtLabel={formatRedeemedAt(storage?.redeemedAt ?? null)}
        requiredCount={requiredCount}
        totalCount={totalCount}
        onRedeem={handleRedeem}
      />

      {groups.length === 0 ? (
        <div className="bg-card p-6">
          <p className="text-sm text-muted-foreground leading-loose tracking-wider">
            現在表示できるスタンプ対象ブースがありません。
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <CategorySection
              key={group.category}
              icon={getStampCategoryIcon(group.category)}
              title={group.label}
            >
              <div className="flex flex-wrap gap-4 p-4">
                {group.booths.map((booth) => (
                  <StampBoothCard
                    key={booth.slug}
                    booth={booth}
                    collected={display.collectedSlugs.has(booth.slug)}
                  />
                ))}
              </div>
            </CategorySection>
          ))}
        </div>
      )}

      <StampEarnedDialog
        alreadyOwned={alreadyOwned}
        open={earnedOpen}
        title={earnedTitle}
        onOpenChange={setEarnedOpen}
      />
    </div>
  );
}
