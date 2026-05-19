"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Clock } from "lucide-react"

export function HeroSection() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2026-09-12T09:00:00")

    const updateCountdown = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-background">
      <div className="container mx-auto px-4 py-24 md:py-40">
        <div className="text-center space-y-12">
          {/* Main Title */}
          <div className="space-y-6">
            <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.15em]">
              令和8年度 文化祭
            </p>
            <h1 className="hero-display text-5xl md:text-6xl lg:text-7xl font-normal">
              今年のテーマ名
            </h1>
            <h2 className="text-2xl md:text-4xl font-normal text-foreground">
              こうよう祭 2026
            </h2>
          </div>

          {/* Event Info */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-foreground" />
              <span>2026年9月12日(土)・13日(日)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-foreground" />
              <span>9:00 〜 16:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-foreground" />
              <span>紅葉高等学校</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="pt-8 md:pt-12">
            <p className="text-xs md:text-sm text-muted-foreground mb-6">開催まで</p>
            <div className="flex justify-center gap-3 md:gap-6">
              {[
                { value: countdown.days, label: "日" },
                { value: countdown.hours, label: "時間" },
                { value: countdown.minutes, label: "分" },
                { value: countdown.seconds, label: "秒" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card p-4 md:p-6 min-w-[80px] md:min-w-[100px]"
                >
                  <div className="text-3xl md:text-5xl font-normal text-foreground tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
