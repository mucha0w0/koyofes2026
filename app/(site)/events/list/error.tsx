'use client';

import { CmsPageError } from '@/components/cms/cms-page-error';

interface EventListErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EventListError({ reset }: EventListErrorProps) {
  return (
    <CmsPageError
      message="イベント情報の読み込みに失敗しました。"
      reset={reset}
      subtitle="開催されるすべての企画をカテゴリやキーワードで検索できます"
      title="企画一覧・検索"
    />
  );
}
