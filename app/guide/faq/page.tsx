import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "入場料はかかりますか？",
    answer: "入場料は無料です。どなたでもご来場いただけます。"
  },
  {
    question: "駐車場はありますか？",
    answer: "ございますが、数に限りがあります。できる限り公共交通機関のご利用をお願いいたします。"
  },
  {
    question: "雨天の場合は開催されますか？",
    answer: "雨天でも開催いたします。ただし、屋外企画や模擬店は中止となる場合があります。"
  },
  {
    question: "飲食物の持ち込みはできますか？",
    answer: "可能です。校内に飲食企画もございますので、ぜひご利用ください。"
  },
  {
    question: "ベビーカーの利用はできますか？",
    answer: "ご利用いただけます。階段のみのルートとなる場合があります。"
  },
  {
    question: "落とし物をした場合はどうすればよいですか？",
    answer: "正門付近の本部にて、落とし物の対応をしております。"
  },
]

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="よくある質問" subtitle="お問い合わせの多いご質問にお答えします">
        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-card overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted transition-colors">
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
