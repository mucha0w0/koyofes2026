import Link from 'next/link';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#e6e9ed]">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-24">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Display */}
          <div className="mb-8 md:mb-12">
            <p
              className="text-[80px] md:text-[120px] font-normal leading-none text-[#1f2529] mb-4"
              style={{ letterSpacing: '0.1em' }}
            >
              404
            </p>
          </div>

          {/* Message */}
          <div className="mb-8 md:mb-12">
            <h1
              className="text-3xl md:text-4xl font-normal text-[#1f2529] mb-4"
              style={{ letterSpacing: '0.05em', lineHeight: 1.35 }}
            >
              ページが見つかりませんでした
            </h1>
            <p className="text-base md:text-lg text-[#787b80]" style={{ lineHeight: 2.0, letterSpacing: '0.05em' }}>
              申し訳ありません。お探しのページは存在しないか、
              <br className="hidden md:block" />
              削除されている可能性があります。
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              className="inline-flex items-center justify-center px-8 py-3 bg-[#1f2529] text-white font-normal transition-all hover:opacity-90"
              href="/"
              style={{ letterSpacing: '0.05em' }}
            >
              トップページに戻る
            </Link>
          </div>

          {/* Decorative spacer */}
          <div className="mt-16 md:mt-24 pt-12 border-t border-[#bcbfc3]">
            <p className="text-sm text-[#bcbfc3]" style={{ letterSpacing: '0.05em' }}>
              何か問題がある場合は、お問い合わせページよりご連絡ください。
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
