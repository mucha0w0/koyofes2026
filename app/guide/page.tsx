import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import { ArrowRight, MapPin, Clock, HelpCircle, AlertTriangle, Info, Users, Heart, Mail, Train, Ticket } from "lucide-react"

const guidePages = [
  { icon: Train, label: "アクセス", href: "/guide/access", description: "電車・バス・車でのアクセス方法" },
  { icon: MapPin, label: "会場マップ", href: "/guide/map", description: "校内マップ・施設案内" },
  { icon: Ticket, label: "入場について", href: "/guide/admission", description: "入場時間・受付について" },
  { icon: AlertTriangle, label: "注意事項", href: "/guide/notice", description: "来場時のお願い・禁止事項" },
  { icon: HelpCircle, label: "よくある質問", href: "/guide/faq", description: "FAQ・お問い合わせ前に" },
]

export default function GuidePage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="ご案内" subtitle="来場者の皆様へのご案内です">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guidePages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="bg-card p-6 hover:opacity-80 transition-opacity group"
            >
              <div className="p-3 bg-muted w-fit mb-4">
                <page.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-1">{page.label}</h3>
              <p className="text-sm text-muted-foreground">{page.description}</p>
            </Link>
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
