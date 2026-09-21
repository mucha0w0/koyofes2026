import { FAQItem } from './faq-item';

import { FaqGroup } from '@/lib/types/faq';

interface FAQCategorySectionProps {
  group: FaqGroup;
}

export function FAQCategorySection({ group }: FAQCategorySectionProps) {
  return (
    <section className="scroll-mt-24 space-y-6" id={group.category}>
      <h2 className="text-2xl font-medium text-foreground">{group.category}</h2>
      <div className="flex flex-col gap-4">
        {group.items.map((faq, i) => (
          <FAQItem key={`${group.category}-${i}`} answer={faq.answer} question={faq.question} />
        ))}
      </div>
    </section>
  );
}
