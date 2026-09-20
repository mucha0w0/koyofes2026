import { getOfficialSocial, getOfficialSocialIcon } from '@/lib/config/social';

export function SiteFooter() {
  const instagram = getOfficialSocial('instagram');
  const InstagramIcon = getOfficialSocialIcon(instagram.id);

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

          {instagram.enabled && (
            <a
              className="group inline-flex items-center gap-3 sm:shrink-0"
              href={instagram.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white/20 text-white transition-colors group-hover:bg-white/30">
                <InstagramIcon aria-hidden className="size-5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm leading-tight font-medium">公式Instagram</span>
                <span className="text-xs leading-tight text-white/70">{instagram.handle}</span>
              </span>
            </a>
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
