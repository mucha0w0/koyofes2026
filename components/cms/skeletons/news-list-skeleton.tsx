export function NewsListSkeleton() {
  return (
    <div className="max-w-3xl animate-pulse space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-[#e6e9ed] p-6 space-y-3">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-5 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
