export function NewsDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-paper-2" />
      <div className="rounded-md bg-card p-8 space-y-4">
        <div className="h-4 w-24 rounded bg-paper-2" />
        <div className="h-6 w-3/4 rounded bg-paper-2" />
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full rounded bg-paper-2" />
          <div className="h-4 w-full rounded bg-paper-2" />
          <div className="h-4 w-2/3 rounded bg-paper-2" />
        </div>
      </div>
    </div>
  );
}
