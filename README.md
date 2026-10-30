# KoYoFes Website

2026年度 **こうよう祭（KoYoFes）** の公式ウェブサイトです。企画情報の検索・閲覧、タイムテーブル、スタンプラリー、企画展ランキング、お知らせなど、来場者向けの情報を提供します。

## 目次

- [技術スタック](#技術スタック)
- [主な機能](#主な機能)
- [サイト構成](#サイト構成)
- [ディレクトリ構成](#ディレクトリ構成)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [環境変数](#環境変数)
- [npm スクリプト](#npm-スクリプト)
- [コンテンツの更新方法](#コンテンツの更新方法)
- [スタンプラリー運用](#スタンプラリー運用)
- [企画展ランキング運用](#企画展ランキング運用)（当日までのチェックリストは [docs/ranking-ops.md](docs/ranking-ops.md)）
- [キャッシュ方針](#キャッシュ方針)
- [デプロイ](#デプロイ)
- [リント・品質チェック](#リント品質チェック)
- [年度更新チェックリスト](#年度更新チェックリスト)

---

## 技術スタック

| 分類 | 技術 |
|------|------|
| フレームワーク | [Next.js](https://nextjs.org/) 16（App Router） |
| UI | [React](https://react.dev/) 19 |
| 言語 | [TypeScript](https://www.typescriptlang.org/) |
| スタイル | [Tailwind CSS](https://tailwindcss.com/) 4 |
| UI コンポーネント | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| アイコン | [Lucide React](https://lucide.dev/) / [React Icons](https://react-icons.github.io/react-icons/) |
| CMS | [microCMS](https://microcms.io/) |
| DB（ランキング） | [Neon](https://neon.tech/) Postgres + [Drizzle](https://orm.drizzle.team/) |
| ホスティング | [Vercel](https://vercel.com/) |
| アナリティクス | [@vercel/analytics](https://vercel.com/docs/analytics) |

---

## 主な機能

### 企画情報

- **企画一覧・検索**（`/events/list`）: キーワード検索、カテゴリ・ジャンルによる絞り込み、並び替え（初期値はランキング（トレンド）。検索中は手動で切り替えるまで一致順。詳細は [企画一覧の並び替え](#企画一覧の並び替え)）
- **企画詳細**（`/events/[slug]`）: 企画の詳細情報、画像、開催時間・場所の表示
- **おすすめ企画**（`/events/recommended`）: 運営パートメンバーによるおすすめ企画の紹介
- **タイムテーブル**（`/events/timetable`）: ステージ企画の2日間スケジュール表示

### スタンプラリー

- **スタンプ帳**（`/stamp`）: 対象ブース一覧と獲得状況の表示
- **スタンプ獲得**（`/stamp/collect`）: NFC / QR コードからのスタンプ取得（検索エンジン非対象）
- **サーバー署名検証**: 改ざん防止のため HMAC 署名でスタンプの正当性を検証
- **ふくびき券条件**: 対象ブースのうち 10 個以上のスタンプ獲得でクリア（`lib/config/stampConfig.ts` で設定）

### 企画展ランキング

ナビの分類は **企画情報**。

- **リアルタイムランキング**（`/ranking`）: 星評価の総合、直近20分の来訪トレンド、直近15分の並び（待ち）目安。画面は 60 秒ごとに自動更新する
- **投票**: スタンプ獲得後、スタンプ帳のモーダルで星と待ちを任意投票（片方だけ可・スキップ可）。毎回新しい票として加算
- **開催時のみ**: `RANKING_ENABLED=true` のときナビと投票を出す

### 公式コンテンツ

- **お知らせ**（`/official/news`）: microCMS から取得したニュース一覧・詳細
- **パンフレット**（`/official/pamphlet`）: PDF ビューアとダウンロード

### ご案内

- **アクセス**（`/guide/access`）: 電車・バス・車でのアクセス方法
- **会場マップ**（`/guide/map`）: 構内図と各エリアの説明
- **よくある質問**（`/guide/faq`）: カテゴリ別 FAQ（`lib/faqs.json` から読み込み）
- **お問い合わせ**（`/guide/contact`）: 連絡先情報

### こうよう祭について

- **こうよう祭とは**（`/about/overview`）: 祭の概要・開催情報
- **テーマ**（`/about/theme`）: 今年度のテーマ紹介
- **パート**（`/about/part`）: 運営パートメンバー紹介（microCMS）
- **ご協賛**（`/about/sponsor`）: 協賛企業・団体一覧（microCMS）

### トップページ

ヒーロー、カウントダウン、企画検索、カテゴリ別企画、PR 動画、SNS CTA、タイムテーブルプレビュー、リンク集、お知らせ、協賛企業を表示します。

### その他

- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- CMS 取得失敗時のエラーページ・スケルトン UI
- 404 ページ

---

## サイト構成

ナビゲーション・リンクの定義は **`lib/config/nav.ts`** が単一ソースです。ヘッダー、フッター、トップページのリンク集はすべてこのファイルから生成されます。URL やラベルの変更はここだけ行ってください。

### ルーティング一覧

| パス | 説明 |
|------|------|
| `/` | トップページ |
| `/events/list` | 企画一覧・検索 |
| `/events/recommended` | おすすめ企画 |
| `/events/timetable` | タイムテーブル |
| `/events/[slug]` | 企画詳細 |
| `/official/news` | お知らせ一覧 |
| `/official/news/[id]` | お知らせ詳細 |
| `/official/pamphlet` | パンフレット |
| `/stamp` | スタンプラリー |
| `/stamp/collect` | スタンプ獲得（NFC/QR 用・非公開） |
| `/stamp/reset` | スタンプリセット（デバッグ用・非公開） |
| `/ranking` | 企画展リアルタイムランキング（`RANKING_ENABLED` 時のみナビ表示） |
| `/guide/access` | アクセス |
| `/guide/map` | 会場マップ |
| `/guide/faq` | よくある質問 |
| `/guide/contact` | お問い合わせ |
| `/about/overview` | こうよう祭とは |
| `/about/theme` | テーマ |
| `/about/part` | パート紹介 |
| `/about/sponsor` | ご協賛 |

### API ルート

| パス | メソッド | 説明 |
|------|----------|------|
| `/api/stamp` | POST | トークンからスタンプを発行（署名付き）。ランキング有効時は来訪ログも記録 |
| `/api/stamp/verify` | POST | 保存済みスタンプの署名検証・クリア判定 |
| `/api/ranking` | GET | 総合 / トレンド / 待ち集計（`?tab=overall` / `trend` / `wait`） |
| `/api/ranking/vote` | POST | 星 1〜5 の投票（毎回新規票。スタンプ HMAC 必須） |
| `/api/ranking/wait` | POST | 待ち 1〜4 の投票（毎回新規票。スタンプ HMAC 必須） |

---

## ディレクトリ構成

```
.
├── app/                        # Next.js App Router
│   ├── (site)/                 # サイト本体（共通レイアウト付き）
│   │   ├── page.tsx            # トップページ
│   │   ├── about/              # こうよう祭について
│   │   ├── events/             # 企画情報
│   │   ├── guide/              # ご案内
│   │   ├── official/           # 公式コンテンツ
│   │   ├── ranking/            # リアルタイムランキング
│   │   ├── stamp/              # スタンプラリー
│   │   └── layout.tsx          # サイト共通レイアウト（キャッシュは期限なし）
│   ├── api/ranking/            # ランキング API
│   ├── api/revalidate/         # microCMS Webhook（オンデマンド再検証）
│   ├── api/stamp/              # スタンプラリー API
│   ├── robots.ts               # クローラー許可（トークン URL と API は対象外）
│   ├── sitemap.ts              # 公開ページのサイトマップ
│   ├── globals.css             # グローバルスタイル
│   └── layout.tsx              # ルートレイアウト（フォント・メタデータ）
├── components/
│   ├── about/                  # 概要・パート・協賛関連
│   ├── cms/                    # CMS ページ共通（エラー・スケルトン）
│   ├── common/                 # 共通 UI（スピナーなど）
│   ├── events/                 # 企画検索・カード・タイムテーブル
│   ├── guide/                  # FAQ 関連
│   ├── home/                   # トップページ各セクション
│   ├── illustration/           # 挿絵の帯（Illustration）
│   ├── layout/                 # ヘッダー・フッター・ページレイアウト
│   ├── news/                   # お知らせ
│   ├── ranking/                # ランキング UI
│   ├── stamp/                  # スタンプラリー UI
│   └── ui/                     # shadcn/ui プリミティブ
├── lib/
│   ├── config/                 # 設定の単一ソース
│   │   ├── nav.ts              # ナビゲーション定義
│   │   ├── event-categories.ts # 企画カテゴリ定義
│   │   ├── rankingConfig.ts    # ランキング設定
│   │   └── stampConfig.ts      # スタンプラリー設定
│   ├── microcms/               # microCMS クライアント・型定義
│   ├── ranking/                # ランキング（DB・集計・来場者 Cookie）
│   ├── stamp/                  # スタンプラリー（署名・トークン・ブース取得）
│   ├── types/                  # ドメイン型定義
│   ├── events.ts               # 企画データ取得・変換
│   ├── event-sort.ts           # 企画一覧の並び替え
│   ├── news.ts                 # お知らせデータ取得
│   ├── parts.ts                # パートデータ取得
│   ├── sponsors.ts             # 協賛データ取得
│   ├── recommended-events.ts   # おすすめ企画の組み立て
│   ├── timetable.ts            # タイムテーブル用データ変換
│   ├── faqs.json               # FAQ データ
│   └── cache.ts                # キャッシュ方針の定数
├── public/                     # 静的ファイル（アイコン、画像、PDF など）
│   └── Illustration/           # 挿絵画像（post.png など）
├── drizzle/                    # ランキング用 Postgres スキーマ
├── scripts/
│   └── generate-stamp-tokens.mjs # スタンプトークン生成スクリプト
└── stamp-tokens/               # トークン生成出力（git 管理外）
```

---

## 開発環境のセットアップ

### 必要条件

- **Node.js** 22 以上（`@types/node` のバージョンに準拠）
- **npm**

### 手順

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd test2_2026-05-19

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数を設定（下記「環境変数」参照）
#    プロジェクト直下に .env.local を作成

# 4. 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認します。

> **注意**: microCMS の環境変数が未設定の場合、企画・お知らせ・協賛など CMS 連携ページはエラーになります。スタンプラリー機能を使う場合は、スタンプ関連の環境変数も必要です。

---

## 環境変数

プロジェクト直下に `.env.local` を作成し、以下を設定します。`.env.local` は git 管理外です（`.gitignore` 参照）。

### microCMS（必須: CMS ページを動かす場合）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `MICROCMS_API_KEY` | microCMS の API キー | `xxxxxxxx` |
| `MICROCMS_SERVICE_DOMAIN` | サービスドメイン（`.microcms.io` より前の部分） | `koyofes` |
| `MICROCMS_WEBHOOK_SECRET` | Webhook 署名（HMAC）のシークレット。microCMS のカスタム通知に同じ値を入れる | `（ランダムな文字列）` |
| `VERCEL_DEPLOY_HOOK_URL` | 企画・お知らせの**新しい URL** を増やすときの Vercel Deploy Hook。編集だけなら未使用 | `https://api.vercel.com/v1/integrations/deploy/...` |

`MICROCMS_WEBHOOK_SECRET` は、microCMS が送る `x-microcms-signature` の検証に使います。ヘッダに平文では乗りません。

### スタンプラリー（必須: スタンプ機能を動かす場合）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `STAMP_SIGNING_SECRET` | スタンプ署名用の秘密鍵（十分な長さのランダム文字列） | `your-random-secret-here` |
| `STAMP_TOKEN_MAP` | トークンとブース slug の対応表（JSON オブジェクト） | `{"abc123...":"booth-slug",...}` |

`STAMP_TOKEN_MAP` の形式:

```json
{"ランダムトークン1": "企画のslug1", "ランダムトークン2": "企画のslug2"}
```

トークンは `npm run stamp:generate-tokens` で自動生成できます（[スタンプラリー運用](#スタンプラリー運用) 参照）。

### 企画展ランキング（開催時のみ）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `RANKING_ENABLED` | `true` のときナビ・投票・集計 API を有効化。準備期間は未設定か `false` | `true` |
| `DATABASE_URL` | Neon（または互換 Postgres）の接続文字列。**pooled** 接続を使う | `postgresql://...` |

Neon の手順:

1. [Neon](https://neon.tech/) で無料プロジェクトを作成する
2. コンピュートは最小 **0.25 CU** にする（開催月に 24 時間起こし続けない）
3. pooled の接続文字列を `DATABASE_URL` に入れる
4. `npm run db:push` でテーブルを作成する（または `drizzle/0000_ranking.sql` を実行）
5. 開催前後だけ `RANKING_ENABLED=true` にする

ローカルで Neon を使わずに動かす場合は `DATABASE_URL=pglite` でも可（プロセス内メモリ。再起動で消える。本番では使わない）。

`DATABASE_URL` が無いときはスタンプは従来どおり動き、ランキング API は 503 を返します。接続文字列は Git に置かないでください。

### 設定例（`.env.local`）

```env
MICROCMS_API_KEY=your-api-key
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_WEBHOOK_SECRET=your-webhook-secret
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/your-hook-id/your-token

STAMP_SIGNING_SECRET=your-signing-secret
STAMP_TOKEN_MAP={"exampletoken1234567890abcdef":"example-booth-slug"}

RANKING_ENABLED=false
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

本番環境（Vercel）でも同じ変数を **Environment Variables** に設定してください。

---

## npm スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（ホットリロード有効） |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番ビルド後のサーバー起動 |
| `npm run lint` | ESLint によるコードチェック |
| `npm run lint:fix` | ESLint の自動修正 |
| `npm run lint:html` | Markuplint（`app/`・`components/` のみ） |
| `npm run lint:html:fix` | Markuplint の自動修正 |
| `npm run secretlint` | シークレット漏洩チェック |
| `npm run prettier` | Prettier によるコード整形 |
| `npm run stamp:generate-tokens` | スタンプラリートークンの生成 |
| `npm run db:push` | ランキング用テーブルを Postgres に反映 |
| `npm run db:generate` | Drizzle のマイグレーション生成 |

---

## コンテンツの更新方法

コンテンツの更新場所を整理します。**コードを触らずに更新できるもの**と**開発が必要なもの**を区別してください。

### microCMS 管理画面で更新（コード変更不要）

| コンテンツ | microCMS エンドポイント | 取得関数 | 表示ページ |
|------------|-------------------------|----------|------------|
| 企画情報 | `events` | `lib/events.ts` | 企画一覧・詳細・タイムテーブル・スタンプラリー |
| お知らせ | `news` | `lib/news.ts` | `/official/news` |
| 運営パート | `parts` | `lib/parts.ts` | `/about/part`、おすすめ企画 |
| 協賛企業 | `sponsors` | `lib/sponsors.ts` | `/about/sponsor`、トップページ |

microCMS での更新は、本番では Webhook で反映されます。既存ページの編集は次のアクセスで切り替わります。企画・お知らせの新しい URL は Deploy Hook による再ビルド後に有効になります（[キャッシュ方針](#キャッシュ方針) 参照）。

### コード内のファイルを編集

| コンテンツ | ファイル | 表示ページ |
|------------|----------|------------|
| FAQ | `lib/faqs.json` | `/guide/faq` |
| ナビゲーション・リンク | `lib/config/nav.ts` | ヘッダー・フッター・トップページ |
| 企画カテゴリ定義 | `lib/config/event-categories.ts` | 企画一覧・カテゴリ表示全般 |
| スタンプラリー設定 | `lib/config/stampConfig.ts` | `/stamp` |
| ランキング設定 | `lib/config/rankingConfig.ts` | `/ranking` |
| テーマページ本文 | `app/(site)/about/theme/page.tsx` | `/about/theme` |
| 概要ページ本文 | `components/about/about-section.tsx` など | `/about/overview` |
| アクセス情報 | `app/(site)/guide/access/page.tsx` | `/guide/access` |
| 会場マップ画像 | `app/(site)/guide/map/kounaizu.jpg` | `/guide/map` |
| お問い合わせ | `app/(site)/guide/contact/page.tsx` | `/guide/contact` |
| 公式 Instagram | `lib/config/social.ts` | PR動画、開発用ルックブック |
| パンフレット PDF | `public/koyofes2026_pamphlet.pdf` | `/official/pamphlet` |
| 挿絵 | `public/Illustration/` と `Illustration` | 配置したページ |

### 挿絵

画像は `public/Illustration/` に置きます。ページへの配置は `components/illustration/illustration.tsx` の `Illustration` です。どのページの本文カラムの中に置いても、帯の幅はウィンドウ幅になります。位置・大きさ・背景を省略すると、次の初期値になります。見た目のルールは [DESIGN.md の挿絵](DESIGN.md#挿絵) です。

- 背景は薄い紙 `var(--paper)`
- 大きさはスマホ 148px、PC は 240px
- 絵の右端は本文シェル（`max-w-7xl` の `px-4`）の右
- 描画の下に 36px

```tsx
import { Illustration } from '@/components/illustration/illustration';

<Illustration alt="" src="post.png" />
```

| prop | 意味 |
|------|------|
| `src` | `public/Illustration` のファイル名（例: `post.png`）。`/` または `http` で始まるときは、そのパスを使う |
| `alt` | 代替テキスト。装飾なら `""` |
| `backgroundColor` | 帯の背景色。省略時は `var(--paper)`。`#c7e1e8` や `var(--paper-2)` も指定できる |
| `height` | 帯の高さ。省略時は絵の高さ + 28px。数値は px。文字列は `12rem` や `40%`、`clamp(...)` |
| `imageWidth` / `imageHeight` | 絵の大きさ。省略時はスマホ 148px、PC は 240px（`clamp(148px, 20vw, 240px)`）。片方だけなら画像の比率を保つ。両方ならその枠に収まるよう比率を保つ |
| `top` / `right` / `bottom` / `left` | 帯の中の位置。数値は px。`right` を省略すると本文シェルの右端、`bottom` を省略すると描画の下に 36px。`left` を渡すと右端の初期値は使わない。`top` を渡すと下端の初期値は使わない |
| `className` | 帯への追加クラス。絵を帯の外にはみ出させるときは `overflow-visible` |
| `priority` | 最初の画面に置くとき `true`。読み込みを優先する |

背景が透明な PNG にすると、指定した帯の色が絵のまわりに出ます。帯からはみ出た部分は切れます。親に `overflow: hidden` がある場合、帯はウィンドウ幅まで広がりません。

### 企画カテゴリ

`lib/config/event-categories.ts` で定義されています。

| ID | 表示名 | 用途 |
|----|--------|------|
| `class-exhibit` | クラス・学科展 | スタンプラリー対象 |
| `volunteer-exhibit` | 有志展示 | スタンプラリー対象 |
| `booth` | 模擬店 | |
| `stage` | ステージ | タイムテーブル表示対象 |
| `food-truck` | キッチンカー | |

### 企画一覧の並び替え

`/events/list` の並び替えは `lib/event-sort.ts` で定義しています。初期値は **ランキング（トレンド）** です。検索欄にキーワードがあると、並びを手動で切り替えるまでは **一致順** になります。手動で選んだ並びは、その後に検索欄を変えても保持されます。リセットすると初期値に戻ります。

キーワードは企画名と団体名だけを見ます（大文字・小文字は区別しません）。強い一致ほど上に出ます。

| 順 | 条件 |
|----|------|
| 1 | 企画名がキーワードと完全一致 |
| 2 | 企画名がキーワードで始まる（短い名前が先） |
| 3 | 企画名のより手前にキーワードがある |
| 4 | 団体名がキーワードと完全一致 |
| 5 | 団体名がキーワードで始まる（短い名前が先） |
| 6 | 団体名のより手前にキーワードがある |

同じ強さのときは、microCMS 管理画面のコンテンツ表示順を保ちます。キーワードが空のときも、その表示順のままです。一覧 API には `orders` を付けていないため、公開日時順にはなりません。並びを変えたいときは管理画面でコンテンツの表示順を変えてください。

ほかの並び替えは次のとおりです。ランキング値が無い企画は末尾に残します。

| メニュー | 順序 |
|----------|------|
| 所要時間 | 短い順（未設定は末尾） |
| ランキング（総合） | 総合ランキング順 |
| ランキング（トレンド） | トレンド順 |
| 混雑状況 | 空いている順 |

---

## スタンプラリー運用

### 仕組み

1. microCMS の `events` から、カテゴリが `class-exhibit` または `volunteer-exhibit` の企画をスタンプ対象ブースとして取得
2. 各ブースにランダムトークンを割り当て（`STAMP_TOKEN_MAP`）
3. NFC / QR コードの URL は `https://koyosai.com/stamp/collect?token=<トークン>` 形式
4. 来場者が URL にアクセスすると `/api/stamp` が署名付きスタンプを発行
5. スタンプはブラウザの LocalStorage に保存（キー: `koyosai_stamp_data_2026`）
6. `/api/stamp/verify` で署名を検証し、10 個以上でクリア判定

### トークン生成

```bash
# 初回または新規ブース追加時
npm run stamp:generate-tokens

# 全トークンを再発行（既存 NFC が無効になるため注意）
node scripts/generate-stamp-tokens.mjs --force-rotate
```

**前提条件**: `.env.local` に `MICROCMS_API_KEY` と `MICROCMS_SERVICE_DOMAIN` が設定されていること。

**出力先**（いずれも `stamp-tokens/` 配下、git 管理外）:

| ファイル | 用途 |
|----------|------|
| `stamp-token-map.env.txt` | Vercel / `.env.local` に貼り付ける `STAMP_TOKEN_MAP=` 1 行 |
| `stamp-nfc-urls.csv` | NFC 書き込み用 URL 一覧 |
| `stamp-tokens.json` | slug / title / token / url の詳細 |

**運用フロー**:

1. microCMS にスタンプ対象の企画を登録・公開
2. `npm run stamp:generate-tokens` を実行
3. 出力された `stamp-token-map.env.txt` の内容を Vercel の環境変数 `STAMP_TOKEN_MAP` に設定
4. `stamp-nfc-urls.csv` をもとに NFC タグへ URL を書き込み
5. 本番デプロイ後、実機でスタンプ獲得をテスト

### デバッグ

- `/stamp/reset`: 端末の LocalStorage に保存されたスタンプ記録を消去（検索エンジン非対象）
- 開発環境では microCMS データは常に最新を取得（キャッシュなし）

---

## 企画展ランキング運用

対象はスタンプラリーと同じクラス・学科展 / 有志展示です。公式表彰には使いません。

開催までのチェックリスト・変えてはいけない設定・当日／終了後の作業は **[docs/ranking-ops.md](docs/ranking-ops.md)** を使う。

概要:

1. Neon にテーブルを作成（`npm run db:push`）
2. Vercel に `DATABASE_URL` を入れておき、開催時のみ `RANKING_ENABLED=true` にする
3. 来場者は NFC/QR でスタンプ獲得後、スタンプ帳のモーダルで星と待ちを付けられる（片方だけでも可・スキップ可）
4. 投票は毎回新しい票。連打防止のため同一企画は約 30 秒空ける
5. `/ranking` で総合（ベイズ平均）、トレンド（直近 20 分のユニーク来訪）、待ち（直近 15 分・時間荷重）を見る。表示は 60 秒ごとに自動更新する（企画一覧のランキング順も同じ間隔）

開催が終わったら `RANKING_ENABLED` を外すか `false` にして、Neon を起こし続けないようにしてください。

---

## キャッシュ方針

キャッシュ設定の説明は `lib/cache.ts` にあります。時間での再検証はしません。正の `revalidate` をレイアウトに戻すと、アクセスのあるページがその秒数ごとに ISR Write になります。

| 対象 | 方針 | 設定箇所 |
|------|------|----------|
| CMS ページ全体 | ビルド後は保持。更新は Webhook | `app/(site)/layout.tsx` の `revalidate = false` |
| microCMS fetch（通常） | `revalidate: false` + タグ | `lib/microcms/client.ts` |
| お知らせ一覧 | クエリごとにキャッシュしない | `app/(site)/official/news/page.tsx` の `revalidate = 0` |
| 企画・お知らせの未知の URL | ページを作らない | `dynamicParams = false` |
| スタンプ照合 API | `no-store`（常に最新） | `lib/stamp/booths.ts` の `getStampBoothSlugSet` など |
| ランキング API | `no-store` | `app/api/ranking/route.ts` |
| ランキングページ | `force-dynamic` | `app/(site)/ranking/page.tsx` |

公開中コンテンツの変更は `POST /api/revalidate` が受けます。microCMS の API 設定 → Webhook → カスタム通知で、`events` / `news` / `parts` / `sponsors` の 4 つから同じ URL に送ってください。シークレットは `MICROCMS_WEBHOOK_SECRET` と同じ値です。

既存ページの編集・削除・公開終了は、関係するタグとパスだけを無効化します。企画やお知らせを**新規公開**したとき、または企画の slug・お知らせの ID が変わったときは、`VERCEL_DEPLOY_HOOK_URL` で本番を再ビルドします（`dynamicParams = false` のため、ビルド時に無かった URL はこの再ビルドまで 404 です）。下書きだけの保存では何もしません。

---

## デプロイ

本番環境は **Vercel** でホスティングしています。

### ビルド設定

Vercel の Next.js 既定に従う。`vercel.json` は置かない。

- インストール: `npm install`
- ビルド: `npm run build`

### デプロイ手順（概要）

1. GitHub リポジトリと Vercel プロジェクトを連携
2. [環境変数](#環境変数) を Vercel の Environment Variables に設定
3. `main` ブランチへの push で自動デプロイ

### 本番のみ有効な機能

- `@vercel/analytics` によるアクセス解析（`app/layout.tsx` で `NODE_ENV === 'production'` のときのみ読み込み）

---

## リント・品質チェック

コミット前に以下の実行を推奨します。

```bash
npm run lint          # ESLint
npm run lint:html     # Markuplint（HTML 構造）
npm run secretlint    # シークレット漏洩チェック
```

### Git コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) 形式で、**日本語**で記述します。

```
feat: スタンプラリー獲得ダイアログを追加
fix: タイムテーブルの時刻表示を修正
docs: README の環境変数セクションを更新
```

---

## 年度更新チェックリスト

毎年の祭準備時に確認・更新が必要な項目です。

### コンテンツ

- [ ] microCMS の企画・お知らせ・パート・協賛データを新年度用に更新
- [ ] テーマページ（`/about/theme`）の文案・テーマ名
- [ ] 概要ページ（`/about/overview`）の開催日・概要
- [ ] FAQ（`lib/faqs.json`）の内容
- [ ] パンフレット PDF（`public/koyofes2026_pamphlet.pdf`）の差し替え
- [ ] 挿絵（`public/Illustration/`）と、各ページの `Illustration` の位置・大きさ
- [ ] 会場マップ画像（`app/(site)/guide/map/kounaizu.jpg`）
- [ ] 公式 SNS のアカウント・URL（`lib/config/social.ts` の `enabled` と URL）
- [ ] お問い合わせ先（`/guide/contact`）

### 設定・コード

- [ ] `lib/config/stampConfig.ts` の `storageKey`（LocalStorage キー）を年度に合わせて変更
- [ ] `lib/config/rankingConfig.ts` の Cookie 名・トレンド窓など
- [ ] メタデータ（`app/layout.tsx` の `title` / `description`）
- [ ] スタンプラリートークンの再生成と Vercel 環境変数の更新
- [ ] NFC タグへの URL 書き込み

### インフラ

- [ ] Vercel 環境変数の確認（特に `STAMP_TOKEN_MAP` / `STAMP_SIGNING_SECRET` / `DATABASE_URL` / `RANKING_ENABLED`）
- [ ] Neon のコンピュートが 0.25 CU であること。開催月に常時起動しない
- [ ] microCMS API キーの有効期限・権限確認
- [ ] 本番 URL・ドメイン設定の確認
