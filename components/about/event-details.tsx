'use client';

export function EventDetails() {
  return (
    <div className="bg-muted p-6">
      <h3 className="font-medium text-lg mb-4">こうよう祭2026</h3>
      <dl className="grid gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">開催日</dt>
          <dd className="font-medium text-lg">2026年10月31日(土)・11月1日(日)</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">開催時間</dt>
          <dd className="font-medium text-lg">9:00 - 17:00</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">会場</dt>
          <dd className="font-medium">豊田高専</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">入場料</dt>
          <dd className="font-medium">無料</dd>
        </div>
      </dl>
    </div>
  );
}
