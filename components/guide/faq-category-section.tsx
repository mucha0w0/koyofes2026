import { FAQItem } from './faq-item';

import { FaqGroup } from '@/lib/types/faq';

interface FAQCategorySectionProps {
  group: FaqGroup;
}

export const FAQCategorySection: React.FC<FAQCategorySectionProps> = ({ group }) => {
  return (
    <section className="scroll-mt-40 pt-16 mb-16 last:mb-0" id={group.category}>
      <h2 className="text-2xl font-medium text-foreground mb-8 pb-4">
        {group.category}
      </h2>

      {/* è³ªåã¢ã¤ãE EEAQItemEãEãªã¹ãE*/}
      <div className="flex flex-col gap-2">
        {group.items.map((faq, i) => (
          <FAQItem key={i} answer={faq.answer} question={faq.question} />
        ))}
      </div>
    </section>
  );
};
