"use client";

import { useEffect, useState } from "react";

// ── 設定 ───────────────────────────────────────────────
const CONFIG = {
    date: { year: 2026, month: 10, day: 31, hour: 9, minute: 0, second: 0 },
    enddate: { year: 2026, month: 11, day: 1, hour: 17, minute: 0, second: 0 },
    name: "こうよう祭開催",
  } as const;
  
  // ── ヘルパー関数 ────────────────────────────────────────
  interface DateConfig {
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
  }
  
  const convertToDate = (cfg: DateConfig) => {
    return new Date(cfg.year, cfg.month - 1, cfg.day, cfg.hour, cfg.minute, cfg.second);
  };

// ── フォント変数 ────────────────────────────────────────
const fontDisplay = { fontFamily: "var(--font-display)" } as const;
const fontJp = { fontFamily: "var(--font-jp)" } as const;

// ── フック ──────────────────────────────────────────────
function useCountdown() {
  const [status, setStatus] = useState<{
    timeLeft: { days: number; hours: number; minutes: number; seconds: number };
    isStarted: boolean;
    isEnded: boolean;
    isValid: boolean;
  }>({
    timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    isStarted: false,
    isEnded: false,
    isValid: true,
  });

  useEffect(() => {
    // ここで内部的に「月 - 1」を実行して Date オブジェクトに変換します
    const parsedDate = convertToDate(CONFIG.date);
    const parsedEndDate = convertToDate(CONFIG.enddate);

    const timeStart = parsedDate.getTime();
    const timeEnd = parsedEndDate.getTime();
    
    if (isNaN(timeStart) || isNaN(timeEnd)) {
      setStatus(prev => ({ ...prev, isValid: false }));
      return;
    }

    const calc = () => {
      const now = Date.now();
      const diffToStart = timeStart - now;
      const diffToEnd = timeEnd - now;

      // すべて終了しているか
      if (diffToEnd <= 0) {
        setStatus({
          timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
          isStarted: true,
          isEnded: true,
          isValid: true,
        });
        return;
      }

      // 開催中（開始時間を過ぎているか）
      if (diffToStart <= 0) {
        setStatus({
          timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
          isStarted: true,
          isEnded: false,
          isValid: true,
        });
        return;
      }

      // カウントダウン中
      const totalSeconds = Math.floor(diffToStart / 1000);
      setStatus({
        timeLeft: {
          days: Math.floor(totalSeconds / 86_400),
          hours: Math.floor((totalSeconds / 3_600) % 24),
          minutes: Math.floor((totalSeconds / 60) % 60),
          seconds: totalSeconds % 60,
        },
        isStarted: false,
        isEnded: false,
        isValid: true,
      });
    };

    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, []);

  return status;
}

// ── サブコンポーネント ───────────────────────────────────
function Divider() {
    return (
      <div
        className="hidden md:block h-8 w-px bg-white/20"
        aria-hidden
      />
    );
  }

function ErrorMessage() {
  return (
    <p className="text-[14px] text-red-400 font-normal leading-none" style={fontJp}>
      設定された日付が正しくありません (Invalid Date)
    </p>
  );
}

function EventMeta() {
  const parsedDate = convertToDate(CONFIG.date);
  
  const dateLabel = isNaN(parsedDate.getTime()) 
    ? "" 
    : parsedDate.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="flex flex-col items-center gap-1" style={fontDisplay}>
      <span className="text-[11px] tracking-[0.15em] uppercase">
        {CONFIG.name}
      </span>
      <span className="text-[11px] tracking-[0.15em]">
        {dateLabel} まで残り⋯
      </span>
    </div>
  );
}

function TimeCounter({
  timeLeft,
}: {
  timeLeft: ReturnType<typeof useCountdown>["timeLeft"];
}) {
  const units = [
    { label: "days", value: timeLeft.days },
    { label: "hours", value: timeLeft.hours },
    { label: "mins", value: timeLeft.minutes },
    { label: "secs", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-baseline gap-4" style={fontDisplay}>
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-baseline gap-1.5">
          <span className="w-[56px] text-center text-[40px] font-normal leading-none tracking-wider lining-nums">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[11px] tracking-wider uppercase text-white/70">
            {unit.label}
          </span>
          {index < units.length - 1 && (
            <span
              className="text-[20px] font-light text-white/30 ml-2 select-none"
              aria-hidden="true"
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
    <p
      className="text-[28px] font-normal leading-none tracking-[0.15em]"
      style={fontJp}
    >
      こうよう祭、ただいま開催中！
    </p>
  );
}

function ClosingMessage() {
  return (
    <p
      className="text-[28px] font-normal leading-none tracking-[0.15em]"
      style={fontJp}
    >
      2026年度こうよう祭は終了しました
    </p>
  );
}

// ── メインコンポーネント ────────────────────────────────
export function FestivalCountdown() {
  const { timeLeft, isStarted, isEnded, isValid } = useCountdown();

  const renderContent = () => {
    if (!isValid) {
      return <ErrorMessage />;
    }
    if (isEnded) {
      return <ClosingMessage />;
    }
    if (isStarted) {
      return <OpeningMessage />;
    }
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
      <div className="mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-4 px-6 py-5">
        {renderContent()}
      </div>
    </div>
  );
}