import Image from 'next/image';

const EXHIBITION_MAPS = [
  {
    src: '/kounaizu/tenji-kounai.webp',
    width: 4320,
    height: 2430,
    title: '校内の展示',
    alt: '校内の展示地図。講義棟の1階から3階、新講義棟、一般管理棟、学生玄関と、各展示の番号と名前が描かれています。',
  },
  {
    src: '/kounaizu/tenji-soto.webp',
    width: 4320,
    height: 2430,
    title: '屋外の展示',
    alt: '屋外の展示地図。低層棟、図書館、専攻科棟、福利施設、グラウンド周辺の展示位置が描かれています。',
  },
] as const;

/** 展示地図PDFから書き出した校内・屋外マップ */
export function ExhibitionMaps() {
  return (
    <div className="space-y-8">
      {EXHIBITION_MAPS.map((map) => (
        <figure key={map.src} className="space-y-3">
          <figcaption className="text-lg font-medium">{map.title}</figcaption>
          <div className="ink-shell overflow-visible bg-card">
            <div className="overflow-hidden rounded-[calc(var(--radius)-var(--shell-stroke))]">
              <Image
                unoptimized
                alt={map.alt}
                className="h-auto w-full"
                height={map.height}
                sizes="(min-width: 1280px) 1248px, calc(100vw - 32px)"
                src={map.src}
                width={map.width}
              />
            </div>
          </div>
        </figure>
      ))}
    </div>
  );
}
