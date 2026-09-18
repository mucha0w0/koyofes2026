'use client';

import { useEffect, useMemo, useState } from 'react';

// ── 設定 ───────────────────────────────────────────────
const CONFIG = {
  date: { year: 2026, month: 10, day: 31, hour: 9, minute: 0, second: 0 },
  enddate: { year: 2026, month: 11, day: 1, hour: 17, minute: 0, second: 0 },
  name: 'こうよう祭開催',
} as const;

// ── 型定義 ─────────────────────────────────────────────
interface DateConfig {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownStatus {
  timeLeft: TimeLeft;
  isStarted: boolean;
  isEnded: boolean;
  isValid: boolean;
}

// ── ヘルパー関数 ────────────────────────────────────────
const toDate = (cfg: DateConfig): Date => new Date(cfg.year, cfg.month - 1, cfg.day, cfg.hour, cfg.minute, cfg.second);

const msToTimeLeft = (ms: number): TimeLeft => {
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds / 3_600) % 24),
    minutes: Math.floor((totalSeconds / 60) % 60),
    seconds: totalSeconds % 60,
  };
};

// CONFIG から派生する定数（モジュールスコープで一度だけ計算）
const START_TIME = toDate(CONFIG.date).getTime();
const END_TIME = toDate(CONFIG.enddate).getTime();
const IS_CONFIG_VALID = !isNaN(START_TIME) && !isNaN(END_TIME);

const DATE_LABEL = IS_CONFIG_VALID
  ? toDate(CONFIG.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  : '';

// ── フォント変数 ────────────────────────────────────────
// ── フック ──────────────────────────────────────────────
const ZERO_TIME_LEFT: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function useCountdown(): CountdownStatus {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME_LEFT);
  const [phase, setPhase] = useState<'before' | 'during' | 'ended'>('before');

  useEffect(() => {
    if (!IS_CONFIG_VALID) return;

    const calc = () => {
      const now = Date.now();

      if (now >= END_TIME) {
        setPhase('ended');
        setTimeLeft(ZERO_TIME_LEFT);
        return;
      }

      if (now >= START_TIME) {
        setPhase('during');
        setTimeLeft(ZERO_TIME_LEFT);
        return;
      }

      setPhase('before');
      setTimeLeft(msToTimeLeft(START_TIME - now));
    };

    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, []);

  return useMemo(
    () => ({
      timeLeft,
      isStarted: phase !== 'before',
      isEnded: phase === 'ended',
      isValid: IS_CONFIG_VALID,
    }),
    [timeLeft, phase],
  );
}

// ── サブコンポーネント ───────────────────────────────────
function Divider() {
  return <div aria-hidden className="hidden md:block h-8 w-px bg-festival-accent-soft/30" />;
}

function ErrorMessage() {
  return <p className="text-[14px] font-normal leading-none">設定された日付が正しくありません (Invalid Date)</p>;
}

function EventMeta() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-[11px]">{CONFIG.name}</span>
      <span className="text-[11px]">{DATE_LABEL} まで残り</span>
    </div>
  );
}

function TimeCounter({ timeLeft }: { timeLeft: TimeLeft }) {
  const units = [
    { label: 'days', value: timeLeft.days },
    { label: 'hours', value: timeLeft.hours },
    { label: 'mins', value: timeLeft.minutes },
    { label: 'secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-baseline gap-2 md:gap-4">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-baseline gap-1">
          <span className="font-display w-11 md:w-14 text-center text-[28px] md:text-[40px] font-medium leading-none lining-nums tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-[11px] text-festival-accent-soft/80">{unit.label}</span>
          {index < units.length - 1 && (
            <span
              aria-hidden="true"
              className="text-[16px] md:text-[20px] font-light text-festival-accent-soft/40 ml-1 md:ml-2 select-none"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function OpeningMessage() {
  return <p className="font-display text-[28px] font-medium leading-none">こうよう祭、ただいま開催中！</p>;
}

function ClosingMessage() {
  return <p className="font-display text-[28px] font-medium leading-none">2026年度こうよう祭は終了しました</p>;
}

// ── メインコンポーネント ────────────────────────────────
export function FestivalCountdown() {
  const { timeLeft, isStarted, isEnded, isValid } = useCountdown();

  const renderContent = () => {
    if (!isValid) return <ErrorMessage />;
    if (isEnded) return <ClosingMessage />;
    if (isStarted) return <OpeningMessage />;
    return (
      <>
        <EventMeta />
        <Divider />
        <TimeCounter timeLeft={timeLeft} />
      </>
    );
  };

  return (
    <div className="w-full bg-festival-accent text-festival-accent-soft">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-4 px-4 py-5 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {renderContent()}
      </div>
    </div>
  );
}
