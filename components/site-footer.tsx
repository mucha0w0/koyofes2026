import Link from 'next/link';
import { SiX, SiInstagram, SiYoutube } from 'react-icons/si';

import { getNavSections } from '@/lib/config/nav';

const socialLinks = [
  { label: 'X (旧Twitter)', href: 'https://twitter.com/kouyousai2026', icon: SiX },
  { label: 'Instagram', href: 'https://instagram.com/kouyousai2026', icon: SiInstagram },
  { label: 'YouTube', href: 'https://youtube.com/@kouyousai2026', icon: SiYoutube },
] as const;

const footerNavSections = getNavSections('footer');

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div className="space-y-2.5">
            <p className="text-xl font-medium tracking-[0.08em]">こうよう祭 2026</p>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              豊田高専の文化祭
              <br />
              10/31(土)・11/1(日)
            </p>
          </div>

          <div className="sm:shrink-0">
            <p className="mb-3 text-sm font-medium">公式SNS</p>
            <div className="flex gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  className="flex size-10 items-center justify-center bg-primary-foreground/20 text-primary-foreground transition-colors hover:bg-primary-foreground/30"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <nav
          aria-label="フッターナビゲーション"
          className="mt-10 grid gap-8 border-t border-primary-foreground/20 pt-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {footerNavSections.map((section) => (
            <div key={section.id}>
              <p className="mb-3 text-sm font-medium">{section.label}</p>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link className="transition-colors hover:text-primary-foreground" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-10 flex flex-col gap-2 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/60 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
          <p>こうよう祭 2026 システムパート</p>
          <p>&copy; 2026 KoyoFes System Part</p>
        </div>
      </div>
    </footer>
  );
}
