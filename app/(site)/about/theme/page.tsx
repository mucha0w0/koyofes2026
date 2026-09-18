import Image from 'next/image';

import { PageLayout } from '@/components/layout/page-layout';

export default function ThemePage() {
  return (
    <PageLayout subtitle="こうよう祭2026のテーマについて" title="テーマ">
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="overflow-hidden">
          <Image
            alt="1dearland"
            className="h-auto w-full"
            height={295}
            priority
            src="/conceptart.jpg"
            width={1178}
          />
        </div>

        <div className="py-4 text-center">
          <h2 className="hero-display text-3xl md:text-4xl mb-4">1dearland</h2>
          <p className="text-xl text-muted-foreground"></p>
        </div>

        <div className="rounded-md bg-card p-8 text-left">
          <h3 className="font-medium text-lg mb-4">テーマに込めた想い</h3>
          <p className="text-muted-foreground leading-relaxed">ああああああああああああああああ</p>
          <p className="text-muted-foreground leading-relaxed mt-4">あああああああああ。</p>
        </div>
      </div>
    </PageLayout>
  );
}
