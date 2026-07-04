import { FAQItem } from "@/components/ui/faq-item";
import { FaqGroup } from "@/lib/types/faq";

interface FAQCategorySectionProps {
  group: FaqGroup;
}

export const FAQCategorySection: React.FC<FAQCategorySectionProps> = ({ group }) => {
  return (
    <section id={group.category} className="scroll-mt-40 pt-16 mb-16 last:mb-0">
      <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-8 pb-4 border-b border-border/60">
        {group.category}
      </h2>
      
      {/* 質問アイテム（FAQItem）のリスト */}
      <div className="flex flex-col gap-2">
        {group.items.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};