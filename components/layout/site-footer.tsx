import { getEnabledOfficialSocials, getOfficialSocialIcon } from '@/lib/config/social';

export function SiteFooter() {
  const socialLinks = getEnabledOfficialSocials();

  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div className="space-y-2.5">
            <p className="font-display text-xl font-bold">こうよう祭 2026</p>
            <p className="text-sm leading-relaxed text-white/80">
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
                      className="flex size-10 items-center justify-center rounded-md bg-white/20 text-white transition-colors hover:bg-white/30"
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

        <div className="mt-10 flex flex-col gap-2 pt-6 text-xs text-white/70 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
          <p>こうよう祭 2026 システムパート</p>
          <p>&copy; 2026 KoyoFes System Part</p>
        </div>
      </div>
    </footer>
  );
}
