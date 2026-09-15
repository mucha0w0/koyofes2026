import { getEnabledOfficialSocials, getOfficialSocialIcon } from '@/lib/config/social';

export function SiteFooter() {
  const socialLinks = getEnabledOfficialSocials();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div className="space-y-2.5">
            <p className="text-xl font-medium tracking-[0.08em]">こうよう祭 2026</p>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              豊田高専の文化祭
              <br />
              10/31(土)・11/1(日)
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="sm:shrink-0">
              <p className="mb-3 text-sm font-medium">公式SNS</p>
              <div className="flex gap-2">
                {socialLinks.map(({ id, label, url }) => {
                  const Icon = getOfficialSocialIcon(id);
                  return (
                    <a
                      key={id}
                      aria-label={label}
                      className="flex size-10 items-center justify-center bg-primary-foreground/20 text-primary-foreground transition-colors hover:bg-primary-foreground/30"
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/60 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
          <p>こうよう祭 2026 システムパート</p>
          <p>&copy; 2026 KoyoFes System Part</p>
        </div>
      </div>
    </footer>
  );
}
