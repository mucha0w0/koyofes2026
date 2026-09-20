export function EventDetailSkeleton() {
  return (
    <main className="flex-1 animate-pulse">
      <div className="aspect-video w-full border-b-[length:calc(var(--shell-stroke)+var(--shell-oy))] border-ink bg-paper-2" />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-16">
        <div className="mb-12 md:mb-16 space-y-6">
          <div className="flex items-start gap-4 md:gap-8">
            <div className="h-16 w-16 shrink-0 bg-paper-2 md:h-24 md:w-24" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-2/3 rounded bg-paper-2" />
              <div className="h-5 w-1/3 rounded bg-paper-2" />
            </div>
          </div>
          <div className="h-6 w-3/4 rounded bg-paper-2" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2 bg-card p-4">
                  <div className="h-4 w-12 rounded bg-paper-2" />
                  <div className="h-4 w-full rounded bg-paper-2" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-7 w-32 rounded bg-paper-2" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-paper-2" />
                <div className="h-4 w-full rounded bg-paper-2" />
                <div className="h-4 w-2/3 rounded bg-paper-2" />
              </div>
            </div>
          </div>
          <div className="h-64 rounded bg-paper-2" />
        </div>
      </div>
    </main>
  );
}
