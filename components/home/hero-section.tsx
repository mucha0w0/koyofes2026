import Image from 'next/image';

export function HeroSection() {
  return (
    <section>
      <div className="relative aspect-[1178/295] w-full overflow-hidden">
        <Image
          fill
          priority
          alt="こうよう祭 2026 テーマ 1dearland のコンセプトアート"
          className="object-contain object-center"
          sizes="100vw"
          src="/conceptart.jpg"
        />
      </div>
    </section>
  );
}
