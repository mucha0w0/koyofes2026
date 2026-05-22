"use client"

import { useEffect, useRef } from "react"

interface Sponsor {
  id: string
  name: string
  logo: string
}

const sponsors: Sponsor[] = [
  { id: "1", name: "山田電機", logo: "/sponsors/yamada.svg" },
  { id: "2", name: "紅葉銀行", logo: "/sponsors/koyo-bank.svg" },
  { id: "3", name: "向陽不動産", logo: "/sponsors/koyo-estate.svg" },
  { id: "4", name: "スカイフーズ", logo: "/sponsors/sky-foods.svg" },
  { id: "5", name: "メディアプラス", logo: "/sponsors/media-plus.svg" },
  { id: "6", name: "グリーンマート", logo: "/sponsors/green-mart.svg" },
  { id: "7", name: "さくら出版", logo: "/sponsors/sakura.svg" },
  { id: "8", name: "テクノサービス", logo: "/sponsors/techno.svg" },
  { id: "9", name: "花園ホテル", logo: "/sponsors/hanazono.svg" },
  { id: "10", name: "ドリームカー", logo: "/sponsors/dream-car.svg" },
]

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="flex items-center justify-center h-16 px-8 bg-card shrink-0">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {sponsor.name}
      </span>
    </div>
  )
}

export function Sponsors() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    const speed = 0.5

    const animate = () => {
      if (!isHoveredRef.current) {
        scrollPositionRef.current += speed
        
        const firstSet = scrollContainer.querySelector('[data-sponsor-set="1"]') as HTMLElement
        if (firstSet) {
          const setWidth = firstSet.offsetWidth
          const setGap = 24 // gap-6 = 1.5rem = 24px
          const totalSetWidth = setWidth + setGap
          
          // セット幅 + ギャップで無限ループ
          if (scrollPositionRef.current >= totalSetWidth) {
            scrollPositionRef.current -= totalSetWidth
          }
        }
        
        scrollContainer.scrollLeft = scrollPositionRef.current
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => {
      isHoveredRef.current = true
    }
    const handleMouseLeave = () => {
      isHoveredRef.current = false
    }

    // ウィンドウリサイズ時にスクロール位置をリセット（レスポンシブ対応）
    const handleResize = () => {
      scrollPositionRef.current = 0
      scrollContainer.scrollLeft = 0
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section className="py-12 md:py-16 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            協賛企業
          </h2>
          <p className="text-sm text-muted-foreground">こうよう祭を支えてくださる企業様</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
        style={{ scrollBehavior: "auto" }}
      >
        <div data-sponsor-set="1" className="flex gap-6 shrink-0">
          {sponsors.map((sponsor) => (
            <SponsorLogo key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
        <div data-sponsor-set="2" className="flex gap-6 shrink-0">
          {sponsors.map((sponsor) => (
            <SponsorLogo key={`dup-${sponsor.id}`} sponsor={sponsor} />
          ))}
        </div>
        <div data-sponsor-set="3" className="flex gap-6 shrink-0">
          {sponsors.map((sponsor) => (
            <SponsorLogo key={`dup2-${sponsor.id}`} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </section>
  )
}
