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
    <div className="flex items-center justify-center h-16 px-8 bg-card/50 border border-border rounded-lg shrink-0">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {sponsor.name}
      </span>
    </div>
  )
}

export function Sponsors() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const speed = 0.5

    const animate = () => {
      scrollPosition += speed
      
      const firstSet = scrollContainer.querySelector('[data-sponsor-set="1"]') as HTMLElement
      if (firstSet && scrollPosition >= firstSet.offsetWidth + 24) {
        scrollPosition = 0
      }
      
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <section className="py-12 md:py-16 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            <span className="text-primary">協賛</span>企業
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
