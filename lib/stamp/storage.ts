import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import type { StampEntry, StampStorageData } from '@/lib/types/stamp';

export function createEmptyStampStorage(): StampStorageData {
  return {
    stamps: [],
    isRedeemed: false,
    redeemedAt: null,
  };
}

function isStampEntry(value: unknown): value is StampEntry {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.slug === 'string' &&
    typeof entry.signature === 'string' &&
    typeof entry.obtainedAt === 'string'
  );
}

function isStampStorageData(value: unknown): value is StampStorageData {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const data = value as Record<string, unknown>;
  return (
    Array.isArray(data.stamps) &&
    data.stamps.every(isStampEntry) &&
    typeof data.isRedeemed === 'boolean' &&
    (data.redeemedAt === null || typeof data.redeemedAt === 'string')
  );
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
