import Image from 'next/image';

import { cn, isImageUrl, microCmsImageSrc } from '@/lib/utils';

type InkPhotoProps = {
  src?: string;
  alt: string;
  className?: string;
  size?: number;
  dimmed?: boolean;
};

export function InkPhoto({ src, alt, className, size = 64, dimmed = false }: InkPhotoProps) {
  const imageSrc = typeof src === 'string' && isImageUrl(src) ? src : null;
  const cmsSrc = imageSrc ? microCmsImageSrc(imageSrc, size * 2) : null;
  // カード内アイコンは ink-shell-sm。枠線と影は付けず、単体ボタン用の ink-shell は残す。
  const plain = className?.split(/\s+/).includes('ink-shell-sm') ?? false;

  return (
    <div
      className={cn(
        'relative shrink-0 bg-card',
        plain ? 'overflow-hidden rounded-[var(--radius)]' : 'ink-shell overflow-visible',
        dimmed && 'opacity-40 grayscale',
        className,
      )}
    >
      <div
        className={cn(
          'size-full overflow-hidden',
          plain ? 'rounded-[var(--radius)]' : 'rounded-[calc(var(--radius)-var(--shell-stroke))]',
        )}
      >
        {imageSrc ? (
          <Image
            alt={alt}
            className="size-full object-cover"
            height={size}
            loading="lazy"
            src={cmsSrc ?? imageSrc}
            unoptimized={cmsSrc !== null}
            width={size}
          />
        ) : (
          <span className="flex size-full items-center justify-center text-[10px] text-ink-soft">No image</span>
        )}
      </div>
    </div>
  );
}
