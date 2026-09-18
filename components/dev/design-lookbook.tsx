'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

import { EventDetailFace, EventListFace, StampBookFace } from '@/components/dev/lookbook-faces';

import { EVENT_CATEGORY_OPTIONS } from '@/lib/config/event-categories';
import { getNavSections } from '@/lib/config/nav';
import { getEnabledOfficialSocials } from '@/lib/config/social';

const LOOKBOOK_PALETTES = [
  {
    id: 'orange',
    label: 'オレンジ',
    paper: '#F5EBC8',
    paper2: '#F0D9B0',
    accent: '#CF783A',
    paperFill: 'var(--paper-orange)',
    paper2Fill: 'var(--paper-2-orange)',
    accentFill: 'var(--accent-orange)',
  },
  {
    id: 'pink',
    label: 'ピンク',
    paper: '#F5E7EA',
    paper2: '#EFD5DB',
    accent: '#D2708D',
    paperFill: 'var(--paper-pink)',
    paper2Fill: 'var(--paper-2-pink)',
    accentFill: 'var(--accent-pink)',
  },
  {
    id: 'sky',
    label: '水色',
    paper: '#E1EDF2',
    paper2: '#C7E1E8',
    accent: '#3E99B0',
    paperFill: 'var(--paper-sky)',
    paper2Fill: 'var(--paper-2-sky)',
    accentFill: 'var(--accent-sky)',
  },
  {
    id: 'green',
    label: '緑',
    paper: '#E0EFE7',
    paper2: '#C5E2D2',
    accent: '#3BA060',
    paperFill: 'var(--paper-green)',
    paper2Fill: 'var(--paper-2-green)',
    accentFill: 'var(--accent-green)',
  },
] as const;

type LookbookPaletteId = (typeof LOOKBOOK_PALETTES)[number]['id'];

const SHARED_PALETTE = [
  { token: '--ink', hex: '#161616', note: '本文。面に塗らない。無彩色', fill: 'var(--ink)' },
  { token: '--ink-soft', hex: '#555555', note: 'キャプション。無彩色', fill: 'var(--ink-soft)' },
  { token: '--mist', hex: '#BABABA', note: '非選択・表見出し。無彩色。ホバーは白で割る', fill: 'var(--mist)' },
  { token: '--accent-soft', hex: '#FFFFFF', note: 'カード・入力・選択チップ', fill: 'var(--festival-accent-soft)' },
  { token: '--danger', hex: '#9C6A66', note: 'エラーの印のみ', fill: 'var(--festival-danger)' },
] as const;

const RANKING = [
  { rank: 1, title: 'サンプル企画 A', votes: 128 },
  { rank: 2, title: 'サンプル企画 B', votes: 96 },
  { rank: 3, title: 'サンプル企画 C', votes: 71 },
] as const;

const NEWS: {
  title: string;
  date: string;
  href: string;
  image?: string;
  imageAlt?: string;
}[] = [
  {
    title: 'ホームページを更新しました。',
    date: '2026.09.16',
    href: '/official/news',
    image: '/20251106soumukikaku2-1024x768.jpg',
    imageAlt: '会場の写真',
  },
  { title: 'パンフレットの案内を掲載しました。', date: '2026.09.14', href: '/official/pamphlet' },
  { title: 'アクセス情報を更新しました。', date: '2026.08.31', href: '/guide/access' },
];

const SECTION_ID = {
  palette: 'palette',
  type: 'type',
  line: 'line',
  button: 'button',
  chip: 'chip',
  form: 'form',
  card: 'card',
  news: 'news',
  chrome: 'chrome',
  page: 'page',
} as const;

const FACE_TOC = [
  { href: '#face-top', label: '面1 トップ' },
  { href: '#face-list', label: '面2 企画一覧' },
  { href: '#face-detail', label: '面3 企画詳細' },
  { href: '#face-stamp', label: '面4 スタンプ帳' },
] as const;

