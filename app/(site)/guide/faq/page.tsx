import { FAQCategoryNav } from '@/components/guide/faq-category-nav';
import { FAQCategorySection } from '@/components/guide/faq-category-section';
import { PageLayout } from '@/components/layout/page-layout';

import faqData from '@/lib/faqs.json';
import { groupFaqsByCategory } from '@/lib/utils/groupFaqsByCategory';

export default function FAQPage() {
  const faqGroups = groupFaqsByCategory(faqData);
  const categories = faqGroups.map((group) => group.category);

  return (
      <PageLayout subtitle="お問い合わせの多いご質問にお答えします" title="よくある質問">
        <div className="max-w-3xl">
          <FAQCategoryNav categories={categories} />
          <div className="space-y-12">
            {faqGroups.map((group) => (
              <FAQCategorySection key={group.category} group={group} />
            ))}
          </div>
        </div>
      </PageLayout>
    );
}
