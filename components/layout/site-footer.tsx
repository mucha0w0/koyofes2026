export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
        <div className="space-y-2.5">
          <p className="font-display text-xl font-bold">こうよう祭 2026</p>
          <p className="text-sm leading-relaxed text-white/80">
            豊田高専の文化祭
            <br />
            10/31(土)・11/1(日)
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-2 pt-6 text-xs text-white/70 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
          <p>こうよう祭 2026 システムパート</p>
          <p>&copy; 2026 KoyoFes System Part</p>
        </div>
      </div>
    </footer>
  );
}
