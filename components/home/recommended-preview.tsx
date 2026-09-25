import { RecommendedPreviewClient } from './recommended-preview-client';

import { getRecommendedEvents, type RecommendedEvent } from '@/lib/recommended-events';

export async function RecommendedPreview() {
  let items: RecommendedEvent[] = [];

  try {
    items = await getRecommendedEvents();
  } catch (error) {
    console.error('おすすめ企画取得エラー:', error);
  }

  if (items.length === 0) {
    return null;
  }

  return <RecommendedPreviewClient items={items} />;
}
