import { ExternalLink } from 'lucide-react';

import { getEnabledOfficialSocials, getOfficialSocialIcon, type OfficialSocial } from '@/lib/config/social';

function SocialLink({ id, label, handle, url }: OfficialSocial) {
  const Icon = getOfficialSocialIcon(id);

  return (
    <a
      className="flex-1 relative flex items-center gap-3 px-5 py-3.5 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors rounded-md max-w-[320px]"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon className="h-6 w-6 shrink-0" />

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium leading-tight">{label}</span>
        <span className="text-xs text-primary-foreground/60 leading-tight">{handle}</span>
      </div>

      <ExternalLink className="absolute bottom-2 right-2 h-3.5 w-3.5 text-primary-foreground/40" />
    </a>
  );
}

export function SocialCtaSection() {
  const links = getEnabledOfficialSocials();
  if (links.length === 0) {
    return null;
  }

  return (
    <section className="bg-primary py-8">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted tracking-wide text-center sm:text-left shrink-0">
            最新情報は公式SNSをチェック！
          </p>
          <div className="flex w-full sm:w-auto sm:flex-1 justify-end gap-3">
            {links.map((link) => (
              <SocialLink key={link.id} {...link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
