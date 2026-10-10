import type { ReactNode } from 'react';

/** 獲得状況。ページと同じ紙色の帯 */
export function StampStatusSection({ children }: { children: ReactNode }) {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-12 md:pt-12 md:pb-16">
        <div className="mx-auto max-w-3xl space-y-8">{children}</div>
      </div>
    </section>
  );
}
