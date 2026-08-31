import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import { isStampStorageData } from '@/lib/stamp/validation';
import type { StampEntry, StampStorageData } from '@/lib/types/stamp';

export function createEmptyStampStorage(): StampStorageData {
  return {
    stamps: [],
    isRedeemed: false,
    redeemedAt: null,
  };
}

/** LocalStorage から読み取り。不正・未設定なら空データ */
export function readStampStorage(): StampStorageData {
  if (typeof window === 'undefined') {
    return createEmptyStampStorage();
  }

  try {
    const raw = window.localStorage.getItem(STAMP_CONFIG.storageKey);
    if (!raw) {
      return createEmptyStampStorage();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isStampStorageData(parsed)) {
      return createEmptyStampStorage();
    }
    return parsed;
  } catch {
    return createEmptyStampStorage();
  }
}

export function writeStampStorage(data: StampStorageData): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STAMP_CONFIG.storageKey, JSON.stringify(data));
}

/** 同一 slug が無ければ追記。あれば既存を維持（先勝ち） */
export function addStampEntry(data: StampStorageData, entry: StampEntry): StampStorageData {
  if (data.stamps.some((stamp) => stamp.slug === entry.slug)) {
    return data;
  }
  return {
    ...data,
    stamps: [...data.stamps, entry],
  };
}

export function markStampRedeemed(data: StampStorageData, redeemedAt = new Date().toISOString()): StampStorageData {
  return {
    ...data,
    isRedeemed: true,
    redeemedAt,
  };
}
