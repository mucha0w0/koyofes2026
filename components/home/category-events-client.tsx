'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { CategorySection } from '@/components/events/category-section';

import { getEventCategoryIcon } from '@/lib/config/event-categories';
import { Event } from '@/lib/types/event';
import { isImageUrl } from '@/lib/utils';

type EventCategory = Event['category'];

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const isIconUrl = isImageUrl(event.icon);

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
  const SPEED = 20; // px/ç§

  useEffect(() => {
    const track = trackRef.current;
    if (!track || events.length === 0) return;

    const getSingleSetWidth = (): number => {
      const firstSet = track.querySelector<HTMLElement>('[data-event-set="1"]');
      if (!firstSet) return 0;
      // getBoundingClientRect ă§gapčžźăżăŽĺŽĺšăĺĺž
      const allSets = track.querySelectorAll<HTMLElement>('[data-event-set]');
      const set0 = allSets[0];
      const set1 = allSets[1];
      if (!set0 || !set1) return firstSet.getBoundingClientRect().width;
      return set1.getBoundingClientRect().left - set0.getBoundingClientRect().left;
    };

    const animate = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000; // ç§
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

      // scrollLeft ă§ăŻăŞă transform ă§ç§ťĺďźăăźă¸ăšăŻă­ăźăŤă¨çŤśĺăăŞăďź
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
    return <div className="flex items-center justify-center py-8 text-muted-foreground">äźçťăŻćşĺä¸­ă§ă</div>;
  }

  return (
    // overflow-hidden ă§ăăŠăăŻăŽăŻăżĺşăăé ă
    <div className="overflow-hidden py-2">
      {/* ăăŠăăŻďźtransform ă§ĺăăăĺšăŻăłăłăăłăĺĺżčŚăŞăŽă§ width-max */}
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
          <h2 className="text-2xl md:text-3xl font-medium mb-2">ăŤăă´ăŞĺĽäźçťä¸čŚ§</h2>
          <p className="text-muted-foreground">ć§ăăŞäźçťăăé¸ăă§ăă§ăăŻ</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              action={
                <Link
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  href="/events/list"
                >
                  ăăšăŚčŚă
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
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
