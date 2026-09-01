/**
 * キャッシュ方針（一元管理）
 *
 * - CMS 由来のページ・fetch: ISR 60秒（祭当日以外は数分の遅延を許容）
 * - スタンプ照合 API など即時性が必要な fetch のみ `no-store`
 *   （`lib/microcms/client` の `cacheMode: 'no-store'`）
 *
 * ページの revalidate は `app/(site)/layout.tsx` で一括設定。
 */

/** microCMS データの ISR 間隔（秒） */
export const CMS_REVALIDATE_SECONDS = 60;
