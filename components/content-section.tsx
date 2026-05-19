import Link from "next/link"
import { ArrowRight, MapPin, Clock, HelpCircle, AlertTriangle, Info, Users, Heart, Mail } from "lucide-react"

const guideLinks = [
  {
    icon: MapPin,
    label: "アクセス",
    href: "/guide/access",
    description: "電車・バス・車でのアクセス方法",
  },
  {
    icon: MapPin,
    label: "会場マップ",
    href: "/guide/map",
    description: "校内マップ・施設案内",
  },
  {
    icon: Clock,
    label: "入場について",
    href: "/guide/admission",
    description: "入場時間・受付について",
  },
  {
    icon: AlertTriangle,
    label: "注意事項",
    href: "/guide/notice",
    description: "来場時のお願い・禁止事項",
  },
  {
    icon: HelpCircle,
    label: "よくある質問",
    href: "/guide/faq",
    description: "FAQ・お問い合わせ前に",
  },
]

const aboutLinks = [
  {
    icon: Info,
    label: "こうよう祭とは",
    href: "/about",
    description: "歴史と概要",
  },
  {
    icon: Heart,
    label: "テーマ",
    href: "/about/theme",
    description: "今年のテーマについて",
  },
  {
    icon: Users,
    label: "実行委員会",
    href: "/about/committee",
    description: "委員会紹介・組織図",
  },
  {
    icon: Mail,
    label: "お問い合わせ",
    href: "/about/contact",
    description: "連絡先・フォーム",
  },
]

const news = [
  { date: "2026.09.01", title: "当日のタイムテーブルを公開しました", isNew: true },
  { date: "2026.08.25", title: "企画一覧を更新しました", isNew: true },
  { date: "2026.08.15", title: "公式ウェブサイトをリニューアルしました", isNew: false },
  { date: "2026.08.01", title: "こうよう祭2026の開催が決定しました", isNew: false },
]

export function ContentSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Guide & About Links */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* ご案内 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-foreground section-h2-jp">
                ご案内
              </h2>
              <Link
                href="/guide"
                className="flex items-center gap-1 text-sm text-primary hover:opacity-80 transition-opacity font-medium"
              >
                すべて見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              {guideLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 p-4 bg-white border-2 border-foreground rounded hover:bg-primary hover:text-white hover:border-primary transition-all group"
                  style={{ borderRadius: '5px' }}
                >
                  <div className="p-2 rounded text-primary group-hover:text-white transition-colors shrink-0">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <p className="text-xs text-foreground opacity-70 truncate">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground group-hover:text-white transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* こうよう祭について */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-foreground section-h2-jp">
                こうよう祭について
              </h2>
              <Link
                href="/about"
                className="flex items-center gap-1 text-sm text-secondary hover:opacity-80 transition-opacity font-medium"
              >
                すべて見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              {aboutLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 p-4 bg-white border-2 border-foreground rounded hover:bg-secondary hover:text-white hover:border-secondary transition-all group"
                  style={{ borderRadius: '5px' }}
                >
                  <div className="p-2 rounded text-secondary group-hover:text-white transition-colors shrink-0">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <p className="text-xs text-foreground opacity-70 truncate">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground group-hover:text-white transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="space-y-6 border-t border-border pt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-foreground section-h2-jp">
              お知らせ
            </h2>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm text-primary hover:opacity-80 transition-opacity font-medium"
            >
              すべて見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {news.map((item, index) => (
              <Link
                key={index}
                href="/news"
                className="flex items-center gap-4 p-4 bg-white border-2 border-foreground rounded hover:bg-primary hover:text-white hover:border-primary transition-all group"
                style={{ borderRadius: '5px' }}
              >
                <span className="text-sm text-foreground group-hover:text-white font-bold shrink-0">
                  {item.date}
                </span>
                {item.isNew && (
                  <span className="text-xs font-bold text-white bg-secondary px-2 py-1 rounded shrink-0">
                    NEW
                  </span>
                )}
                <span className="text-sm font-medium group-hover:text-white transition-colors truncate flex-1">
                  {item.title}
                </span>
                <ArrowRight className="h-4 w-4 text-foreground group-hover:text-white shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
