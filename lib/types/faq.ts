/** 回答本文のあとに出す、関連ページへのボタン。未指定ならボタンなし */
export interface FaqRelatedPage {
  href: string;
  label: string;
}

export interface Faq {
  category: string;
  question: string;
  answer: string;
  related?: FaqRelatedPage;
}

export interface FaqGroup {
  category: string;
  items: Faq[];
}
