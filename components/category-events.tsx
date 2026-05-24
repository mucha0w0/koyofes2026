"use client";

import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Users, Mic2, Palette } from "lucide-react";
import eventsData from "@/lib/events.json";
import { Event } from "@/lib/types/event";
import { getLucideIcon } from "@/lib/lucide-icons";

type EventCategory =
  | "exhibition"
  | "booth"
  | "stage"
  | "performance"
  | "workshop";

const categoryConfig: Record<
  EventCategory,
  { title: string; Icon: React.ElementType }
> = {
  exhibition: {
    title: "展示企画",
    Icon: Building2,
  },
  booth: {
    title: "模擬店",
    Icon: Users,
  },
  stage: {
    title: "ステージ",
    Icon: Mic2,
  },
  performance: {
    title: "パフォーマンス",
    Icon: Palette,
  },
  workshop: {
    title: "ワークショップ",
    Icon: Building2,
  },
};

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const IconComponent = getLucideIcon(event.icon);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex flex-col items-center gap-2 shrink-0 group"
    >
      <div className="w-20 h-20 md:w-32 md:h-32 bg-muted overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center">
        {IconComponent ? (
          <IconComponent className="h-10 w-10 md:h-16 md:w-16 text-foreground" />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>
      <div className="text-center max-w-24 md:max-w-32">
        <p className="text-xs md:text-sm font-medium truncate">{event.title}</p>
        <p className="text-xs md:text-sm text-muted-foreground truncate">
          {event.organization}
        </p>
      </div>
    </Link>
  );
}

interface ScrollingEventsProps {
  events: Event[];
}

function ScrollingEvents({ events }: ScrollingEventsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const scrollStartRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || events.length === 0) return;

    let animationId: number;
    const speed = 0.3; // ゆっくりスクロール（遅くしました）

    const animate = () => {
      if (!isHoveredRef.current && !isTouchingRef.current) {
        scrollPositionRef.current += speed;

        const firstSet = scrollContainer.querySelector(
          '[data-event-set="1"]',
        ) as HTMLElement;
        if (firstSet) {
          const setWidth = firstSet.offsetWidth;
          const setGap = 16; // gap-4 = 1rem = 16px
          const totalSetWidth = setWidth + setGap;

          // セット幅 + ギャップで無限ループ
          if (scrollPositionRef.current >= totalSetWidth) {
            scrollPositionRef.current -= totalSetWidth;
          }
        }

        scrollContainer.scrollLeft = scrollPositionRef.current;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // マウスイベント
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    // ウィンドウリサイズ時にスクロール位置をリセット（PC/モバイル切り替え対応）
    const handleResize = () => {
      scrollPositionRef.current = 0;
      scrollContainer.scrollLeft = 0;
    };

    // タッチイベント
    const handleTouchStart = (e: TouchEvent) => {
      isTouchingRef.current = true;
      touchStartXRef.current = e.touches[0].clientX;
      scrollStartRef.current = scrollContainer.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchingRef.current) return;
      const diff = e.touches[0].clientX - touchStartXRef.current;
      scrollContainer.scrollLeft = scrollStartRef.current - diff;
      scrollPositionRef.current = scrollContainer.scrollLeft;
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("touchstart", handleTouchStart);
    scrollContainer.addEventListener("touchmove", handleTouchMove);
    scrollContainer.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("touchstart", handleTouchStart);
      scrollContainer.removeEventListener("touchmove", handleTouchMove);
      scrollContainer.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        企画は準備中です
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto py-2 scroll-smooth scrollbar-hide"
      style={{ scrollBehavior: "auto", WebkitOverflowScrolling: "touch" }}
    >
      {/* Set 1 - オリジナル */}
      <div data-event-set="1" className="flex gap-4 shrink-0">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Set 2-6 - 繰り返し（無限スクロール化） */}
      {[2, 3, 4, 5, 6].map((setNum) => (
        <div key={`set-${setNum}`} className="flex gap-4 shrink-0">
          {events.map((event) => (
            <EventCard key={`dup-${setNum}-${event.id}`} event={event} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CategoryEvents() {
  const categories = useMemo(() => {
    const events = (eventsData.events as Event[]) || [];
    const uniqueCategories = [
      ...new Set(events.map((e) => e.category)),
    ] as EventCategory[];

    console.log("uniqueCategories:", uniqueCategories); // ← 追加
    console.log("categoryConfig keys:", Object.keys(categoryConfig)); // ← 追加

    return uniqueCategories
      .map((cat) => ({
        id: cat,
        title: categoryConfig[cat].title,
        Icon: categoryConfig[cat].Icon,
        events: events.filter((e) => e.category === cat),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium mb-2">
            カテゴリ別企画一覧
          </h2>
          <p className="text-muted-foreground">様々な企画から選んでチェック</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-card">
              {/* Category Header */}
              <div className="flex items-center gap-3 p-4 bg-muted">
                <div className="p-2 bg-background text-foreground">
                  <category.Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium">{category.title}</h3>
                <Link
                  href="/events/list"
                  className="ml-auto text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  すべて見る
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Scrolling Events */}
              <div className="px-4 pb-4">
                <ScrollingEvents events={category.events} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
