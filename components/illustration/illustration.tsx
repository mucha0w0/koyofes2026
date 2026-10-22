import { cn } from '@/lib/utils';

/** 数値は px。文字列は CSS の長さ（`12rem`、`40%`、`clamp(...)`）として使う。 */
type CssLength = number | string;

export type IllustrationProps = {
  /**
   * 挿絵。`public/Illustration` のファイル名（例: `post.png`）。
   * `/` または `http` で始まる場合は、そのパスをそのまま使う。
   */
  src: string;
  alt: string;
  /** 帯の背景色。`#c7e1e8` や `var(--paper-sky)` などの CSS カラー */
  backgroundColor: string;
  /** 帯の高さ。幅は常にウィンドウ幅 */
  height: CssLength;
  /** 画像の幅。省略時は高さに合わせて画像の比率を保つ */
  imageWidth?: CssLength;
  /**
   * 画像の高さ。省略時は幅に合わせて画像の比率を保つ。
   * 幅も高さも省略したときは、帯の高さに合わせる。
   * 両方指定したときは、その枠に収まるよう比率を保つ。
   */
  imageHeight?: CssLength;
  /** 帯の上端から。省略した上下方向は中央に揃う */
  top?: CssLength;
  /** 帯の右端から。省略した左右方向は中央に揃う */
  right?: CssLength;
  /** 帯の下端から */
  bottom?: CssLength;
  /** 帯の左端から */
  left?: CssLength;
  className?: string;
  /** 最初の画面に置くとき、読み込みを優先する */
  priority?: boolean;
};

function toCssLength(value: CssLength): string {
  return typeof value === 'number' ? `${value}px` : value;
}

function illustrationSrc(src: string): string {
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  return `/Illustration/${src}`;
}

function placedImageStyle({
  imageWidth,
  imageHeight,
  top,
  right,
  bottom,
  left,
}: Pick<IllustrationProps, 'imageWidth' | 'imageHeight' | 'top' | 'right' | 'bottom' | 'left'>): React.CSSProperties {
  const pinX = left !== undefined || right !== undefined;
  const pinY = top !== undefined || bottom !== undefined;
  const transform = [pinX ? null : 'translateX(-50%)', pinY ? null : 'translateY(-50%)']
    .filter((part) => part !== null)
    .join(' ');

  return {
    position: 'absolute',
    width: imageWidth !== undefined ? toCssLength(imageWidth) : 'auto',
    height: imageHeight !== undefined ? toCssLength(imageHeight) : imageWidth !== undefined ? 'auto' : '100%',
    maxWidth: 'none',
    objectFit: 'contain',
    top: top !== undefined ? toCssLength(top) : pinY ? undefined : '50%',
    right: right !== undefined ? toCssLength(right) : undefined,
    bottom: bottom !== undefined ? toCssLength(bottom) : undefined,
    left: left !== undefined ? toCssLength(left) : pinX ? undefined : '50%',
    transform: transform || undefined,
    // width/height 属性の比より、読み込み後の画像本来の比を使う
    aspectRatio: 'auto',
  };
}

/**
 * ウィンドウ幅の帯の上に、挿絵を任意の大きさ・位置で置く。
 * 本文カラムの中に置いても、帯はウィンドウ幅まで広がる。
 */
export function Illustration({
  src,
  alt,
  backgroundColor,
  height,
  imageWidth,
  imageHeight,
  top,
  right,
  bottom,
  left,
  className,
  priority = false,
}: IllustrationProps) {
  return (
    <div
      className={cn('relative shrink-0 overflow-hidden', className)}
      style={{
        backgroundColor,
        height: toCssLength(height),
        width: '100vw',
        maxWidth: 'none',
        marginLeft: 'calc(50% - 50vw)',
      }}
    >
      {/* width / height は検査用。表示サイズは style。幅か高さの片方だけを CSS の長さで指定し、画像本来の比率を保つ */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt}
        decoding="async"
        draggable={false}
        fetchPriority={priority ? 'high' : 'auto'}
        height={1}
        loading={priority ? 'eager' : 'lazy'}
        src={illustrationSrc(src)}
        style={placedImageStyle({ imageWidth, imageHeight, top, right, bottom, left })}
        width={1}
      />
    </div>
  );
}
