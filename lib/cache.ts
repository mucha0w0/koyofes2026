/**
 * キャッシュ方針（一元管理）
 *
 * - CMS 由来のページと fetch は、時間では再検証しない（ビルド時にキャッシュし、更新まで保持）
 * - 公開コンテンツの更新は microCMS Webhook → `app/api/revalidate/route.ts`
 *   が関係するタグとパスだけを無効化する
 * - 企画・お知らせの「新しい URL」は `dynamicParams = false` のため、
 *   Webhook から Vercel Deploy Hook で再ビルドして増やす
 * - スタンプ照合・獲得も同じタグ付き fetch を使う。`no-store` は開発時と、
 *   呼び出し側が明示したときだけ（`lib/microcms/client`）
 * - `/official/news` は `searchParams` でページ番号を読むため、
 *   クエリごとに ISR エントリを作らないようページ側で `revalidate = 0`
 *   （お知らせ JSON 自体はタグ付き fetch キャッシュ）
 * - `MICROCMS_API_KEY` と `MICROCMS_SERVICE_DOMAIN` が両方あれば microCMS。
 *   両方無ければ `data/cms` と `public/cms-images` のスナップショット（API も画像も叩かない）
 * - 画像は `public/cms-images` の静的ファイル。`next/image` の最適化は通さない。
 *   マニフェストに無い URL だけは images.microcms-assets.io に落ちる
 *
 * ページの revalidate は `app/(site)/layout.tsx` で `false`。
 * ここを正の秒数に戻すと、配下の全ページがその間隔で書き直される。
 */
