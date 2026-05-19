import Link from "next/link"
import { Twitter, Instagram, Youtube } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-black text-primary">こうよう祭 2026</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              紅葉高等学校の文化祭。
              <br />
              2026年9月12日(土)・13日(日)開催
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm">企画情報</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events/recommended" className="hover:text-primary transition-colors">おすすめ企画</Link></li>
              <li><Link href="/events/list" className="hover:text-primary transition-colors">企画一覧</Link></li>
              <li><Link href="/events/timetable" className="hover:text-primary transition-colors">タイムテーブル</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">ご案内</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/guide/access" className="hover:text-primary transition-colors">アクセス</Link></li>
              <li><Link href="/guide/map" className="hover:text-primary transition-colors">会場マップ</Link></li>
              <li><Link href="/guide/faq" className="hover:text-primary transition-colors">よくある質問</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">公式SNS</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>こうよう祭 2026 実行委員会</p>
          <p>&copy; 2026 Kouyousai Executive Committee</p>
        </div>
      </div>
    </footer>
  )
}
