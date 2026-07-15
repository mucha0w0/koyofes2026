'use client';

import { ArrowRight, Building2, Users, Mic2, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { Event } from '@/lib/types/event';

type EventCategory = 'class-exhibit' | 'volunteer-exhibit' | 'booth' | 'stage' | 'food-truck';

const categoryIconConfig: Record<EventCategory, React.ElementType> = {
  'class-exhibit': Building2,
  'volunteer-exhibit': Users,
  booth: ShoppingBag,
  stage: Mic2,
  'food-truck': Truck,
};

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const isIconUrl = event.icon && (event.icon.startsWith('http://') || event.icon.startsWith('https://'));

  return (
    <Link className="flex flex-col items-center gap-2 shrink-0 group" href={`/events/${event.slug}`}>
      <div className="w-20 h-20 md:w-32 md:h-32 bg-muted overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center">
        {isIconUrl ? (
          <Image alt={event.title} className="w-full h-full object-cover" height={128} src={event.icon} width={128} />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>
      <div className="text-center max-w-24 md:max-w-32">
        <p className="text-xs md:text-sm font-medium truncate">{event.title}</p>
        <p className="text-xs md:text-sm text-muted-foreground truncate">{event.organization}</p>
      </div>
    </Link>
  );
}

interface ScrollingEventsProps {
  events: Event[];
}

function ScrollingEvents({ events }: ScrollingEventsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animationIdRef = useRef<number>(0);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchOffsetRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const SPEED = 20; // px/秒

  useEffect(() => {
    const track = trackRef.current;
    if (!track || events.length === 0) return;

    const getSingleSetWidth = (): number => {
      const firstSet = track.querySelector<HTMLElement>('[data-event-set="1"]');
      if (!firstSet) return 0;
      // getBoundingClientRect でgap込みの実幅を取得
      const allSets = track.querySelectorAll<HTMLElement>('[data-event-set]');
      if (allSets.length < 2) return firstSet.getBoundingClientRect().width;
      const rect1 = allSets[0].getBoundingClientRect();
      const rect2 = allSets[1].getBoundingClientRect();
      return rect2.left - rect1.left;
    };

    const animate = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000; // 秒
      lastTimeRef.current = time;

      if (!isHoveredRef.current && !isTouchingRef.current) {
        const setWidth = getSingleSetWidth();
        if (setWidth > 0) {
          offsetRef.current += SPEED * delta;
          if (offsetRef.current >= setWidth) {
            offsetRef.current -= setWidth;
          }
        }
      }

      // scrollLeft ではなく transform で移動（ページスクロールと競合しない）
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouchingRef.current = true;
      touchStartXRef.current = e.touches[0].clientX;
      touchOffsetRef.current = offsetRef.current;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchingRef.current) return;
      const diff = touchStartXRef.current - e.touches[0].clientX;
      const setWidth = getSingleSetWidth();
      if (setWidth > 0) {
        offsetRef.current = (((touchOffsetRef.current + diff) % setWidth) + setWidth) % setWidth;
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
    };
    const handleTouchEnd = () => {
      isTouchingRef.current = false;
    };

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: true });
    track.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
      track.removeEventListener('touchstart', handleTouchStart);
      track.removeEventListener('touchmove', handleTouchMove);
      track.removeEventListener('touchend', handleTouchEnd);
    };
  }, [events.length]);

  if (events.length === 0) {
    return <div className="flex items-center justify-center py-8 text-muted-foreground">企画は準備中です</div>;
  }

  return (
    // overflow-hidden でトラックのはみ出しを隠す
    <div className="overflow-hidden py-2">
      {/* トラック：transform で動かす。幅はコンテンツ分必要なので width-max */}
      <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
        {[1, 2, 3].map((setNum) => (
          <div key={`set-${setNum}`} className="flex gap-4 shrink-0" data-event-set={setNum}>
            {events.map((event) => (
              <EventCard key={`set${setNum}-${event.slug}`} event={event} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Category {
  id: EventCategory;
  title: string;
  events: Event[];
}

interface CategoryEventsContentProps {
  categories: Category[];
}

export function CategoryEventsContent({ categories }: CategoryEventsContentProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium mb-2">カテゴリ別企画一覧</h2>
          <p className="text-muted-foreground">様々な企画から選んでチェック</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const IconComponent = categoryIconConfig[category.id];
            return (
              <div key={category.id} className="bg-card">
                <div className="flex items-center gap-3 p-4 bg-muted">
                  <div className="p-2 bg-background text-foreground">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium">{category.title}</h3>
                  <Link
                    className="ml-auto text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    href="/events/list"
                  >
                    すべて見る
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="px-4 pb-4">
                  <ScrollingEvents events={category.events} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
