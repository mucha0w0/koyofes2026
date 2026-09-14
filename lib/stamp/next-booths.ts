import type { StampBooth, StampEntry } from '@/lib/types/stamp';

/** トップページの「近くのスタンプ未獲得ブース」件数 */
export const STAMP_PREVIEW_NEXT_COUNT = 3;

/**
 * 未獲得ブースから次の目標を選ぶ。
 * 直近獲得ブースと同じ教室・階・場所があれば、そちらを先に出す。
 */
export function pickNextStampBooths(
  booths: readonly StampBooth[],
  collectedSlugs: ReadonlySet<string>,
  options?: {
    limit?: number;
    preferLocation?: string;
    preferFloor?: string;
    preferClassroom?: string;
  },
): StampBooth[] {
  const limit = options?.limit ?? STAMP_PREVIEW_NEXT_COUNT;
  const preferClassroom = options?.preferClassroom?.trim() ?? '';
  const preferFloor = options?.preferFloor?.trim() ?? '';
  const preferLocation = options?.preferLocation?.trim() ?? '';
  const remaining = booths.filter((booth) => !collectedSlugs.has(booth.slug));

  const rank = (booth: StampBooth): number => {
    if (preferClassroom && booth.classroom === preferClassroom) {
      return 0;
    }
    if (preferFloor && booth.floor === preferFloor) {
      return 1;
    }
    if (preferLocation && booth.location === preferLocation) {
      return 2;
    }
    return 3;
  };

  return [...remaining].sort((a, b) => rank(a) - rank(b)).slice(0, limit);
}

/** 獲得履歴の末尾から、いまも対象ブースとして存在する直近1件を返す */
export function findLastCollectedBooth(
  booths: readonly StampBooth[],
  stamps: readonly StampEntry[],
): StampBooth | undefined {
  const boothBySlug = new Map(booths.map((booth) => [booth.slug, booth]));
  for (let index = stamps.length - 1; index >= 0; index -= 1) {
    const entry = stamps[index];
    if (!entry) {
      continue;
    }
    const booth = boothBySlug.get(entry.slug);
    if (booth) {
      return booth;
    }
  }
  return undefined;
}
