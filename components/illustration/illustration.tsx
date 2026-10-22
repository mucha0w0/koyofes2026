import { cn } from '@/lib/utils';

/** 数値は px。文字列は CSS の長さ（`12rem`、`40%`、`clamp(...)`）として使う。 */
type CssLength = number | string;

/**
 * スマホは 148px。PC は 240px。
 * 右端は本文シェル（max-w-7xl の px-4）に揃える。描画の下には 36px 残す。
 * 透明余白は post.png（1024px 四方の右 32px・下 136px）に合わせてある。
 */
const DEFAULT_ILLUSTRATION_SIZE = 'clamp(148px, 20vw, 240px)';
const DEFAULT_BACKGROUND = 'var(--paper)';
const DRAWING_RIGHT_INSET = 32 / 1024;
const DRAWING_BOTTOM_INSET = 136 / 1024;

function contentEdgeRight(size: string): string {
  return `calc(max(1rem, (100vw - 80rem) / 2 + 1rem) - ${size} * ${DRAWING_RIGHT_INSET})`;
}

function footGapBottom(size: string): string {
  return `calc(36px - ${size} * ${DRAWING_BOTTOM_INSET})`;
}

function bandHeight(size: string): string {
  return `calc(${size} + 28px)`;
}

export type IllustrationProps = {
  /**
   * 挿絵。`public/Illustration` のファイル名（例: `post.png`）。
   * `/` または `http` で始まる場合は、そのパスをそのまま使う。
   */
  src: string;
  alt: string;
  /** 帯の背景色。省略時は薄い紙 `var(--paper)` */
  backgroundColor?: string;
  /** 帯の高さ。省略時は絵の高さ + 28px。幅は常にウィンドウ幅 */
  height?: CssLength;
  /** 画像の幅。省略時は高さに合わせて画像の比率を保つ */
  imageWidth?: CssLength;
  /**
   * 画像の高さ。省略時はスマホ 148px、PC は 240px。
   * 幅だけ指定したときは、その幅に合わせて比率を保つ。
   * 両方指定したときは、その枠に収まるよう比率を保つ。
   */
  imageHeight?: CssLength;
  /** 帯の上端から。指定すると、下端の初期値は使わない */
  top?: CssLength;
  /** 帯の右端から。省略時は本文シェルの内側の右端 */
  right?: CssLength;
  /** 帯の下端から。省略時は描画の下に 36px 残す */
  bottom?: CssLength;
  /** 帯の左端から。指定すると、右端の初期値は使わない */
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
 * ウィンドウ幅の帯の上に挿絵を置く。本文カラムの中に置いても、帯はウィンドウ幅まで広がる。
 * 位置と大きさを省略すると、本文シェルの右端・薄い紙・スマホ 148px が初期値になる。
 */
export function Illustration({
  src,
  alt,
  backgroundColor = DEFAULT_BACKGROUND,
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
  const size = toCssLength(imageHeight ?? imageWidth ?? DEFAULT_ILLUSTRATION_SIZE);
  const pinX = left !== undefined || right !== undefined;
  const pinY = top !== undefined || bottom !== undefined;

  return (
    <div
      className={cn('relative shrink-0 overflow-hidden', className)}
      style={{
        backgroundColor,
        height: toCssLength(height ?? bandHeight(size)),
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
        style={placedImageStyle({
          imageWidth,
          imageHeight: imageHeight ?? (imageWidth === undefined ? DEFAULT_ILLUSTRATION_SIZE : undefined),
          top,
          right: right ?? (pinX ? undefined : contentEdgeRight(size)),
          bottom: bottom ?? (pinY ? undefined : footGapBottom(size)),
          left,
        })}
        width={1}
      />
    </div>
  );
}
