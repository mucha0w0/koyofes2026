'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { CategorySection } from '@/components/events/category-section';
import { InkPhoto } from '@/components/ui/ink-photo';
import { InkTextLink } from '@/components/ui/ink-text-link';

import { getEventCategoryIcon } from '@/lib/config/event-categories';
import { Event } from '@/lib/types/event';

type EventCategory = Event['category'];

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  return (
    <Link className="group flex shrink-0 flex-col items-center gap-2" href={`/events/${event.slug}`} prefetch={false}>
      <InkPhoto alt={event.title} className="ink-lift size-20 md:size-32" size={128} src={event.icon} />
      <div className="max-w-24 text-center md:max-w-32">
        <p className="truncate text-xs font-medium md:text-sm">{event.title}</p>
        <p className="truncate text-xs text-muted-foreground md:text-sm">{event.organization}</p>
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
      const set0 = allSets[0];
      const set1 = allSets[1];
      if (!set0 || !set1) return firstSet.getBoundingClientRect().width;
      return set1.getBoundingClientRect().left - set0.getBoundingClientRect().left;
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
      const touch = e.touches[0];
      if (!touch) return;
      isTouchingRef.current = true;
      touchStartXRef.current = touch.clientX;
      touchOffsetRef.current = offsetRef.current;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchingRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      const diff = touchStartXRef.current - touch.clientX;
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
    <div className="overflow-hidden px-1 py-3">
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
    <section className="bg-background py-16 md:py-24" data-palette="orange">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-medium md:text-3xl">カテゴリ別企画一覧</h2>
          <p className="text-muted-foreground">様々な企画から選んでチェック</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              action={<InkTextLink href="/events/list">すべて見る</InkTextLink>}
              icon={getEventCategoryIcon(category.id)}
              title={category.title}
              titleAs="h3"
            >
              <div className="px-4 pb-4">
                <ScrollingEvents events={category.events} />
              </div>
            </CategorySection>
          ))}
        </div>
      </div>
    </section>
  );
}
