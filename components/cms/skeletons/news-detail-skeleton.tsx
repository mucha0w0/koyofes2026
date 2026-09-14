export function NewsDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="rounded-lg border border-[#e6e9ed] p-8 space-y-4">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
