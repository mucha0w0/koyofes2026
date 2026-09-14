import { StampRallyPreviewClient } from './stamp-rally-preview-client';

import { getStampBooths } from '@/lib/stamp/booths';

export async function StampRallyPreview() {
  let booths: Awaited<ReturnType<typeof getStampBooths>> = [];

  try {
    booths = await getStampBooths();
  } catch (error) {
    console.error('スタンプ対象ブース取得エラー:', error);
  }

  return <StampRallyPreviewClient booths={booths} />;
}
