import type { RelatedPageHref } from '@/lib/config/related-links';

export interface Faq {
  category: string;
  question: string;
  answer: string;
  /** 回答本文のあとに出す関連ページ。未指定ならボタンなし */
  related?: RelatedPageHref;
}

export interface FaqGroup {
  category: string;
  items: Faq[];
}
