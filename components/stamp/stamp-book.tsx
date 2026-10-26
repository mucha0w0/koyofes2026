'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { InAppBrowserNotice } from '@/components/stamp/in-app-browser-notice';
import { StampCatalogSection } from '@/components/stamp/stamp-catalog-section';
import { StampEarnedDialog } from '@/components/stamp/stamp-earned-dialog';
import { StampStatusPanel } from '@/components/stamp/stamp-status-panel';
import { StampStatusSection } from '@/components/stamp/stamp-status-section';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import type { StampBoothGroup, StampStorageData } from '@/lib/types/stamp';

import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import { isInAppBrowser } from '@/lib/stamp/in-app-browser';
import { markStampRedeemed, readStampStorage, writeStampStorage } from '@/lib/stamp/storage';
import { useStampVerify } from '@/lib/stamp/use-stamp-verify';
import { getStampVerifyDisplay } from '@/lib/stamp/verify-display';

interface StampBookProps {
  groups: StampBoothGroup[];
  rankingEnabled: boolean;
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

export function StampBook({ groups, rankingEnabled }: StampBookProps) {
  const searchParams = useSearchParams();
  const [storage, setStorage] = useState<StampStorageData | null>(null);
  const consumedEarnedKey = useRef<string | null>(null);
  const [showInAppNotice, setShowInAppNotice] = useState(false);
  const [earnedOpen, setEarnedOpen] = useState(false);
  const [earnedTitle, setEarnedTitle] = useState<string | null>(null);
  const [earnedSlug, setEarnedSlug] = useState<string | null>(null);
  const [earnedIcon, setEarnedIcon] = useState('');
  const [earnedSignature, setEarnedSignature] = useState<string | null>(null);
  const [earnedObtainedAt, setEarnedObtainedAt] = useState<string | null>(null);
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
    // router.replace は遷移完了まで searchParams に earned を残す。
    // その間に引き換えで storage が更新されると、この effect が再実行されてモーダルが開き直す。
    const already = searchParams.get('already') === '1';
    const earnedKey = `${earned}:${already ? '1' : '0'}`;
    if (consumedEarnedKey.current === earnedKey) {
      return;
    }
    consumedEarnedKey.current = earnedKey;

    const booth = allBooths.find((item) => item.slug === earned);
    const entry = storage.stamps.find((stamp) => stamp.slug === earned);
    setEarnedSlug(earned);
    setEarnedTitle(booth?.title ?? titleBySlug.get(earned) ?? earned);
    setEarnedIcon(booth?.icon ?? '');
    setEarnedSignature(entry?.signature ?? null);
    setEarnedObtainedAt(entry?.obtainedAt ?? null);
    setAlreadyOwned(already);
    setEarnedOpen(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('earned');
    params.delete('already');
    const query = params.toString();
    // 空オブジェクトだと Next.js が履歴を同期する。history.state を渡すと同期がスキップされる。
    window.history.replaceState({}, '', query ? `/stamp?${query}` : '/stamp');
  }, [searchParams, storage, titleBySlug, allBooths]);

  const handleRedeem = () => {
    if (!storage) {
      return;
    }
    const next = markStampRedeemed(storage);
    writeStampStorage(next);
    setStorage(next);
  };

  return (
    <>
      <StampStatusSection>
        {showInAppNotice && <InAppBrowserNotice />}
        {display.verifyFailed ? (
          <Alert variant="destructive">
            <AlertTitle className="font-medium">スタンプの確認に失敗しました</AlertTitle>
            <AlertDescription className="space-y-3">
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
          <div className="ink-shell bg-card p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              現在表示できるスタンプ対象ブースがありません。
            </p>
          </div>
        ) : null}
      </StampStatusSection>

      <StampCatalogSection collectedSlugs={display.collectedSlugs} groups={groups} />

      <StampEarnedDialog
        alreadyOwned={alreadyOwned}
        icon={earnedIcon}
        obtainedAt={earnedObtainedAt}
        open={earnedOpen}
        rankingEnabled={rankingEnabled}
        signature={earnedSignature}
        slug={earnedSlug}
        title={earnedTitle}
        onOpenChange={setEarnedOpen}
      />
    </>
  );
}
