/** スタンプラリー対象のイベントカテゴリ */
export const STAMP_SOURCE_CATEGORIES = ['class-exhibit', 'volunteer-exhibit'] as const;

export type StampSourceCategory = (typeof STAMP_SOURCE_CATEGORIES)[number];

/** スタンプ対象ブース（microCMS events 由来） */
export interface StampBooth {
  slug: string;
  title: string;
  organization: string;
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

/** POST /api/stamp/verify 成功レスポンス */
export interface StampVerifySuccess {
  validSlugs: string[];
  validCount: number;
  requiredCount: number;
  isCleared: boolean;
}

/** クライアント側スタンプ照合の状態（判別可能 union） */
export type StampVerifyState =
  | { status: 'idle' }
  | { status: 'verifying' }
  | { status: 'ok'; validSlugs: string[]; isCleared: boolean }
  | { status: 'error' };

/** 照合状態 + ローカル記録から導出する UI 表示用データ */
export interface StampVerifyDisplay {
  collectedSlugs: Set<string>;
  /** サーバー照合済みの獲得数。初回照合中は null */
  collectedCount: number | null;
  /** プログレスバー用（照合中はローカル記録を使用） */
  progressCount: number;
  isCleared: boolean;
  isVerifying: boolean;
  verifyFailed: boolean;
}
