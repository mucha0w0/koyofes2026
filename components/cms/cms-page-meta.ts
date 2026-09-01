/** CMS 独立ページの title / subtitle / errorMessage を一元管理 */
export const cmsPageMeta = {
  eventList: {
    title: '企画一覧・検索',
    subtitle: '開催されるすべての企画をカテゴリやキーワードで検索できます',
    errorMessage: 'イベント情報の読み込みに失敗しました。',
  },
  eventDetail: {
    title: '企画詳細',
    errorMessage: '企画情報の読み込みに失敗しました。',
  },
  eventRecommended: {
    title: 'おすすめ企画',
    subtitle: '各パートリーダーがピックアップした、おすすめの企画です',
    errorMessage: 'おすすめ企画の読み込みに失敗しました。',
  },
  eventTimetable: {
    title: 'タイムテーブル',
    subtitle: '2日間のタイムテーブルです',
    errorMessage: 'タイムテーブルの読み込みに失敗しました。',
  },
  newsList: {
    title: 'お知らせ',
    subtitle: 'こうよう祭に関するお知らせ一覧',
    errorMessage: 'お知らせの読み込みに失敗しました。',
  },
  sponsor: {
    title: 'ご協賛',
    subtitle: 'こうよう祭をご支援いただいている企業・団体様',
    errorMessage: '協賛情報の読み込みに失敗しました。',
  },
  part: {
    title: 'パート',
    subtitle: 'こうよう祭を運営するパートのご紹介',
    errorMessage: 'パート情報の読み込みに失敗しました。',
  },
} as const;

export type CmsPageMetaKey = keyof typeof cmsPageMeta;
