import { getEnabledOfficialSocials, getOfficialSocialIcon, type OfficialSocial } from '@/lib/config/social';

function SocialLink({ id, label, handle, url }: OfficialSocial) {
  const Icon = getOfficialSocialIcon(id);

  return (
    <a
      className="ink-shell ink-lift relative flex max-w-[320px] items-center gap-3 bg-card px-5 py-3.5 text-ink sm:flex-1"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon className="h-6 w-6 shrink-0" />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm leading-tight font-medium">{label}</span>
        <span className="text-xs leading-tight text-ink-soft">{handle}</span>
      </div>
    </a>
  );
}

export function SocialCtaSection() {
  const links = getEnabledOfficialSocials();
  if (links.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#1f2529] py-8 text-white">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="shrink-0 text-center text-sm tracking-normal sm:text-left">最新情報は公式SNSをチェック！</p>
          <div className="flex w-full justify-center gap-3 sm:w-auto sm:flex-1 sm:justify-end">
            {links.map((link) => (
              <SocialLink key={link.id} {...link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
