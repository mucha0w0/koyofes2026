import { EventListSkeleton } from '@/components/cms/skeletons/event-list-skeleton';
import { PageLayout } from '@/components/layout/page-layout';

export default function EventListLoading() {
  return (
    <PageLayout subtitle="開催されるすべての企画をカテゴリやキーワードで検索できます" title="企画一覧・検索">
      <EventListSkeleton />
    </PageLayout>
  );
}
