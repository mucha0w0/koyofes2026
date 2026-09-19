'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface EventCarouselProps {
  images: string[];
  title: string;
}

export function EventCarousel({ images, title }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-video w-full bg-paper-2">
        <p className="flex size-full items-center justify-center text-muted-foreground">画像はありません</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="relative aspect-video w-full bg-paper-2 overflow-hidden group">
      {/* Main Image */}
      {currentImage && (
        <Image fill priority alt={`${title} image ${currentIndex + 1}`} className="object-cover" src={currentImage} />
      )}

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-ink/50 hover:bg-ink/70 text-festival-accent-soft p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 z-20"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-ink/50 hover:bg-ink/70 text-festival-accent-soft p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 z-20"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-2 h-2 rounded-[4px] transition-all ${
                  idx === currentIndex ? 'bg-festival-accent-soft w-6' : 'bg-festival-accent-soft/50 hover:bg-festival-accent-soft/70'
                }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
