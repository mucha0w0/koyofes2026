import { FAQItem } from "@/components/ui/faq-item";
import { FaqGroup } from "@/lib/types/faq";

interface FAQCategorySectionProps {
  group: FaqGroup;
}

export const FAQCategorySection: React.FC<FAQCategorySectionProps> = ({ group }) => {
  return (
    <section id={group.category} className="scroll-mt-24">
      <h2 className="text-xl font-bold mb-2 pb-2 border-b-2 border-primary">
        {group.category}
      </h2>
      <div>
        {group.items.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};