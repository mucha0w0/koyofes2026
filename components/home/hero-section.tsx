import { Calendar, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <Image
        fill
        priority
        alt="会場の写真"
        className="object-cover"
        src="/20251106soumukikaku2-1024x768.jpg"
        style={{ zIndex: 0 }}
      />
      <div className="mx-auto w-full max-w-7xl px-4" style={{ position: 'relative', zIndex: 1 }}>
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-white">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>2026年10月31日(土)・11月1日(日)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>9:00 〜 16:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>豊田高専</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
