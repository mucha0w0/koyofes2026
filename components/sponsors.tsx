"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SponsorItem } from "@/lib/types/sponsor";

interface SponsorsProps {
  sponsors: SponsorItem[];
}

function SponsorLogo({ sponsor }: { sponsor: SponsorItem }) {
  return (
    <Link
      href="/about/sponsor"
      className="flex flex-col items-center justify-center gap-2 h-20 px-8 shrink-0 cursor-pointer"
    >
      {sponsor.icon ? (
        <>
          <img
            src={sponsor.icon}
            alt={sponsor.name}
            className="max-h-14 max-w-[160px] object-contain"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {sponsor.name}
          </span>
        </>
      ) : (
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {sponsor.name}
        </span>
      )}
    </Link>
  );
}

export function Sponsors({ sponsors }: SponsorsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const isHoveredRef = useRef(false);
  const setWidthRef = useRef(0);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const GAP = 24;

    const measureSetWidth = () => {
      const firstSet = track.querySelector(
        '[data-sponsor-set="1"]',
      ) as HTMLElement;
      if (firstSet) {
        setWidthRef.current = firstSet.offsetWidth + GAP;
      }
    };

    measureSetWidth();

    const SPEED = 0.3;

    const animate = () => {
      if (!isHoveredRef.current && setWidthRef.current > 0) {
        positionRef.current += SPEED;

        if (positionRef.current >= setWidthRef.current) {
          positionRef.current -= setWidthRef.current;
        }

        track.style.transform = `translateX(${-positionRef.current}px)`;
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    const handleResize = () => {
      measureSetWidth();
      if (positionRef.current >= setWidthRef.current) {
        positionRef.current = 0;
      }
    };

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-medium mb-2">ご協賛</h2>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: "24px" }}
        >
          <div
            data-sponsor-set="1"
            className="flex shrink-0"
            style={{ gap: "24px" }}
          >
            {sponsors.map((sponsor) => (
              <SponsorLogo key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
          <div
            data-sponsor-set="2"
            className="flex shrink-0"
            style={{ gap: "24px" }}
          >
            {sponsors.map((sponsor) => (
              <SponsorLogo key={`dup-${sponsor.id}`} sponsor={sponsor} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/about/sponsor"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          すべて見る
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
