import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { AlertTriangle, Ban, Camera, Cigarette, Dog } from "lucide-react"

const notices = [
  { icon: Cigarette, title: "喫煙禁止", description: "校内は全面禁煙です" },
  { icon: Dog, title: "ペット同伴禁止", description: "補助犬を除き、ペットの入場はご遠慮ください" },
  { icon: Camera, title: "撮影について", description: "撮影は自由ですが、SNSへの投稿はご遠慮ください。" },
  { icon: Ban, title: "危険物持ち込み禁止", description: "刃物・火器等の持ち込みは禁止です" },
]

export default function NoticePage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="注意事項" subtitle="ご来場の皆様へのお願いです">
        <div className="space-y-6">
          <div className="bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-foreground" />
              <h2 className="font-medium text-lg">ご来場前にお読みください</h2>
            </div>
            <p className="text-muted-foreground">
              こうよう祭を安全にお楽しみいただくため、以下の注意事項をご確認ください。
              ご協力をお願いいたします。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {notices.map((notice, i) => (
              <div key={i} className="bg-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted">
                    <notice.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-medium">{notice.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{notice.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-card p-6">
            <h2 className="font-medium text-lg mb-4">その他のお願い</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>・ゴミは各自お持ち帰りください</li>
              <li>・貴重品の管理は各自でお願いします</li>
              <li>・体調不良の場合は救護室へお越しください</li>
              <li>・緊急時は係員の指示に従ってください</li>
            </ul>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
