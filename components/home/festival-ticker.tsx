import { Fragment } from 'react';

const TICKER_PHRASES = ['こうよう祭', 'KoYoFes', '1dearland'] as const;
const TICKER_REPEAT = 8;

function TickerDot() {
  return <span aria-hidden className="size-0.75 shrink-0 rounded-full bg-white" />;
}

function TickerItems({ phrases, trailingDot }: { phrases: readonly string[]; trailingDot: boolean }) {
  return phrases.map((phrase, index) => (
    <Fragment key={`${phrase}-${index}`}>
      <span className="font-display whitespace-nowrap text-sm font-medium leading-none">{phrase}</span>
      {(trailingDot || index < phrases.length - 1) && <TickerDot />}
    </Fragment>
  ));
}

function TickerCopy() {
  const phrases = Array.from({ length: TICKER_REPEAT }, () => TICKER_PHRASES).flat();

  return (
    <div className="festival-ticker-copy flex shrink-0 items-center gap-16 pr-16">
      <TickerItems trailingDot phrases={phrases} />
    </div>
  );
}

export function FestivalTicker() {
  return (
    <div aria-hidden="true" className="w-full overflow-hidden bg-charcoal py-3 text-white">
      <p className="festival-ticker-static mx-auto hidden w-full max-w-7xl items-center justify-center gap-16 px-4">
        <TickerItems phrases={TICKER_PHRASES} trailingDot={false} />
      </p>
      <div className="festival-ticker-track flex w-max will-change-transform">
        <TickerCopy />
        <TickerCopy />
      </div>
    </div>
  );
}
