import type { StampEntry, StampStorageData } from '@/lib/types/stamp';

export function isStampEntry(value: unknown): value is StampEntry {
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

export function isStampStorageData(value: unknown): value is StampStorageData {
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
