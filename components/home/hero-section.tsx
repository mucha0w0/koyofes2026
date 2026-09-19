import Image from 'next/image';

export function HeroSection() {
  return (
    <section>
      <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
        <Image
          fill
          priority
          alt="会場の写真"
          className="object-cover object-center"
          src="/20251106soumukikaku2-1024x768.jpg"
        />
      </div>
      <div className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 text-center text-sm md:text-base">
          2026年10月31日(土)・11月1日(日)
          <span className="mx-2 text-ink-soft">/</span>
          9:00 〜 16:00
          <span className="mx-2 text-ink-soft">/</span>
          豊田高専
        </div>
      </div>
    </section>
  );
}
