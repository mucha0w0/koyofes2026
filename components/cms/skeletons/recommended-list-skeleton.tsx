export function RecommendedListSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-4 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded bg-paper-2" />
            <div className="h-4 w-24 rounded bg-paper-2" />
          </div>
          <div className="h-4 w-full rounded bg-paper-2" />
          <div className="flex items-center gap-4 bg-paper-2 p-4">
            <div className="h-16 w-16 shrink-0 rounded bg-background" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-2/3 rounded bg-background" />
              <div className="h-4 w-full rounded bg-background" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
