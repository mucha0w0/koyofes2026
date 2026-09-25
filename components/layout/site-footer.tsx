export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:py-12">
        <div className="space-y-2">
          <p className="font-display text-xl font-bold leading-tight">2026年度 こうよう祭</p>
          <p className="text-sm leading-normal text-white/80 tabular-nums">2026/10/31・11/1</p>
        </div>
        <p className="text-xs leading-normal text-white/70 sm:text-right sm:text-sm">
          &copy; こうよう祭 2026 システムパート
        </p>
      </div>
    </footer>
  );
}
