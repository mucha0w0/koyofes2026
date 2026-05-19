"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, School, Users, Mic2, Flag } from "lucide-react"

interface Event {
  id: string
  title: string
  organizer: string
  icon: string
}

interface CategoryData {
  id: string
  title: string
  Icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  events: Event[]
}

const categoryData: CategoryData[] = [
  {
    id: "class",
    title: "クラス・学科展示",
    Icon: School,
    color: "text-primary",
    bgColor: "bg-white",
    borderColor: "border-primary",
    events: [
      { id: "c1", title: "お化け屋敷「闘の回廊」", organizer: "3年A組", icon: "/events/haunted.jpg" },
      { id: "c2", title: "カフェ「Sunset」", organizer: "2年B組", icon: "/events/cafe.jpg" },
      { id: "c3", title: "縁日「祭りの宴」", organizer: "1年C組", icon: "/events/festival.jpg" },
      { id: "c4", title: "脱出ゲーム", organizer: "3年D組", icon: "/events/escape.jpg" },
      { id: "c5", title: "プラネタリウム", organizer: "2年E組", icon: "/events/planetarium.jpg" },
    ],
  },
  {
    id: "club",
    title: "有志展示",
    Icon: Users,
    color: "text-secondary",
    bgColor: "bg-white",
    borderColor: "border-secondary",
    events: [
      { id: "v1", title: "写真部展示会", organizer: "写真部", icon: "/events/photo.jpg" },
      { id: "v2", title: "イラスト同好会", organizer: "イラスト同好会", icon: "/events/illust.jpg" },
      { id: "v3", title: "鉄道研究会", organizer: "鉄道研究会", icon: "/events/train.jpg" },
      { id: "v4", title: "書道部展示", organizer: "書道部", icon: "/events/calligraphy.jpg" },
      { id: "v5", title: "華道部展示", organizer: "華道部", icon: "/events/flower.jpg" },
    ],
  },
  {
    id: "stage",
    title: "ステージイベント",
    Icon: Mic2,
    color: "text-primary",
    bgColor: "bg-white",
    borderColor: "border-primary",
    events: [
      { id: "s1", title: "軽音楽部ライブ", organizer: "軽音楽部", icon: "/events/band.jpg" },
      { id: "s2", title: "演劇部公演", organizer: "演劇部", icon: "/events/drama.jpg" },
      { id: "s3", title: "ダンス部", organizer: "ダンス部", icon: "/events/dance.jpg" },
      { id: "s4", title: "吹奏楽部", organizer: "吹奏楽部", icon: "/events/brass.jpg" },
      { id: "s5", title: "合唱部", organizer: "合唱部", icon: "/events/choir.jpg" },
    ],
  },
  {
    id: "official",
    title: "公式イベント",
    Icon: Flag,
    color: "text-secondary",
    bgColor: "bg-white",
    borderColor: "border-secondary",
    events: [
      { id: "o1", title: "開会式", organizer: "実行委員会", icon: "/events/opening.jpg" },
      { id: "o2", title: "ミスコン", organizer: "実行委員会", icon: "/events/contest.jpg" },
      { id: "o3", title: "後夜祭", organizer: "実行委員会", icon: "/events/closing.jpg" },
      { id: "o4", title: "抽選会", organizer: "実行委員会", icon: "/events/lottery.jpg" },
      { id: "o5", title: "スタンプラリー", organizer: "実行委員会", icon: "/events/stamp.jpg" },
    ],
  },
]

function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col items-center gap-2 shrink-0 group"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded border-2 border-foreground bg-white overflow-hidden group-hover:bg-primary group-hover:border-primary transition-all" style={{ borderRadius: '5px' }}>
        <div className="w-full h-full flex items-center justify-center bg-white text-foreground text-2xl font-bold group-hover:text-white group-hover:bg-primary transition-all">
          {event.title.charAt(0)}
        </div>
      </div>
      <div className="text-center max-w-24">
        <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">
          {event.title}
        </p>
        <p className="text-xs text-foreground opacity-70 truncate">
          {event.organizer}
        </p>
      </div>
    </Link>
  )
}

function ScrollingEvents({ category }: { category: CategoryData }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const speed = 0.3

    const animate = () => {
      scrollPosition += speed
      
      const firstSet = scrollContainer.querySelector('[data-event-set="1"]') as HTMLElement
      if (firstSet && scrollPosition >= firstSet.offsetWidth + 16) {
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
    <div 
      ref={scrollRef}
      className="flex gap-4 overflow-x-hidden py-2"
      style={{ scrollBehavior: "auto" }}
    >
      <div data-event-set="1" className="flex gap-4 shrink-0">
        {category.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div data-event-set="2" className="flex gap-4 shrink-0">
        {category.events.map((event) => (
          <EventCard key={`dup-${event.id}`} event={event} />
        ))}
      </div>
      <div data-event-set="3" className="flex gap-4 shrink-0">
        {category.events.map((event) => (
          <EventCard key={`dup2-${event.id}`} event={event} />
        ))}
      </div>
    </div>
  )
}

export function CategoryEvents() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 section-h2-jp">
            カテゴリ別企画一覧
          </h2>
          <p className="text-foreground opacity-70">4つのカテゴリから企画をチェック</p>
        </div>

        <div className="space-y-8">
          {categoryData.map((category) => (
            <div
              key={category.id}
              className={`bg-white border-2 ${category.borderColor} rounded overflow-hidden`}
              style={{ borderRadius: '5px' }}
            >
              {/* Category Header */}
              <div className={`flex items-center gap-3 p-4 bg-slate-100`}>
                <div className={`p-2 rounded ${category.color}`}>
                  <category.Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{category.title}</h3>
                <Link
                  href={`/events/category/${category.id}`}
                  className="ml-auto text-sm text-primary hover:opacity-80 flex items-center gap-1 transition-opacity font-medium"
                >
                  すべて見る
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Scrolling Events */}
              <div className="px-4 pb-4">
                <ScrollingEvents category={category} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
