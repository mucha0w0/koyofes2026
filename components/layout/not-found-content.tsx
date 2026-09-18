import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function NotFoundContent() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 md:py-24">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8 md:mb-12">
          <p className="hero-display text-[80px] font-bold leading-none text-ink md:text-[120px]">404</p>
        </div>

        <div className="mb-8 md:mb-12">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">ページが見つかりませんでした</h1>
          <p className="text-base text-muted-foreground md:text-lg">
            申し訳ありません。お探しのページは存在しないか、
            <br className="hidden md:block" />
            削除されている可能性があります。
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild className="px-8 py-3" size="lg">
            <Link href="/">トップページに戻る</Link>
          </Button>
        </div>

        <div className="mt-16 pt-12 md:mt-24">
          <p className="text-sm text-muted-foreground">何か問題がある場合は、お問い合わせページよりご連絡ください。</p>
        </div>
      </div>
    </main>
  );
}
