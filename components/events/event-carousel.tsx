'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';

import { microCmsImageSrc } from '@/lib/utils';

interface EventCarouselProps {
  images: string[];
  title: string;
}

/** 16:9 を上限に、広い画面では高さを 50vh で打ち切って縦方向にクロップする */
const frameClassName =
  'relative h-[min(50vh,56.25vw)] w-full overflow-hidden border-b-[length:calc(var(--shell-stroke)+var(--shell-oy))] border-ink bg-paper-2';

/** 精密ポインタ（マウス）ではホバーまで隠し、タッチ端末では常に表示する */
const navButtonClassName =
  'absolute top-1/2 z-20 -translate-y-1/2 rounded-md bg-ink/50 p-2 text-festival-accent-soft transition-all hover:bg-ink/70 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100';

/** 拡大表示では、ホバーできない端末でも切り替えられるよう常に出す */
const viewerNavButtonClassName =
  'absolute top-1/2 z-20 -translate-y-1/2 rounded-md bg-ink/50 p-2 text-festival-accent-soft transition-colors hover:bg-ink/70';

export function EventCarousel({ images, title }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className={frameClassName}>
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
  const cmsSrc = currentImage ? microCmsImageSrc(currentImage, 1920) : null;
  const src = currentImage ? (cmsSrc ?? currentImage) : null;

  return (
    <div className={`${frameClassName} group`}>
      {/* 同じ img の src を差し替えると、次の画像が届くまで前の絵が残る。枚を切り替えるたびに要素を作り直し、未読み込みの間は白地を見せる。 */}
      <div aria-hidden className="absolute inset-0 bg-white" />
      {src && (
        <button
          aria-label={`${title}の画像を拡大`}
          className="absolute inset-0 z-10 cursor-zoom-in outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
          type="button"
          onClick={() => setViewerOpen(true)}
        >
          <Image
            key={`${currentIndex}:${src}`}
            fill
            priority
            alt=""
            className="object-cover object-center"
            sizes="100vw"
            src={src}
            unoptimized={cmsSrc !== null}
          />
        </button>
      )}

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button aria-label="Previous image" className={`${navButtonClassName} left-4`} onClick={goToPrevious}>
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button aria-label="Next image" className={`${navButtonClassName} right-4`} onClick={goToNext}>
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-2 h-2 rounded-[4px] transition-all ${
                  idx === currentIndex
                    ? 'bg-festival-accent-soft w-6'
                    : 'bg-festival-accent-soft/50 hover:bg-festival-accent-soft/70'
                }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-ink/80" />
          <DialogPrimitive.Content
            className="fixed top-1/2 left-1/2 z-50 w-max max-w-[96vw] -translate-x-1/2 -translate-y-1/2 outline-none"
            onKeyDown={(event) => {
              if (images.length < 2) return;
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goToPrevious();
              } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                goToNext();
              }
            }}
          >
            <DialogTitle className="sr-only">{`${title}の画像`}</DialogTitle>
            <DialogDescription className="sr-only">切り抜かず、画像の全体を表示しています。</DialogDescription>
            {src && (
              <Image
                key={`${currentIndex}:${src}`}
                alt={`${title} image ${currentIndex + 1}`}
                className="h-auto max-h-[92dvh] w-auto max-w-[96vw] bg-white object-contain"
                height={1080}
                sizes="96vw"
                src={src}
                style={{ width: 'auto', height: 'auto' }}
                unoptimized={cmsSrc !== null}
                width={1920}
              />
            )}
            <DialogClose className="absolute top-3 right-3 z-20 flex size-11 items-center justify-center rounded-md bg-ink/50 text-festival-accent-soft transition-colors hover:bg-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-festival-accent-soft">
              <XIcon className="size-5" />
              <span className="sr-only">閉じる</span>
            </DialogClose>
            {images.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  className={`${viewerNavButtonClassName} left-3`}
                  type="button"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  aria-label="Next image"
                  className={`${viewerNavButtonClassName} right-3`}
                  type="button"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`h-2 rounded-[4px] transition-all ${
                        idx === currentIndex
                          ? 'w-6 bg-festival-accent-soft'
                          : 'w-2 bg-festival-accent-soft/50 hover:bg-festival-accent-soft/70'
                      }`}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
