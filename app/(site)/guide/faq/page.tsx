import { FAQCategoryNav } from '@/components/guide/faq-category-nav';
import { FAQCategorySection } from '@/components/guide/faq-category-section';
import { PageLayout } from '@/components/layout/page-layout';

import faqData from '@/lib/faqs.json';
import { groupFaqsByCategory } from '@/lib/utils/groupFaqsByCategory';

export default function FAQPage() {
  const faqGroups = groupFaqsByCategory(faqData);
  const categories = faqGroups.map((group) => group.category);
  const lastBandIsPaper2 = faqGroups.length % 2 === 0;

  return (
    <PageLayout
      fullWidth
      related={{
        pages: ['/guide/contact', '/official/news', '/official/pamphlet'],
        background: lastBandIsPaper2 ? 'paper' : 'paper-2',
      }}
      subtitle="来場前によくあるご質問をまとめました"
      title="よくある質問"
    >
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 md:pt-12">
        <div className="mx-auto max-w-3xl space-y-6 pb-2">
          <FAQCategoryNav categories={categories} />
          <p className="text-sm leading-relaxed text-muted-foreground">
            場所が調整中の案内は、決まり次第、会場マップなどに掲載します。ここにないご質問は、お問い合わせへご連絡ください。
          </p>
        </div>
      </div>
      {faqGroups.map((group, index) => (
        <FAQCategorySection
          key={group.category}
          background={index % 2 === 0 ? 'paper' : 'paper-2'}
          group={group}
        />
      ))}
    </PageLayout>
  );
}
