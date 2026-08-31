import { SiX, SiInstagram, SiYoutube } from 'react-icons/si';

const socialLinks = [
  { label: 'X (旧Twitter)', href: 'https://twitter.com/kouyousai2026', icon: SiX },
  { label: 'Instagram', href: 'https://instagram.com/kouyousai2026', icon: SiInstagram },
  { label: 'YouTube', href: 'https://youtube.com/@kouyousai2026', icon: SiYoutube },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-8">
          <div>
            <p className="text-xl font-medium tracking-[0.08em] mb-4">こうよう祭 2026</p>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              豊田高専の文化祭
              <br />
              10/31(土)・11/1(日)
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm">公式SNS</h4>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  className="p-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
          <p>こうよう祭 2026 システムパート</p>
          <p>&copy; 2026 KoyoFes System Part</p>
        </div>
      </div>
    </footer>
  );
}
