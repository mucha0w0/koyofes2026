# トップページ 余白・幅の統一メモ

対象: `/`（`app/(site)/page.tsx`）と、同じシェルを使うヘッダー / フッター。  
目的: 横余白を揃える。広い画面でもコンテンツが伸び切らない。リサイズ時に左右マージンが跳ねない。

下層ページの本文幅（`max-w-3xl` の FAQ・ニュース詳細など）はこのメモの対象外。下層のページ見出しシェルはトップと同じ `max-w-7xl` を使う（`components/layout/page-layout.tsx`）。

---

## 原則

1. **ページ幅の上限は 1280px だけ。** ブレークポイントごとに `max-width` を変えない。
2. **左右パディングは常に `px-4`（16px）。** これ以外の横パディングをシェルに足さない。
3. **背景色・画像は画面端まで伸ばしてよい。中身だけ中央にキャップする。**
4. 検索・スタンプ・ランキングなど「フォーム寄りのブロック」だけ、シェルの内側で **768px** に絞る。

---

## 共通シェル（必須）

横方向の揃いには、次のクラスだけ使う。

```txt
mx-auto w-full max-w-7xl px-4
```

| クラス | 意味 |
| --- | --- |
| `mx-auto` | 1280px を超えた分を左右均等の余白にする |
| `w-full` | 1280px 未満では画面幅いっぱい |
| `max-w-7xl` | 上限 **80rem = 1280px** |
| `px-4` | 左右 **16px** |

1280px 以上の画面での本文幅は **1280 − 32 = 1248px**。  
1280px 未満では **ビューポート幅 − 32px**（左右 16px 固定）。

ヘッダーも同じシェル。高さは `h-16`（64px）。ヒーローは完成絵の比率 `aspect-[1178/295]`。高さはビューポートから引かない。

### Tailwind の `container` は使わない

既定の `.container` は 640 / 768 / 1024 / 1280 / 1536px で `max-width` が段階的に変わる。`mx-auto` と組み合わせると、リサイズのたびに左右余白が伸びて急に戻る。

レイアウトシェルに `container` を付けない。幅は `max-w-7xl` を直接書く。

---

## コンテンツ幅の 2 系統

### A. ワイド（1280px シェルいっぱい）

見出し・カード一覧・グリッドなど、横に並ぶ UI。

内側にさらに `max-w-*` を足さない。

### B. ナロー（内側 768px）

検索バーやリストが主役のブロック。シェルの**中**に重ねる。

```txt
<div className="mx-auto w-full max-w-7xl px-4">
  <div className="mx-auto max-w-3xl">
    …
  </div>
</div>
```

`max-w-3xl` は **48rem = 768px**。`mx-auto` を忘れない。忘れると広い画面で左に寄る。

---

## セクション一覧（現状）

並びは `app/(site)/page.tsx` と同じ。ヘッダー / フッターは `SiteShell`。

| ブロック | ファイル | 横幅 | 背景 | 縦余白（現状） |
| --- | --- | --- | --- | --- |
| Header | `components/layout/site-header.tsx` | A | 通常 | 高さ 64px |
| Hero | `components/home/hero-section.tsx` | 画像はフルブリード（シェルの外） | 完成絵。枠なし | 比率 `1178/295` |
| FestivalCountdown | `components/home/festival-countdown.tsx` | A。バー背景はフルブリード | `bg-charcoal`（`#2a2a2a`） | `py-5` |
| EventSearchSection | `components/events/event-search.tsx` | **B** | `bg-muted` | `py-12 md:py-16`（prominent） |
| CategoryEvents | `components/home/category-events-client.tsx` | A | 通常 | `py-16 md:py-24` |
| PrVideoSection | `components/home/pr-video-section.tsx` | A。埋め込みだけ約 540px | `bg-muted` | `py-16 md:py-24` |
| StampRallyPreview | `components/home/stamp-rally-preview-client.tsx` | **B** | 通常 | `py-16 md:py-24` |
| RankingPreview | `components/home/ranking-preview-client.tsx` | **B** | `bg-muted` | `py-16 md:py-24` |
| TimetablePreview | `components/home/timetable-preview.tsx` | A | `bg-muted` | `py-10 md:py-14` |
| LinksSection | `components/home/links-section.tsx` | A | 通常 | `pt-16 md:pt-24`（下は News と連続） |
| NewsSection | `components/news/news-section.tsx` | A | 通常 | `pb-16 md:pb-24`（上は Links と連続） |
| Sponsors | `components/home/sponsors.tsx` | 見出しは A。ロゴ列はフルブリード | `bg-muted` | `py-12 md:py-16` |
| Footer | `components/layout/site-footer.tsx` | A | `bg-charcoal` | `py-10 md:py-12` |

### 例外（意図したもの）

- **Instagram 埋め込み**: シェル A の内側で `max-w-135 mx-auto`（約 540px）。ウィジェットの推奨幅に合わせている。
- **カウントダウン**: 左右に `px-4` に加えて `env(safe-area-inset-*)`。ノッチ端末用。通常の左右 16px より狭くはならない。
- **LinksSection の列数**: `events` / `official` はナビ設定で `links: false` のため、カードは「こうよう祭について」「ご案内」の **2 列**。`xl:grid-cols-3` はセクションが 3 つ以上のときだけ。2 列なのに 3 列グリッドにすると、広い画面で左に寄って見える。
- **Links と News**: 見た目はひと続き。Links は上余白だけ、News は下余白だけ。間に別セクションを挟むなら、両方に `py-16 md:py-24` を戻す。
- **スポンサーロゴ列**: 見出しだけシェル A。ティッカーは画面端まで流すので `overflow-hidden` の外に出す。

縦余白はまだ完全には揃えていない。新しく足す通常セクションは **`py-16 md:py-24`** を既定にする。短い帯（カウントダウン）だけ薄くする。

---

## 新しいセクションの足し方

1. `<section>` の背景はフル幅（`bg-muted` / `bg-primary` など）。内側の div に背景を塗らない。
2. 中身の最初のラッパーは必ず `mx-auto w-full max-w-7xl px-4`。
3. 検索・一覧プレビューのように読み幅を絞るなら、その中に `mx-auto max-w-3xl`。
4. グリッドは実在する列数に合わせる。空列を作らない。
5. `container` クラス、`max-w-screen-*`、ブレークポイントごとの `max-w-*` 切り替えは使わない。
6. 画面端までの挿絵は `Illustration`（`components/illustration/illustration.tsx`）を使う。位置・大きさ・背景は省略する。初期値は、帯がウィンドウ幅・角 0・地は `var(--paper)`、絵の右端がシェル内側（`max-w-7xl` の `px-4`）に揃い、スマホ 148px・PC は 240px、描画の下に 36px。詳細は [DESIGN.md の挿絵](../DESIGN.md#挿絵)。シェルに背景を塗って幅を縮めない。

---

## やってはいけないこと

- シェルに Tailwind `container` を付ける。
- `max-w-3xl` や `max-w-4xl` を `mx-auto` なしで置く（広い画面で左寄せになる）。
- セクションごとに違う左右パディング（`px-6` / `px-8` など）をシェルに足す。
- コンテンツ用の `max-w-7xl` に背景色を塗って、端まで色が届かない帯にする。
- 2 カードなのに `xl:grid-cols-3` 固定。
