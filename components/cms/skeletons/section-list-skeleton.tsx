export function SectionListSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-12">
      <div className="h-4 w-full rounded bg-paper-2" />
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-paper-2" />
            <div className="h-6 w-32 rounded bg-paper-2" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, itemIndex) => (
              <div key={itemIndex} className="h-20 rounded bg-paper-2" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
