import type { RelatedPageHref } from '@/lib/config/related-links';

export interface Faq {
  category: string;
  question: string;
  answer: string;
  /** 本文のあとに出す箇条書き */
  points?: string[];
  /** 本文のあとに出す手順 */
  steps?: string[];
  /** 回答のあとに出す関連ページ。未指定ならカードなし */
  related?: RelatedPageHref[];
}

export interface FaqGroup {
  category: string;
  items: Faq[];
}
