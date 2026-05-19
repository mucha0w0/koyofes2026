'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EventImage {
  url: string
  alt: string
  caption?: string
}

interface EventCarouselProps {
  images: EventImage[]
  title: string
}

export function EventCarousel({ images, title }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // 自動スライドショー
  useEffect(() => {
    if (!isAutoPlay || images.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // 5秒ごとに切り替え

    return () => clearInterval(timer)
  }, [isAutoPlay, images.length])

  if (images.length === 0) {
    return (
      <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-muted-foreground/30 mb-4">📷</div>
          <p className="text-muted-foreground">No image</p>
        </div>
      </div>
    )
  }

  const goToPrevious = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlay(false)
    setCurrentIndex(index)
  }

  return (
    <div
      className="relative w-full aspect-video overflow-hidden bg-muted group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* スライド表示 */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image src={image.url} alt={image.alt} fill className="object-cover" priority={index === 0} />
          </div>
        ))}

        {/* キャプション削除 - DESIGN.mdに準拠してシャドウを弱める */}
      </div>

      {/* 前へボタン */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white transition-colors z-10 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* 次へボタン */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white transition-colors z-10 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* ドット インジケーター */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* スライド情報 */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
