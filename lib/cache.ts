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
 * - microCMS の画像はビルド時に `public/cms-images` へ保存し、来場者には静的ファイルとして出す。
 *   `next/image` の最適化は通さない。画像の追加・差し替えは再デプロイで取り直す。
 *   マニフェストに無い URL だけは、従来どおり images.microcms-assets.io から直接配信する
 *
 * ページの revalidate は `app/(site)/layout.tsx` で `false`。
 * ここを正の秒数に戻すと、配下の全ページがその間隔で書き直される。
 */