const TOC = [
  { href: `#${SECTION_ID.palette}`, label: '色' },
  { href: `#${SECTION_ID.type}`, label: '活字' },
  { href: `#${SECTION_ID.line}`, label: '塗り' },
  { href: `#${SECTION_ID.button}`, label: 'ボタン' },
  { href: `#${SECTION_ID.chip}`, label: 'チップ' },
  { href: `#${SECTION_ID.form}`, label: '入力' },
  { href: `#${SECTION_ID.card}`, label: 'カード' },
  { href: `#${SECTION_ID.news}`, label: 'お知らせ' },
  { href: `#${SECTION_ID.chrome}`, label: 'ヘッダー／フッター' },
  { href: `#${SECTION_ID.page}`, label: 'ページ見出し' },
] as const;

const ACCENT_BAND = 'bg-[var(--festival-accent)] text-white';

const TICKET_BTN =
  'lookbook-ticket lookbook-subhead inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--festival-accent)] px-5 text-sm font-medium text-white hover:bg-[var(--festival-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40';

function Section({
  id,
  title,
  spec,
  children,
  band = false,
}: {
  id: string;
  title: string;
  spec: string;
  children: React.ReactNode;
  band?: boolean;
}) {
  return (
    <section
      className={band ? 'bg-[var(--paper-2)]' : 'bg-[var(--paper)]'}
      data-ground={band ? 'alt' : 'paper'}
      id={id}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
        <p className="mb-2 text-center text-sm text-[var(--ink-soft)]">{spec}</p>
        <h2 className="mb-10 text-center text-2xl md:text-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function LookbookHeader() {
  const navItems = getNavSections('header');

  return (
    <header data-lookbook-chrome className="sticky top-0 z-20 bg-[var(--festival-accent-soft)]" data-ground="paper">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="lookbook-heading text-xl text-[var(--ink)]" href="/">
          こうよう祭
        </Link>
        <nav aria-label="見本用メインナビゲーション" className="flex flex-wrap items-center justify-end gap-1">
          {navItems.map((item) => (
            <details key={item.id} className="relative">
              <summary className="cursor-pointer list-none rounded-2xl px-3 py-2 text-sm text-[var(--ink)] hover:bg-[var(--mist-hover)] [&::-webkit-details-marker]:hidden">
                {item.label}
              </summary>
              <div className="lookbook-menu absolute top-full right-0 z-10 min-w-44 py-2">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    className="block rounded-xl px-4 py-2 text-sm text-[var(--ink)]"
                    href={subItem.href}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </nav>
      </div>
    </header>
  );
}

function StageSpecimen() {
  return (
    <div>
      <div className="relative h-[220px] w-full bg-[var(--paper-2)] md:h-[360px]">
        <Image
          fill
          priority
          alt="会場の写真（仮。本番ヒーロー用）"
          className="object-cover object-center"
          sizes="100vw"
          src="/20251106soumukikaku2-1024x768.jpg"
        />
      </div>
      <div data-lookbook-chrome className="bg-[var(--paper)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p>
            2026年10月31日(土)・11月1日(日)
            <span className="mx-2 text-[var(--ink-soft)]">/</span>
            9:00 〜 16:00
            <span className="mx-2 text-[var(--ink-soft)]">/</span>
            豊田高専
          </p>
          <a className={`${TICKET_BTN} self-start`} href="#face-list">
            企画を探す
          </a>
        </div>
      </div>
    </div>
  );
}

function RankingSpecimen() {
  return (
    <div className="bg-[var(--paper-2)]" data-ground="alt">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20">
        <p data-lookbook-chrome className="mb-2 text-center text-sm text-[var(--ink-soft)]">
          DESIGN2 11.11 ・ ヒーローの直下。金の王冠は置かない
        </p>
        <h2 data-lookbook-chrome className="mb-10 text-center text-2xl md:text-3xl">
          ランキング
        </h2>
        <ol data-lookbook-chrome className="grid gap-4 md:grid-cols-3">
          {RANKING.map((item) => (
            <li key={item.rank} className="lookbook-rank">
              <span className="lookbook-rank-num">{item.rank}</span>
              <div className="lookbook-thumb lookbook-thumb-sm">
                <Image
                  fill
                  alt=""
                  className="object-cover object-center"
                  sizes="72px"
                  src="/20251106soumukikaku2-1024x768.jpg"
                />
              </div>
              <div className="min-w-0">
                <p className="lookbook-subhead truncate font-medium">{item.title}</p>
                <p className="text-sm text-[var(--ink-soft)]">{item.votes} 票</p>
              </div>
            </li>
          ))}
        </ol>
        <p data-lookbook-chrome className="mt-8 text-center">
          <Link className="btn-quiet" href="/ranking">
            ランキングを見る
          </Link>
        </p>
      </div>
    </div>
  );
}

function CountdownSpecimen() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(Math.max(0, Math.ceil((new Date(2026, 9, 31, 9, 0, 0).getTime() - Date.now()) / 86_400_000)));
  }, []);

  return (
    <div data-lookbook-chrome className={`${ACCENT_BAND} px-4 py-5`}>
      <p className="mx-auto w-full max-w-7xl text-center text-sm sm:text-base">
        開催まで
        <span suppressHydrationWarning className="lookbook-subhead mx-3 text-2xl font-bold tabular-nums tracking-wide">
          {days === null ? '—' : String(days).padStart(2, '0')}
        </span>
        日
      </p>
    </div>
  );
}

function LookbookFooter() {
  const navItems = getNavSections('footer');
  const socialLinks = getEnabledOfficialSocials();

  return (
    <footer data-lookbook-chrome className={ACCENT_BAND}>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="space-y-2 lg:max-w-xs">
            <p className="lookbook-heading text-xl">こうよう祭 2026</p>
            <p className="text-sm text-white/80">
              豊田高専の文化祭
              <br />
              10/31(土)・11/1(日)
            </p>
          </div>
          <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {navItems.map((section) => (
              <div key={section.id}>
                <p className="lookbook-subhead mb-3 text-sm font-medium">{section.label}</p>
                <ul className="space-y-2 text-sm">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link className="text-white underline underline-offset-4" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {socialLinks.length > 0 && (
          <div className="mt-10">
            <p className="lookbook-subhead mb-3 text-sm font-medium">公式SNS</p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  className="lookbook-subhead inline-flex min-h-11 items-center rounded-2xl bg-[color-mix(in_srgb,var(--festival-accent-soft)_16%,transparent)] px-4 text-sm text-white hover:bg-[color-mix(in_srgb,var(--festival-accent-soft)_28%,transparent)]"
                  href={link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="mt-10 flex flex-col gap-2 pt-6 text-xs text-white/70 sm:flex-row sm:justify-between sm:text-sm">
          <p>こうよう祭 2026 システムパート</p>
          <p>&copy; 2026 KoyoFes System Part</p>
        </div>
      </div>
    </footer>
  );
}

export function DesignLookbook() {
  const [grayscale, setGrayscale] = useState(false);
  const [palette, setPalette] = useState<LookbookPaletteId>('orange');
  const [selectedCategory, setSelectedCategory] = useState(EVENT_CATEGORY_OPTIONS[0]?.id ?? '');
  const searchId = useId();
  const activePalette = LOOKBOOK_PALETTES.find((item) => item.id === palette) ?? LOOKBOOK_PALETTES[0];

  return (
    <div
      className={`theme-1dearland min-h-screen overflow-x-hidden ${grayscale ? 'is-grayscale' : ''}`}
      data-palette={palette}
    >
      <div className={`${ACCENT_BAND}`}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm">
            開発用見本 <span className="text-white/70">/dev/design ・ インデックスしない ・ 本番トークン未変更</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div aria-label="基調色" className="flex flex-wrap gap-2" role="group">
              {LOOKBOOK_PALETTES.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={palette === item.id}
                  className="lookbook-subhead min-h-11 rounded-2xl px-3 text-[var(--ink)]"
                  style={{
                    background: item.paperFill,
                    outline: palette === item.id ? '2px solid #ffffff' : undefined,
                    outlineOffset: palette === item.id ? '2px' : undefined,
                  }}
                  type="button"
                  onClick={() => setPalette(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              aria-pressed={grayscale}
              className="min-h-11 rounded-2xl bg-[color-mix(in_srgb,var(--paper)_16%,transparent)] px-3"
              type="button"
              onClick={() => setGrayscale((value) => !value)}
            >
              {grayscale ? 'グレーを解除' : 'クロムをグレーで見る'}
            </button>
            <Link className="lookbook-subhead inline-flex min-h-11 items-center underline underline-offset-4" href="/">
              現行トップへ
            </Link>
          </div>
        </div>
      </div>

      <LookbookHeader />

      <main>
        <div id="face-top">
          <StageSpecimen />
          <RankingSpecimen />
          <CountdownSpecimen />
        </div>

        <EventListFace />
        <EventDetailFace />
        <StampBookFace />

        <div data-lookbook-chrome className="mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
          <p className="text-center text-sm text-[var(--ink-soft)]">DESIGN2.md パイロット ・ 4 面の下は部品カタログ</p>
          <h1 className="mt-2 text-center text-3xl md:text-4xl">1dearland のクロム見本</h1>
          <p className="mx-auto mt-4 max-w-3xl text-center">
            地は基調色の薄い紙。カードとボタンは白い面にインクの枠をつけ、右下へ少し膨らませる。ホバーで持ち上がり、クリックで沈む。ホバーと非選択の塗りは無彩色の霧。主CTAは沈めた基調色に白抜き。ページ上部でオレンジ／ピンク／水色／緑を切り替えて、カテゴリ色の案を見る。
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-[var(--ink-soft)]">
            活字は三段階。いちばん強い見出しは丸ゴ太字。H2 とボタンは丸ゴ。本文は角ゴ。サンエックス公式からは白いヘッダーと舞台の直下のランキングだけ借りる。虹・雲・色つき見出し・pill は写さない。
          </p>
          <nav aria-label="4面の目次" className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {FACE_TOC.map((item) => (
              <a key={item.href} className="lookbook-link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <nav aria-label="部品カタログの目次" className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {TOC.map((item) => (
              <a key={item.href} className="lookbook-link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <Section id={SECTION_ID.palette} spec="カテゴリ色の試験 ・ インクと霧は無彩色で共用" title="色">
          <p data-lookbook-chrome className="mb-6 text-center text-sm text-[var(--ink-soft)]">
            いまの基調は{activePalette.label}。paper / paper-2 / accent だけが色相を持つ。
          </p>
          <div data-lookbook-chrome className="lookbook-soft bg-[var(--paper-2)] p-4">
            <p className="lookbook-subhead mb-4 text-sm font-medium">共用（無彩色）</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {SHARED_PALETTE.map((item) => (
                <figure key={item.token} className="min-w-0">
                  <div className="aspect-square rounded-2xl" style={{ background: item.fill }} />
                  <figcaption className="mt-2 text-sm">
                    <span className="lookbook-subhead block font-medium">{item.token}</span>
                    <span className="block text-[var(--ink-soft)]">
                      {item.hex} ・ {item.note}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div data-lookbook-chrome className="mt-8 space-y-4">
            {LOOKBOOK_PALETTES.map((item) => (
              <div
                key={item.id}
                className="lookbook-soft overflow-hidden bg-[var(--festival-accent-soft)]"
                style={palette === item.id ? { outline: '2px solid var(--ink)', outlineOffset: '2px' } : undefined}
              >
                <p className="lookbook-subhead px-4 pt-4 text-sm font-medium">
                  {item.label}
                  {palette === item.id ? ' ・ 表示中' : ''}
                </p>
                <div className="mt-3 grid grid-cols-3">
                  <p className="px-4 py-6 text-sm" style={{ background: item.paperFill }}>
                    <span className="lookbook-subhead block font-medium">--paper</span>
                    {item.paper} ・ ページ地
                  </p>
                  <p className="px-4 py-6 text-sm" style={{ background: item.paper2Fill }}>
                    <span className="lookbook-subhead block font-medium">--paper-2</span>
                    {item.paper2} ・ セクション帯
                  </p>
                  <p className="px-4 py-6 text-sm text-white" style={{ background: item.accentFill }}>
                    <span className="lookbook-subhead block font-medium">--accent</span>
                    {item.accent} ・ 主 CTA・横断帯
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div data-lookbook-chrome className="lookbook-soft mt-8 grid grid-cols-1 overflow-hidden bg-[var(--paper-2)] sm:grid-cols-2 lg:grid-cols-4">
            <p className="bg-[var(--paper)] px-4 py-6 text-sm">
              <span className="lookbook-subhead block font-medium">--paper</span>
              ページ地。基調色を薄くした紙
            </p>
            <p className="bg-[var(--paper-2)] px-4 py-6 text-sm">
              <span className="lookbook-subhead block font-medium">--paper-2</span>
              セクション帯。一段沈めた同じ色相
            </p>
            <p className="bg-[var(--festival-accent-soft)] px-4 py-6 text-sm">
              <span className="lookbook-subhead block font-medium">--accent-soft</span>
              カード・入力・選択チップ。帯にしない
            </p>
            <p className="bg-[var(--mist)] px-4 py-6 text-sm">
              <span className="lookbook-subhead block font-medium">--mist</span>
              ホバーと非選択。地にしない
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-[var(--ink-soft)]">
            この4色はカテゴリ基調の試験。本番トークンはまだオレンジのまま。赤い面は危険の印以外に使わない。白い面と霧は帯にしない。
          </p>
        </Section>

        <Section band id={SECTION_ID.type} spec="DESIGN2 6 ・ 強調 丸ゴ太字 / 見出し・ボタン 丸ゴ / 本文 角ゴ" title="活字">
          <div data-lookbook-chrome className="mx-auto max-w-3xl space-y-6">
            <div>
              <p className="text-sm text-[var(--ink-soft)]">1 強調 ・ ページ H1 ・ 丸ゴ太字</p>
              <p className="lookbook-heading text-3xl md:text-4xl">こうよう祭とは</p>
            </div>
            <div>
              <p className="text-sm text-[var(--ink-soft)]">2 見出し ・ H2 ・ 丸ゴ</p>
              <p className="lookbook-subhead text-2xl font-medium">開催概要</p>
            </div>
            <div>
              <p className="text-sm text-[var(--ink-soft)]">2 ラベル ・ ボタン ・ 丸ゴ</p>
              <p className="lookbook-subhead text-sm font-medium">企画を探す</p>
            </div>
            <p>
              こうよう祭は、豊田高専で毎年秋に開催される文化祭です。本文はインクの角ゴ。キャプションだけ
              ink-soft。広い字間と Josefin の英字ラベルは使わない。
            </p>
            <p className="text-sm text-[var(--ink-soft)]">キャプション・メタ情報。長文の代用にしない。本文と同じ角ゴ。</p>
            <p>
              リンクは
              <a className="lookbook-link" href="/about/overview">
                こうよう祭とは
              </a>
              のようにインクの下線。オレンジにしない。
            </p>
          </div>
        </Section>

        <Section id={SECTION_ID.line} spec="DESIGN2 7.1 ・ ボタン・カードはインク枠。帯は枠なし" title="塗り">
          <div data-lookbook-chrome className="lookbook-soft grid grid-cols-2 overflow-hidden sm:grid-cols-5">
            <p className="bg-[var(--paper)] px-3 py-8 text-sm">
              <span className="lookbook-subhead block font-medium">paper</span>
              ページ地
            </p>
            <p className="bg-[var(--paper-2)] px-3 py-8 text-sm">
              <span className="lookbook-subhead block font-medium">paper-2</span>
              セクション帯
            </p>
            <p className="bg-[var(--mist)] px-3 py-8 text-sm">
              <span className="lookbook-subhead block font-medium">mist</span>
              ホバー・非選択
            </p>
            <p className="bg-[var(--festival-accent-soft)] px-3 py-8 text-sm">
              <span className="lookbook-subhead block font-medium">accent-soft</span>
              浮く面
            </p>
            <p className="bg-[var(--festival-accent)] px-3 py-8 text-sm text-white">
              <span className="lookbook-subhead block font-medium">accent</span>
              主ボタン・横断帯
            </p>
          </div>
        </Section>

        <Section band id={SECTION_ID.button} spec="DESIGN2 11.3 ・ インク枠。ホバーで持ち上がり、クリックで沈む" title="ボタン">
          <div data-lookbook-chrome className="flex flex-wrap items-center justify-center gap-4">
            <button className={TICKET_BTN} type="button">
              企画を探す
            </button>
            <button className="btn-outline" type="button">
              パンフレット
            </button>
            <button className="btn-quiet" type="button">
              トップページに戻る
            </button>
            <button disabled className={TICKET_BTN} type="button">
              無効
            </button>
          </div>
        </Section>

        <Section band id={SECTION_ID.chip} spec="DESIGN2 11.6 ・ Outline と同じ殻。未選択は霧。選択だけ白" title="チップ">
          <div data-lookbook-chrome className="flex flex-wrap justify-center gap-3">
            {EVENT_CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.id}
                aria-pressed={selectedCategory === option.id}
                className="lookbook-chip"
                type="button"
                onClick={() => setSelectedCategory(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div data-lookbook-chrome className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="lookbook-chip lookbook-chip-on">開催中</span>
            <span className="lookbook-chip lookbook-chip-muted">終了</span>
            <span className="lookbook-chip">獲得済み</span>
          </div>
        </Section>

        <Section band id={SECTION_ID.form} spec="DESIGN2 11.5 ・ エラーは箱にしない。絵の上に載せない" title="入力">
          <div data-lookbook-chrome className="mx-auto max-w-md space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor={searchId}>
                企画を検索
              </label>
              <input className="lookbook-input" id={searchId} placeholder="キーワード" type="search" />
            </div>
            <div className="lookbook-error" role="alert">
              <span aria-hidden className="lookbook-error-mark" />
              <div>
                <p className="text-sm text-[var(--ink-soft)]">エラー</p>
                <p className="lookbook-subhead font-medium">送信できませんでした</p>
                <p className="mt-1 text-sm">印だけ色を持つ。枠で囲まない。</p>
              </div>
            </div>
          </div>
        </Section>

        <Section band id={SECTION_ID.card} spec="DESIGN2 11.4 ・ インク枠。右下へ膨らむ。白いカード" title="カード">
          <div data-lookbook-chrome className="grid gap-5 md:grid-cols-2">
            <article className="lookbook-card">
              <p className="lookbook-subhead text-lg font-bold">アクセス</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">電車・バス・車でのアクセス方法</p>
            </article>
            <article className="lookbook-card lookbook-card-on">
              <p className="lookbook-subhead text-lg font-bold">ホバー</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">右下の膨らみが伸びて、面が少し持ち上がる。</p>
            </article>
          </div>
          <div data-lookbook-chrome className="lookbook-soft mt-4 bg-[var(--paper)] p-5" data-ground="paper">
            <p className="mb-4 text-sm text-[var(--ink-soft)]">同じ白いカードを paper の地の上へ</p>
            <div className="grid gap-5 md:grid-cols-2">
              <article className="lookbook-card">
                <p className="lookbook-subhead text-lg font-bold">薄い地の上のカード</p>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">白。地との差は霧より弱い。</p>
              </article>
              <article className="lookbook-card lookbook-card-on">
                <p className="lookbook-subhead text-lg font-bold">ホバー</p>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">帯の紙色にはしない。枠と右下の膨らみで浮かせる。</p>
              </article>
            </div>
          </div>
          <div data-lookbook-chrome className="lookbook-card lookbook-card-static mt-8">
            <div className="overflow-x-auto">
            <table className="lookbook-table w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="mb-3 text-left text-sm text-[var(--ink-soft)]">
                表の見本 ・ 見出し行だけ霧。本文行は白。罫線なし
              </caption>
              <thead>
                <tr>
                  <th className="px-3 py-3 font-medium">順位</th>
                  <th className="px-3 py-3 font-medium">企画</th>
                  <th className="px-3 py-3 font-medium">票</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-3">1</td>
                  <td className="px-3 py-3">サンプル企画 A</td>
                  <td className="px-3 py-3">128</td>
                </tr>
                <tr>
                  <td className="px-3 py-3">2</td>
                  <td className="px-3 py-3">サンプル企画 B</td>
                  <td className="px-3 py-3">96</td>
                </tr>
                <tr>
                  <td className="px-3 py-3">3</td>
                  <td className="px-3 py-3">サンプル企画 C</td>
                  <td className="px-3 py-3">71</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </Section>

        <Section band id={SECTION_ID.news} spec="DESIGN2 11.12 ・ 日付＋見出し。ライムの NEW は足さない" title="お知らせ">
          <div data-lookbook-chrome className="grid gap-5 md:grid-cols-3">
            {NEWS.map((item) => (
              <article key={item.title} className={item.image ? 'lookbook-card lookbook-card-media' : 'lookbook-card'}>
                {item.image ? (
                  <div className="relative aspect-[16/10] bg-[var(--paper-2)]">
                    <Image fill alt={item.imageAlt ?? ''} className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" src={item.image} />
                  </div>
                ) : null}
                <div className={item.image ? 'lookbook-card-body' : undefined}>
                  <p className="text-sm text-[var(--ink-soft)]">{item.date}</p>
                  <p className="lookbook-subhead mt-2 font-medium">
                    <Link className="lookbook-link" href={item.href}>
                      {item.title}
                    </Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p data-lookbook-chrome className="mt-8 text-center">
            <Link className="btn-quiet" href="/official/news">
              お知らせを見る
            </Link>
          </p>
        </Section>

        <Section id={SECTION_ID.chrome} spec="DESIGN2 11.1 / 11.2 ・ このページの上下が実物" title="ヘッダー／フッター">
          <p data-lookbook-chrome className="mx-auto max-w-3xl text-center">
            開発バーの下が提案ヘッダー（白・sticky・祭名活字のみ。機関車は足さない。後からロゴ画像で挿し替え）。ページ最下部が提案フッター（accent 地＋白抜き＋既存ナビの列）。本番コンポーネントはまだ差し替えていない。ナビは開閉できる見本。
          </p>
          <figure data-lookbook-chrome className="lookbook-soft relative mx-auto mt-10 aspect-[1178/295] max-w-3xl overflow-hidden bg-[var(--paper-2)]">
            <Image
              fill
              alt="こうよう祭 2026 テーマ 1dearland のコンセプトアート"
              className="object-contain"
              sizes="(min-width: 768px) 48rem, 100vw"
              src="/conceptart.jpg"
            />
          </figure>
          <p data-lookbook-chrome className="mx-auto mt-3 max-w-3xl text-center text-sm text-[var(--ink-soft)]">
            テーマページ用の舞台。本番トップのヒーローには使わない。
          </p>
        </Section>

        <Section band id={SECTION_ID.page} spec="DESIGN2 9 ・ 見出し下は余白。枠なし" title="ページ見出し">
          <div data-lookbook-chrome className="mx-auto max-w-3xl pb-8">
            <Link className="lookbook-link lookbook-subhead text-sm" href="/">
              トップページに戻る
            </Link>
            <p className="lookbook-heading mt-6 text-3xl md:text-4xl">こうよう祭とは</p>
            <p className="mt-3 text-[var(--ink-soft)]">歴史と概要</p>
          </div>
          <p data-lookbook-chrome className="mx-auto mt-8 max-w-3xl">
            こうよう祭は、豊田高専で毎年秋に開催される文化祭です。下層の本文はこの密度を基準にする。
          </p>
        </Section>
      </main>

      <LookbookFooter />
    </div>
  );
}
