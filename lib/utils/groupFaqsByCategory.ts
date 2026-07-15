import { Faq, FaqGroup } from '@/lib/types/faq';

export function groupFaqsByCategory(faqs: Faq[]): FaqGroup[] {
  const groups: FaqGroup[] = [];

  for (const faq of faqs) {
    const existingGroup = groups.find((g) => g.category === faq.category);
    if (existingGroup) {
      existingGroup.items.push(faq);
    } else {
      groups.push({ category: faq.category, items: [faq] });
    }
  }

  return groups;
}
