import Link from "next/link"
import { Twitter, Instagram, Youtube } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Logo & Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-medium tracking-[0.08em]">こうよう祭 2026</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              豊田高専の文化祭
              <br />
              10/31(土)・11/1(日)
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm">企画情報</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/events/list" className="hover:text-primary-foreground transition-colors">企画一覧</Link></li>
              <li><Link href="/events/recommended" className="hover:text-primary-foreground transition-colors">おすすめ企画</Link></li>
              <li><Link href="/events/timetable" className="hover:text-primary-foreground transition-colors">タイムテーブル</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm">ご案内</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/guide/access" className="hover:text-primary-foreground transition-colors">アクセス</Link></li>
              <li><Link href="/guide/map" className="hover:text-primary-foreground transition-colors">会場マップ</Link></li>
              <li><Link href="/guide/faq" className="hover:text-primary-foreground transition-colors">よくある質問</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm">こうよう祭について</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/about/overview" className="hover:text-primary-foreground transition-colors">こうよう祭とは</Link></li>
              <li><Link href="/about/sponsor" className="hover:text-primary-foreground transition-colors">ご協賛</Link></li>
              <li><Link href="/about/contact" className="hover:text-primary-foreground transition-colors">お問い合わせ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm">公式SNS</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
          <p>こうよう祭 2026 システムパート</p>
          <p>&copy; 2026 KoyoFes System Part</p>
        </div>
      </div>
    </footer>
  )
}
