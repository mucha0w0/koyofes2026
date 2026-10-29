import type { StampBooth, StampEntry } from '@/lib/types/stamp';

/** トップページの「近くのスタンプ未獲得ブース」件数 */
export const STAMP_PREVIEW_NEXT_COUNT = 3;

/**
 * 未獲得ブースから次の目標を選ぶ。
 * 直近獲得ブースに近い順: 同じ教室、同じ建物かつ同じ階、同じ建物、同じ階、それ以外。
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
    const sameClassroom = Boolean(preferClassroom) && booth.classroom === preferClassroom;
    const sameLocation = Boolean(preferLocation) && booth.location === preferLocation;
    const sameFloor = Boolean(preferFloor) && booth.floor === preferFloor;

    if (sameClassroom) {
      return 0;
    }
    if (sameLocation && sameFloor) {
      return 1;
    }
    if (sameLocation) {
      return 2;
    }
    if (sameFloor) {
      return 3;
    }
    return 4;
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
