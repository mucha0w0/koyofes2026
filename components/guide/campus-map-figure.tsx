import Image, { type StaticImageData } from 'next/image';

import { CAMPUS_MAP_CAPTION } from '@/lib/config/venue-map';

type CampusMapFigureProps = {
  alt: string;
  src: StaticImageData;
};

export function CampusMapFigure({ alt, src }: CampusMapFigureProps) {
  return (
    <figure className="ink-shell overflow-visible bg-card">
      <div className="overflow-x-auto rounded-[calc(var(--radius)-var(--shell-stroke))] bg-white md:overflow-hidden">
        <div className="min-w-160 md:min-w-full">
          <Image
            priority
            alt={alt}
            className="h-auto w-full"
            sizes="(min-width: 1280px) 1248px, calc(100vw - 32px)"
            src={src}
          />
        </div>
      </div>
      <figcaption className="px-6 py-4 text-sm text-muted-foreground">{CAMPUS_MAP_CAPTION}</figcaption>
    </figure>
  );
}
