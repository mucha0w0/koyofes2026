import Image from 'next/image';

import { cn, isImageUrl } from '@/lib/utils';

type InkPhotoProps = {
  src?: string;
  alt: string;
  className?: string;
  size?: number;
  dimmed?: boolean;
};

export function InkPhoto({ src, alt, className, size = 64, dimmed = false }: InkPhotoProps) {
  const imageSrc = typeof src === 'string' && isImageUrl(src) ? src : null;

  return (
    <div className={cn('ink-shell relative shrink-0 overflow-visible bg-card', dimmed && 'opacity-40 grayscale', className)}>
      <div className="size-full overflow-hidden rounded-[calc(var(--radius)-var(--shell-stroke))]">
        {imageSrc ? (
          <Image alt={alt} className="size-full object-cover" height={size} src={imageSrc} width={size} />
        ) : (
          <span className="flex size-full items-center justify-center text-[10px] text-ink-soft">No image</span>
        )}
      </div>
    </div>
  );
}
