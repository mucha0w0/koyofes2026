export function TimetableSkeleton() {
  return (
    <div className="animate-pulse space-y-20">
      {Array.from({ length: 2 }).map((_, dayIndex) => (
        <div key={dayIndex} className="space-y-8">
          <div className="h-7 w-16 rounded bg-paper-2" />
          <div className="flex gap-4">
            <div className="w-12 shrink-0 space-y-14">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-3 w-8 rounded bg-paper-2" />
              ))}
            </div>
            <div className="relative flex-1 space-y-3" style={{ height: '2880px' }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 h-[112px] rounded bg-paper-2"
                  style={{ top: `${index * 280}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
