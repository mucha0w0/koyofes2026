import Image from 'next/image';
import Link from 'next/link';

export function NotFoundContent() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 md:py-24">
      <div className="w-full max-w-2xl text-center">
        <div className="relative mx-auto mb-8 h-24 w-full max-w-md overflow-hidden">
          <Image fill alt="" className="object-cover object-center" src="/conceptart.jpg" />
        </div>

        <p className="hero-display mb-8 text-[80px] font-bold leading-none text-ink md:mb-12 md:text-[120px]">404</p>

        <div className="mb-8 md:mb-12">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">ページが見つかりませんでした</h1>
          <p className="text-base text-muted-foreground md:text-lg">
            申し訳ありません。お探しのページは存在しないか、
            <br className="hidden md:block" />
            削除されている可能性があります。
          </p>
        </div>

        <Link className="ink-shell ink-lift inline-flex min-h-11 items-center bg-festival-accent px-8 text-sm font-medium text-festival-accent-soft hover:bg-festival-accent-hover" href="/">
          トップページに戻る
        </Link>
      </div>
    </main>
  );
}
