export function EventListSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-8">
      <div className="h-12 w-full rounded bg-muted" />
      <div className="space-y-3">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-9 w-20 rounded bg-muted" />
          ))}
        </div>
      </div>
      <div className="h-12 w-full rounded bg-muted" />
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-[#e6e9ed] p-6 space-y-3">
            <div className="flex gap-4">
              <div className="h-16 w-16 shrink-0 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
