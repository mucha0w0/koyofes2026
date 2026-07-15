// @/components/sponsors-client.tsx
'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import type { SponsorItem } from '@/lib/types/sponsor';

interface SponsorsClientProps {
  sponsors: SponsorItem[];
}

function SponsorLogo({ sponsor }: { sponsor: SponsorItem }) {
  return (
    <Link
      className="flex flex-col items-center justify-center gap-2 h-20 px-8 shrink-0 cursor-pointer"
      href="/about/sponsor"
    >
      {sponsor.icon ? (
        <>
          <img alt={sponsor.name} className="max-h-14 max-w-[160px] object-contain" src={sponsor.icon} />
          <span className="text-xs text-muted-foreground whitespace-nowrap">{sponsor.name}</span>
        </>
      ) : (
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{sponsor.name}</span>
      )}
    </Link>
  );
}

export function SponsorsClient({ sponsors }: SponsorsClientProps) {
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
      const firstSet = track.querySelector('[data-sponsor-set="1"]') as HTMLElement;
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

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex will-change-transform" style={{ gap: '24px' }}>
        <div className="flex shrink-0" data-sponsor-set="1" style={{ gap: '24px' }}>
          {sponsors.map((sponsor) => (
            <SponsorLogo key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
        <div className="flex shrink-0" data-sponsor-set="2" style={{ gap: '24px' }}>
          {sponsors.map((sponsor) => (
            <SponsorLogo key={`dup-${sponsor.id}`} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </div>
  );
}
