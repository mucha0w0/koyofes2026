'use client';

import { CmsPageError } from '@/components/cms/cms-page-error';

interface NewsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NewsError({ reset }: NewsErrorProps) {
  return (
    <CmsPageError
      message="お知らせの読み込みに失敗しました。"
      reset={reset}
      subtitle="こうよう祭に関するお知らせ一覧"
      title="お知らせ"
    />
  );
}
