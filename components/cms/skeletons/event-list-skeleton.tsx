export function EventListSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-8">
      <div className="flex items-stretch gap-2">
        <div className="h-12 min-w-0 flex-1 rounded bg-paper-2" />
        <div className="h-12 w-12 shrink-0 rounded bg-paper-2" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-16 rounded bg-paper-2" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-9 w-20 rounded bg-paper-2" />
          ))}
        </div>
      </div>
      <div className="ink-shell h-20 bg-card" />
      <div className="h-4 w-32 rounded bg-paper-2" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="ink-shell bg-card p-6 space-y-3">
            <div className="flex gap-4">
              <div className="h-16 w-16 shrink-0 rounded bg-paper-2" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 rounded bg-paper-2" />
                <div className="h-4 w-1/3 rounded bg-paper-2" />
                <div className="h-4 w-full rounded bg-paper-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
