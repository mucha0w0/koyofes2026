import { FAQCategoryNav } from '@/components/guide/faq-category-nav';
import { FAQCategorySection } from '@/components/guide/faq-category-section';
import { PageLayout } from '@/components/layout/page-layout';

import faqData from '@/lib/faqs.json';
import { groupFaqsByCategory } from '@/lib/utils/groupFaqsByCategory';

export default function FAQPage() {
  const faqGroups = groupFaqsByCategory(faqData);
  const categories = faqGroups.map((group) => group.category);

  return (
    <PageLayout
      related={{
        pages: ['/about/overview', '/official/news', '/official/pamphlet'],
        background: 'paper-2',
      }}
      subtitle="お問い合わせの多いご質問にお答えします"
      title="よくある質問"
    >
      <div className="mx-auto max-w-3xl space-y-12 md:space-y-16">
        <FAQCategoryNav categories={categories} />
        {faqGroups.map((group) => (
          <FAQCategorySection key={group.category} group={group} />
        ))}
      </div>
    </PageLayout>
  );
}
