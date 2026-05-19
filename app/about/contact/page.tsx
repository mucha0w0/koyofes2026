import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="お問い合わせ" subtitle="ご質問・ご要望はこちらから" backHref="/about" backLabel="こうよう祭についてに戻る">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card p-6">
              <h2 className="font-medium text-lg mb-4">連絡先</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">メール</p>
                    <p className="font-medium">kouyousai@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted">
                    <Phone className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">電話（学校代表）</p>
                    <p className="font-medium">03-XXXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted">
                    <MapPin className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">住所</p>
                    <p className="font-medium">〒000-0000 東京都○○区○○町1-2-3</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6">
              <p className="text-sm text-muted-foreground">
                お問い合わせへの回答には数日いただく場合がございます。
                よくある質問もご確認ください。
              </p>
            </div>
          </div>

          <div className="bg-card p-6">
            <h2 className="font-medium text-lg mb-4">お問い合わせフォーム</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">お名前</label>
                <input type="text" className="w-full px-4 py-2 bg-input border border-border focus:outline-none focus:border-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">メールアドレス</label>
                <input type="email" className="w-full px-4 py-2 bg-input border border-border focus:outline-none focus:border-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">件名</label>
                <input type="text" className="w-full px-4 py-2 bg-input border border-border focus:outline-none focus:border-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">お問い合わせ内容</label>
                <textarea rows={5} className="w-full px-4 py-2 bg-input border border-border focus:outline-none focus:border-ring resize-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity">
                送信する
              </button>
            </form>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
