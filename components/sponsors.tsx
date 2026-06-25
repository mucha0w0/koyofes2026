"use client"
import { useEffect, useRef } from "react"
import type { SponsorItem } from "@/lib/types/sponsor"

interface SponsorsProps {
  sponsors: SponsorItem[]
}

function SponsorLogo({ sponsor }: { sponsor: SponsorItem }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-20 px-8 shrink-0">
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
    </div>
  )
}

export function Sponsors({ sponsors }: SponsorsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)
  const isHoveredRef = useRef(false)
  const setWidthRef = useRef(0)
  const animationIdRef = useRef<number>(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const GAP = 24 // gap-6 = 24px

    const measureSetWidth = () => {
      const firstSet = track.querySelector('[data-sponsor-set="1"]') as HTMLElement
      if (firstSet) {
        // セット幅 + 右側のギャップ1つ分
        setWidthRef.current = firstSet.offsetWidth + GAP
      }
    }

    measureSetWidth()

    const SPEED = 0.2

    const animate = () => {
      if (!isHoveredRef.current && setWidthRef.current > 0) {
        positionRef.current += SPEED

        // 1セット分進んだらリセット（シームレスループ）
        if (positionRef.current >= setWidthRef.current) {
          positionRef.current -= setWidthRef.current
        }

        track.style.transform = `translateX(${-positionRef.current}px)`
      }
      animationIdRef.current = requestAnimationFrame(animate)
    }

    animationIdRef.current = requestAnimationFrame(animate)

    const handleMouseEnter = () => { isHoveredRef.current = true }
    const handleMouseLeave = () => { isHoveredRef.current = false }

    const handleResize = () => {
      measureSetWidth()
      // リサイズ後に現在位置がセット幅を超えていたら補正
      if (positionRef.current >= setWidthRef.current) {
        positionRef.current = 0
      }
    }

    track.addEventListener("mouseenter", handleMouseEnter)
    track.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationIdRef.current)
      track.removeEventListener("mouseenter", handleMouseEnter)
      track.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (sponsors.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-medium mb-2">協賛企業</h2>
          <p className="text-sm text-muted-foreground">こうよう祭を支えてくださる企業様</p>
        </div>
      </div>

      {/* overflow-hidden で見切れを制御、track を translateX で動かす */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: "24px" }}
        >
          <div data-sponsor-set="1" className="flex shrink-0" style={{ gap: "24px" }}>
            {sponsors.map((sponsor) => (
              <SponsorLogo key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
          {/* 2セット目でシームレスにつなぐ */}
          <div data-sponsor-set="2" className="flex shrink-0" style={{ gap: "24px" }}>
            {sponsors.map((sponsor) => (
              <SponsorLogo key={`dup-${sponsor.id}`} sponsor={sponsor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}