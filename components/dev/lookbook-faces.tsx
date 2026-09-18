'use client';

import Image from 'next/image';
import { useMemo, useState, type ReactNode } from 'react';

import { cmsPageMeta } from '@/components/cms/cms-page-meta';

import { EVENT_CATEGORY_OPTIONS, getEventCategoryLabel } from '@/lib/config/event-categories';
import { STAMP_CONFIG } from '@/lib/config/stampConfig';
import { formatDuration, formatLocation, formatParticipants } from '@/lib/event-display';
import { formatEventTimeRange } from '@/lib/event-time';
import type { EventCategory } from '@/lib/types/event';

const CAMPUS_PHOTO = '/20251106soumukikaku2-1024x768.jpg';
const TICKET_BTN =
  'lookbook-ticket lookbook-subhead inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--festival-accent)] px-5 text-sm font-medium text-white hover:bg-[var(--festival-accent-hover)]';

type SampleEvent = {
  slug: string;
  title: string;
  organization: string;
  category: EventCategory;
  location: string;
  floor: string;
  classroom: string;
  catchphrase: string;
  description: string;
  organDescription: string;
  author: string;
  'time-day1': string;
  'time-day2': string;
  duration: number;
  participantsUL: number;
  participantsLL: number;
};

const SAMPLE_EVENTS: SampleEvent[] = [
  {
    slug: 'sample-class-a',
    title: 'サンプル企画 A',
    organization: '有志団体A',
    category: 'class-exhibit',
    location: '本館',
    floor: '1階',
    classroom: '1101',
    catchphrase: '見て、作って、持ち帰る。',
    description:
      'これはルックブック用の本文見本です。本文は本文用ゴシックで読み、見出しは丸ゴシックの太字です。本番の企画文は CMS から入ります。',
    organDescription: '有志で活動している団体の紹介見本です。',
    author: '見本',
    'time-day1': '09001600',
    'time-day2': '09001600',
    duration: 30,
    participantsUL: 9999,
    participantsLL: 0,
  },
  {
    slug: 'sample-volunteer',
    title: 'サンプル企画 B',
    organization: '有志団体B',
    category: 'volunteer-exhibit',
    location: '本館',
    floor: '2階',
    classroom: '2203',
    catchphrase: '手を動かして確かめる。',
    description: '検索とカテゴリで絞り込んだあとも、同じカードの並びが保たれるかを見るための見本です。',
    organDescription: '有志展示の団体紹介見本です。',
    author: '見本',
    'time-day1': '10001500',
    'time-day2': '10001500',
    duration: 20,
    participantsUL: 8,
    participantsLL: 1,
  },
  {
    slug: 'sample-booth',
    title: 'サンプル企画 C',
    organization: '有志団体C',
    category: 'booth',
    location: '屋外',
    floor: '',
    classroom: '',
    catchphrase: '通りがかりに立ち寄る。',
    description: '画像はカードの上、文言は下です。カテゴリ名は既存のラベルだけを使い、新しい分類は足しません。',
    organDescription: '模擬店の団体紹介見本です。',
    author: '見本',
    'time-day1': '09001600',
    'time-day2': '09001600',
    duration: 0,
    participantsUL: 0,
    participantsLL: 0,
  },
];

const SAMPLE_BOOTHS = [
  { slug: 'booth-1', title: 'サンプルブース 1', organization: '有志団体A', category: 'class-exhibit' as const },
  { slug: 'booth-2', title: 'サンプルブース 2', organization: '有志団体B', category: 'class-exhibit' as const },
  { slug: 'booth-3', title: 'サンプルブース 3', organization: '有志団体C', category: 'class-exhibit' as const },
  { slug: 'booth-4', title: 'サンプルブース 4', organization: '有志団体D', category: 'volunteer-exhibit' as const },
  { slug: 'booth-5', title: 'サンプルブース 5', organization: '有志団体E', category: 'volunteer-exhibit' as const },
  { slug: 'booth-6', title: 'サンプルブース 6', organization: '有志団体F', category: 'volunteer-exhibit' as const },
];

