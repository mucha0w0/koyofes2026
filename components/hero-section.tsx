'use client';

import Image from 'next/image';
import { Calendar, MapPin, Clock } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <Image
        src="/20251106soumukikaku2-1024x768.jpg"
        alt="background"
        fill
        className="object-cover"
        style={{ zIndex: 0 }}
        priority
      />
      <div className="container mx-auto px-4 w-full" style={{ position: 'relative', zIndex: 1 }}>
        <div className="text-center space-y-12">
          {/* Main Title */}
          <div className="space-y-6">
            <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.15em]">
              令和8年度 豊田高専文化祭
            </p>
            <h1 className="hero-display text-5xl md:text-6xl lg:text-7xl font-normal">1dearland</h1>
            <h2 className="text-2xl md:text-4xl font-normal text-foreground">こうよう祭 2026</h2>
          </div>

          {/* Event Info */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-foreground" />
              <span>2026年10月31日(土)・11月1日(日)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-foreground" />
              <span>9:00 〜 16:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-foreground" />
              <span>豊田高専</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
