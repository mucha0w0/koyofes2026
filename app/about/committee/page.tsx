import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { User } from "lucide-react"

const executives = [
  { role: "実行委員長", name: "山田 太郎" },
  { role: "副実行委員長", name: "鈴木 花子" },
  { role: "副実行委員長", name: "佐藤 一郎" },
]

const departments = [
  { name: "総務局", description: "全体の統括・運営" },
  { name: "企画局", description: "企画の審査・管理" },
  { name: "広報局", description: "宣伝・SNS運営" },
  { name: "制作局", description: "装飾・ステージ設営" },
  { name: "渉外局", description: "協賛・外部連携" },
]

export default function CommitteePage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="パート" subtitle="こうよう祭を運営するパートのご紹介">
        <div className="space-y-8">
          <div>
            <h2 className="font-medium text-lg mb-4">執行部</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {executives.map((exec, i) => (
                <div key={i} className="bg-card p-5 text-center">
                  <div className="w-16 h-16 bg-muted flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{exec.role}</p>
                  <p className="font-medium">{exec.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-medium text-lg mb-4">各局紹介</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, i) => (
                <div key={i} className="bg-card p-5">
                  <h3 className="font-medium text-foreground mb-2">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