function FaceFrame({
  id,
  spec,
  ground,
  children,
}: {
  id: string;
  spec: string;
  ground: 'paper' | 'alt';
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-ground={ground}
      className={ground === 'alt' ? 'bg-[var(--paper-2)] py-16 md:py-24' : 'bg-[var(--paper)] py-16 md:py-24'}
    >
      <p className="mb-10 px-4 text-center font-[family-name:var(--font-ui)] text-xs tracking-wide text-[var(--ink-soft)]">
        {spec}
      </p>
      <div className="mx-auto max-w-7xl px-4">{children}</div>
    </section>
  );
}

function PageLead({ title, subtitle, backHref = '#face-top' }: { title: string; subtitle?: string; backHref?: string }) {
  return (
    <div className="mb-10">
      <a href={backHref} className="lookbook-link lookbook-subhead text-sm">
        戻る
      </a>
      <h1 className="lookbook-heading mt-3">{title}</h1>
      {subtitle ? <p className="mt-3 text-[var(--ink-soft)]">{subtitle}</p> : null}
    </div>
  );
}

export function EventListFace() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const meta = cmsPageMeta.eventList;

  const filtered = useMemo(() => {
    const q = query.trim();
    return SAMPLE_EVENTS.filter((event) => {
      if (category !== 'all' && event.category !== category) return false;
      if (!q) return true;
      return event.title.includes(q) || event.organization.includes(q);
    });
  }, [category, query]);

  return (
    <FaceFrame id="face-list" spec="DESIGN2 Gate C ・ 面2 企画一覧。検索がある地面。アイコンは角丸の正方形。" ground="alt">
      <PageLead subtitle={meta.subtitle} title={meta.title} />
      <label className="mb-6 block">
        <span className="mb-2 block text-sm font-medium">企画を検索</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="キーワード"
          className="lookbook-input"
        />
      </label>
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
          className="lookbook-chip"
        >
          すべて
        </button>
        {EVENT_CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={category === option.id}
            onClick={() => setCategory(option.id)}
            className="lookbook-chip"
          >
            {option.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="font-[family-name:var(--font-body)] text-[var(--ink-soft)]">
          検索条件に該当する企画が見つかりません。
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <li key={event.slug}>
              <a
                href="#face-detail"
                className="lookbook-card block text-[var(--ink)] no-underline"
              >
                <div className="lookbook-thumb mb-4">
                  <Image
                    src={CAMPUS_PHOTO}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <p className="lookbook-chip mb-3 inline-flex">{getEventCategoryLabel(event.category)}</p>
                <h2 className="lookbook-subhead text-xl">{event.title}</h2>
                <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[var(--ink-soft)]">
                  {event.organization}
                </p>
                <p className="mt-1 font-[family-name:var(--font-body)] text-sm text-[var(--ink-soft)]">
                  {formatLocation(event).firstLine}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </FaceFrame>
  );
}

export function EventDetailFace() {
  const event = SAMPLE_EVENTS[0];
  const locationDisplay = formatLocation(event);
  const timeDay1 = formatEventTimeRange(event['time-day1']);
  const timeDay2 = formatEventTimeRange(event['time-day2']);

  return (
    <FaceFrame id="face-detail" spec="DESIGN2 Gate C ・ 面3 企画詳細。写真、見出し、本文。アイコンは置かない。" ground="alt">
      <PageLead backHref="#face-list" title={event.title} />
      <p className="mb-8 font-[family-name:var(--font-body)] text-lg text-[var(--ink-soft)]">{event.organization}</p>
      <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <div className="lookbook-soft relative mb-8 aspect-[16/9] overflow-hidden">
            <Image
              src={CAMPUS_PHOTO}
              alt="企画の写真（見本）"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
          <p className="lookbook-subhead mb-10 text-lg font-medium">{event.catchphrase}</p>
          <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="lookbook-card p-4">
              <p className="text-xs text-[var(--ink-soft)]">場所</p>
              <p className="mt-2 text-sm font-medium">{locationDisplay.firstLine}</p>
              {locationDisplay.secondLine ? <p className="text-sm font-medium">{locationDisplay.secondLine}</p> : null}
            </div>
            <div className="lookbook-card p-4">
              <p className="text-xs text-[var(--ink-soft)]">時間</p>
              <p className="mt-2 text-sm font-medium">{timeDay1}</p>
              <p className="text-sm font-medium">{timeDay2}</p>
            </div>
            <div className="lookbook-card p-4">
              <p className="text-xs text-[var(--ink-soft)]">人数</p>
              <p className="mt-2 text-sm font-medium">{formatParticipants(event)}</p>
            </div>
            <div className="lookbook-card p-4">
              <p className="text-xs text-[var(--ink-soft)]">所要時間</p>
              <p className="mt-2 text-sm font-medium">{formatDuration(event.duration)}</p>
            </div>
          </div>
          <section>
            <h2 className="lookbook-subhead mb-6 text-2xl font-medium">企画について</h2>
            <p className="font-[family-name:var(--font-body)] leading-relaxed">{event.description}</p>
            <p className="mt-6 text-xs text-[var(--ink-soft)]">執筆者: {event.author}</p>
          </section>
        </div>
        <aside>
          <div className="lookbook-card p-8">
            <h2 className="lookbook-subhead mb-4 text-lg">企画団体</h2>
            <p className="lookbook-subhead mb-6 text-2xl font-medium">{event.organization}</p>
            <p className="font-[family-name:var(--font-body)] text-sm">{event.organDescription}</p>
          </div>
        </aside>
      </div>
    </FaceFrame>
  );
}

export function StampBookFace() {
  const required = STAMP_CONFIG.clearConditions.requiredStampCount;
  const [collected, setCollected] = useState<string[]>(['booth-1', 'booth-2', 'booth-4']);
  const total = SAMPLE_BOOTHS.length;
  const count = collected.length;
  const remaining = Math.max(required - count, 0);
  const cleared = count >= required;

  function toggle(slug: string) {
    setCollected((current) => (current.includes(slug) ? current.filter((id) => id !== slug) : [...current, slug]));
  }

  return (
    <FaceFrame id="face-stamp" spec="DESIGN2 Gate C ・ 面4 スタンプ帳。アイコンは角丸正方形。達成は緑にしない。" ground="alt">
      <PageLead subtitle="スタンプを集めてふくびきに参加" title="スタンプラリー" />
      <div className="lookbook-card mb-10 p-6">
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--ink-soft)]">
          {cleared
            ? '条件達成です。ふくびき参加券を表示できます'
            : `あと ${remaining} 個でふくびき券 GET！`}
        </p>
        <p className="lookbook-heading mt-3">
          {count}
          <span className="ml-1 text-2xl font-medium text-[var(--ink-soft)]"> / {total}</span>
        </p>
        <p className="mt-3 text-xs text-[var(--ink-soft)]">ふくびき条件 {required} 個</p>
        {cleared ? (
          <button type="button" className={`${TICKET_BTN} mt-6 w-full sm:w-auto`}>
            ふくびき参加券を表示する
          </button>
        ) : null}
      </div>
      <div className="space-y-10">
        {STAMP_CONFIG.categoryOrder.map((group) => (
          <div key={group.id}>
            <h2 className="lookbook-subhead mb-4 text-xl">{group.label}</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {SAMPLE_BOOTHS.filter((booth) => booth.category === group.id).map((booth) => {
                const on = collected.includes(booth.slug);
                return (
                  <li key={booth.slug}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(booth.slug)}
                      className="lookbook-card flex w-full items-center gap-4 p-4 text-left"
                    >
                      <span className={`lookbook-thumb lookbook-thumb-sm${on ? '' : ' lookbook-stamp-off'}`}>
                        <Image
                          src={CAMPUS_PHOTO}
                          alt=""
                          fill
                          className="object-cover object-center"
                          sizes="72px"
                        />
                      </span>
                      <span>
                        <span className="block font-[family-name:var(--font-ui)] font-medium">{booth.title}</span>
                        <span className="mt-1 block font-[family-name:var(--font-body)] text-sm text-[var(--ink-soft)]">
                          {booth.organization}
                        </span>
                        <span className="mt-1 block font-[family-name:var(--font-ui)] text-xs text-[var(--ink-soft)]">
                          {on ? '獲得済み' : '未獲得'}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="lookbook-error mt-10" role="alert">
        <span aria-hidden className="lookbook-error-mark" />
        <div>
          <p className="text-sm text-[var(--ink-soft)]">エラー</p>
          <p className="lookbook-subhead font-medium">読み込みに失敗したときの見本です</p>
          <p className="mt-1 text-sm">印だけ色を持つ。枠で囲まない。</p>
        </div>
      </div>
    </FaceFrame>
  );
}
