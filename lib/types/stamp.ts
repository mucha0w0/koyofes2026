import type { StampSourceCategory } from '@/lib/config/stampConfig';

/** スタンプ対象ブース（microCMS events 由来） */
export interface StampBooth {
  slug: string;
  title: string;
  icon: string;
  category: StampSourceCategory;
}

/** カテゴリ見出し付きブースグループ */
export interface StampBoothGroup {
  category: StampSourceCategory;
  label: string;
  booths: StampBooth[];
}

/** LocalStorage に保存する獲得エントリ（署名付き） */
export interface StampEntry {
  slug: string;
  signature: string;
  obtainedAt: string;
}

/** LocalStorage 全体 */
export interface StampStorageData {
  stamps: StampEntry[];
  isRedeemed: boolean;
  redeemedAt: string | null;
}

/** POST /api/stamp 成功レスポンス */
export interface StampCollectSuccess {
  slug: string;
  title: string;
  icon: string;
  signature: string;
  obtainedAt: string;
}

/** POST /api/stamp エラーレスポンス */
export interface StampCollectError {
  error: string;
  code?: 'INVALID_TOKEN' | 'MISCONFIGURED' | 'BAD_REQUEST' | 'SERVER_ERROR';
}
