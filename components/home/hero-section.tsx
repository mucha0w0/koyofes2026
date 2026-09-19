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
    </section>
  );
}
