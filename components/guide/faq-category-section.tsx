import { FAQItem } from './faq-item';

import { FaqGroup } from '@/lib/types/faq';
import { cn } from '@/lib/utils';

interface FAQCategorySectionProps {
  group: FaqGroup;
  background: 'paper' | 'paper-2';
}

export function FAQCategorySection({ group, background }: FAQCategorySectionProps) {
  return (
    <section
      className={cn('scroll-mt-24', background === 'paper-2' ? 'bg-paper-2' : 'bg-background')}
      id={group.category}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-2xl font-medium text-foreground">{group.category}</h2>
          <div className="flex flex-col gap-4">
            {group.items.map((faq, i) => (
              <FAQItem
                key={`${group.category}-${i}`}
                answer={faq.answer}
                question={faq.question}
                related={faq.related}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
