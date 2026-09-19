export function NewsListSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="ink-shell bg-card p-6 space-y-3">
          <div className="h-4 w-24 rounded bg-paper-2" />
          <div className="h-5 w-3/4 rounded bg-paper-2" />
          <div className="h-4 w-full rounded bg-paper-2" />
        </div>
      ))}
    </div>
  );
}
