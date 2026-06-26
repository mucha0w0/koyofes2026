import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { FAQItem } from "@/components/ui/faq-item"
import faqData from "@/lib/faqs.json";

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="よくある質問" subtitle="お問い合わせの多いご質問にお答えします">
        <div className="space-y-4 max-w-3xl">
          {faqData.map((faq, i) => (  // faqs → faqData に変更
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}