import type { StampVerifyDisplay, StampVerifyState } from '@/lib/types/stamp';

/** 照合状態と LocalStorage の slug 一覧から UI 表示値を導出する */
export function getStampVerifyDisplay(
  verifyState: StampVerifyState,
  localSlugs: readonly string[],
): StampVerifyDisplay {
  const localSet = new Set(localSlugs);
  const localCount = localSlugs.length;

  switch (verifyState.status) {
    case 'ok':
      return {
        collectedSlugs: new Set(verifyState.validSlugs),
        collectedCount: verifyState.validSlugs.length,
        progressCount: verifyState.validSlugs.length,
        isCleared: verifyState.isCleared,
        isVerifying: false,
        verifyFailed: false,
      };
    case 'verifying':
      return {
        collectedSlugs: localSet,
        collectedCount: null,
        progressCount: localCount,
        isCleared: false,
        isVerifying: true,
        verifyFailed: false,
      };
    case 'error':
      return {
        collectedSlugs: localSet,
        collectedCount: localCount,
        progressCount: localCount,
        isCleared: false,
        isVerifying: false,
        verifyFailed: true,
      };
    case 'idle':
    default:
      return {
        collectedSlugs: localSet,
        collectedCount: null,
        progressCount: localCount,
        isCleared: false,
        isVerifying: false,
        verifyFailed: false,
      };
  }
}
