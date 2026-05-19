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
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <p className="text-sm md:text-base font-medium text-primary tracking-widest uppercase">
              令和8年度 文化祭
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-balance">
              <span className="text-primary">こうよう祭</span>
              <span className="text-foreground"> 2026</span>
            </h1>
          </div>

          {/* Theme */}
          <div className="inline-block">
            <div className="bg-card border border-border rounded-xl px-6 py-4 md:px-8 md:py-5">
              <p className="text-xs text-muted-foreground mb-1">テーマ</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                「輝け、青春の一ページ」
              </p>
            </div>
          </div>

          {/* Event Info */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <span>2026年9月12日(土)・13日(日)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <span>9:00 〜 16:00</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>紅葉高等学校</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">開催まで</p>
            <div className="flex justify-center gap-3 md:gap-4">
              {[
                { value: countdown.days, label: "日" },
                { value: countdown.hours, label: "時間" },
                { value: countdown.minutes, label: "分" },
                { value: countdown.seconds, label: "秒" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card border border-border rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px]"
                >
                  <div className="text-2xl md:text-4xl font-black text-primary tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
