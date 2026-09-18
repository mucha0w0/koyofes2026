'use client';

import Link from 'next/link';

import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';

interface CmsPageErrorProps {
  title: string;
  subtitle?: string;
  message?: string;
  reset: () => void;
}

export function CmsPageError({
  title,
  subtitle,
  message = '情報の読み込みに失敗しました。時間をおいて再度お試しください。',
  reset,
}: CmsPageErrorProps) {
  return (
    <PageLayout subtitle={subtitle} title={title}>
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-base text-muted-foreground">{message}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button className="px-8" size="lg" onClick={reset}>
            再読み込み
          </Button>
          <Button asChild className="px-8" size="lg" variant="outline">
            <Link href="/">トップページに戻る</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
