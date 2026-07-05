import { ExternalLink } from "lucide-react";
import { SiInstagram, SiLine } from "react-icons/si";

const SOCIAL_LINKS = [
  {
    id: "instagram",
    Icon: SiInstagram,
    label: "Instagram",
    handle: "@kouyousai2026",
    url: "https://instagram.com/kouyousai2026",
  },
  {
    id: "line",
    Icon: SiLine,
    label: "LINE",
    handle: "@kouyousai2026",
    url: "https://line.me/kouyousai2026",
  },
] as const;

function SocialLink({
  Icon,
  label,
  handle,
  url,
}: (typeof SOCIAL_LINKS)[number]) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 relative flex items-center gap-3 px-5 py-3.5 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors rounded-md max-w-[320px]"
    >
      {/* react-icons のブランドアイコン */}
      <Icon className="h-6 w-6 shrink-0" />

      {/* テキストエリア：縦2行 */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium leading-tight">{label}</span>
        <span className="text-xs text-primary-foreground/60 leading-tight">
          {handle}
        </span>
      </div>

      {/* 右下の外部リンクアイコン */}
      <ExternalLink className="absolute bottom-2 right-2 h-3.5 w-3.5 text-primary-foreground/40" />
    </a>
  );
}

export function SocialCtaSection() {
  return (
    <section className="bg-primary py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-primary-foreground/70 tracking-wide text-center sm:text-left shrink-0">
            最新情報は公式SNSをチェック
          </p>
          <div className="flex w-full sm:w-auto sm:flex-1 justify-end gap-3">
            {SOCIAL_LINKS.map((link) => (
              <SocialLink key={link.id} {...link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}