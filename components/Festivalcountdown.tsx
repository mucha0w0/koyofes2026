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
const fontDisplay = { fontFamily: 'var(--font-display)' } as const;
const fontJp = { fontFamily: 'var(--font-jp)' } as const;

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
  return <div aria-hidden className="hidden md:block h-8 w-px bg-white/20" />;
}

function ErrorMessage() {
  return (
    <p className="text-[14px] text-red-400 font-normal leading-none" style={fontJp}>
      設定された日付が正しくありません (Invalid Date)
    </p>
  );
}

function EventMeta() {
  return (
    <div className="flex flex-col items-center gap-1" style={fontDisplay}>
      <span className="text-[11px] tracking-[0.15em] uppercase">{CONFIG.name}</span>
      <span className="text-[11px] tracking-[0.15em]">{DATE_LABEL} まで残り</span>
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
    <div className="flex items-baseline gap-2 md:gap-4" style={fontDisplay}>
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-baseline gap-1">
          <span className="w-[44px] md:w-[56px] text-center text-[28px] md:text-[40px] font-normal leading-none tracking-wider lining-nums">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-[11px] tracking-wider uppercase text-white/70">{unit.label}</span>
          {index < units.length - 1 && (
            <span
              aria-hidden="true"
              className="text-[16px] md:text-[20px] font-light text-white/30 ml-1 md:ml-2 select-none"
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
  return (
    <p className="text-[28px] font-normal leading-none tracking-[0.15em]" style={fontJp}>
      こうよう祭、ただいま開催中！
    </p>
  );
}

function ClosingMessage() {
  return (
    <p className="text-[28px] font-normal leading-none tracking-[0.15em]" style={fontJp}>
      2026年度こうよう祭は終了しました
    </p>
  );
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
    <div className="w-full bg-[#1f2529] text-white">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-4 py-5 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]">
        {renderContent()}
      </div>
    </div>
  );
}
