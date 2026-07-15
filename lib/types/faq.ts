export interface Faq {
  category: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  category: string;
  items: Faq[];
}
