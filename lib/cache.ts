/**
 * キャッシュ方針（一元管理）
 *
 * - CMS 由来のページと fetch は、時間では再検証しない（ビルド時にキャッシュし、更新まで保持）
 * - 公開コンテンツの更新は microCMS Webhook → `app/api/revalidate/route.ts`
 *   が関係するタグとパスだけを無効化する
 * - 企画・お知らせの「新しい URL」は `dynamicParams = false` のため、
 *   Webhook から Vercel Deploy Hook で再ビルドして増やす
 * - スタンプ照合 API など即時性が必要な fetch のみ `no-store`
 *   （`lib/microcms/client` の `cacheMode: 'no-store'`）
 * - `/official/news` は `searchParams` でページ番号を読むため、
 *   クエリごとに ISR エントリを作らないようページ側で `revalidate = 0`
 *
 * ページの revalidate は `app/(site)/layout.tsx` で `false`。
 * ここを正の秒数に戻すと、配下の全ページがその間隔で書き直される。
 */
