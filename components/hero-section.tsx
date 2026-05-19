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
    <section className="relative overflow-hidden bg-white border-b border-border">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          {/* Main Title */}
          <div className="space-y-2">
            <p className="text-sm md:text-base font-bold text-primary tracking-widest uppercase" style={{ fontSize: '12px' }}>
              令和8年度 文化祭
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-balance text-foreground hero-display">
              こうよう祭 2026
            </h1>
          </div>

          {/* Theme */}
          <div className="inline-block pt-4">
            <div className="bg-white border-2 border-primary rounded px-6 py-3 md:px-8 md:py-4" style={{ borderRadius: '5px' }}>
              <p className="text-xs text-foreground mb-1 opacity-70">テーマ</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                「輝け、青春の一ページ」
              </p>
            </div>
          </div>

          {/* Event Info */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base pt-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Calendar className="h-5 w-5 text-primary" />
              <span>2026年9月12日(土)・13日(日)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Clock className="h-5 w-5 text-primary" />
              <span>9:00 〜 16:00</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <MapPin className="h-5 w-5 text-primary" />
              <span>紅葉高等学校</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="pt-6">
            <p className="text-sm text-foreground font-medium mb-4">開催まで</p>
            <div className="flex justify-center gap-2 md:gap-3">
              {[
                { value: countdown.days, label: "日" },
                { value: countdown.hours, label: "時間" },
                { value: countdown.minutes, label: "分" },
                { value: countdown.seconds, label: "秒" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border-2 border-foreground rounded p-2 md:p-3 min-w-[60px] md:min-w-[80px]"
                  style={{ borderRadius: '5px' }}
                >
                  <div className="text-xl md:text-3xl font-black text-primary tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-foreground font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
