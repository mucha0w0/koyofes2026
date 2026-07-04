import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { FAQCategoryNav } from "@/components/faq-category-nav"
import { FAQCategorySection } from "@/components/faq-category-section"
import { groupFaqsByCategory } from "@/lib/utils/groupFaqsByCategory"
import faqData from "@/lib/faqs.json"
import { Faq } from "@/lib/types/faq"

export default function FAQPage() {
  const faqGroups = groupFaqsByCategory(faqData as Faq[]);
  const categories = faqGroups.map((group) => group.category);

  return (
    <>
      <SiteHeader />
      <PageLayout title="よくある質問" subtitle="お問い合わせの多いご質問にお答えします">
        <div className="max-w-3xl">
          <FAQCategoryNav categories={categories} />
          <div className="space-y-12">
            {faqGroups.map((group) => (
              <FAQCategorySection key={group.category} group={group} />
            ))}
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}