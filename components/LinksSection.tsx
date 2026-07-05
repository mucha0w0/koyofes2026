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
    description: "構内図",
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
    href: "/about/overview",
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
    label: "パート",
    href: "/about/part",
    description: "こうよう祭を運営するパートのご紹介",
  },
  {
    icon: Users,
    label: "ご協賛",
    href: "/about/sponsor",
    description: "ご協賛いただいている企業・団体様",
  },
  {
    icon: Mail,
    label: "お問い合わせ",
    href: "/about/contact",
    description: "連絡先",
  },
]

export function LinksSection() {
  return (
    <section className="pt-16 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* ご案内 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-medium">ご案内</h2>
            </div>
            <div className="grid gap-2">
              {guideLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 p-4 bg-card transition-opacity hover:opacity-80 group"
                >
                  <div className="p-2 bg-muted text-foreground">
                    <link.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{link.label}</span>
                    <p className="text-xs text-muted-foreground truncate">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* こうよう祭について */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-medium">こうよう祭について</h2>
            </div>
            <div className="grid gap-2">
              {aboutLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 p-4 bg-card transition-opacity hover:opacity-80 group"
                >
                  <div className="p-2 bg-muted text-foreground">
                    <link.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{link.label}</span>
                    <p className="text-xs text-muted-foreground truncate">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}