import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { SponsorCard } from "@/components/sponsor-card"
import { getSponsorSections } from "@/lib/sponsors"
import type { SponsorSection } from "@/lib/types/sponsor"

export const revalidate = 60

export default async function SponsorPage() {
  let sections: SponsorSection[] = []
  let error: string | null = null

  try {
    sections = await getSponsorSections()
  } catch (err) {
    error = err instanceof Error ? err.message : "協賛情報の取得に失敗しました"
    console.error("協賛取得エラー:", err)
  }

  return (
    <>
      <SiteHeader />
      <PageLayout title="ご協賛" subtitle="こうよう祭をご支援いただいている企業・団体様">
        {error ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            <p className="text-muted-foreground leading-relaxed">
              こうよう祭の開催にあたり、多くの企業・団体様にご協賛いただいております。
              心より感謝申し上げます。
            </p>

            {sections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  協賛企業・団体はまだ登録されていません。
                </p>
              </div>
            ) : (
              sections.map((section) => (
                <section key={section.id} aria-labelledby={`section-${section.id}`}>
                  <div className="mb-5">
                    <p
                      id={`section-${section.id}`}
                      className="label-en text-sm text-muted-foreground"
                    >
                      {section.labelEn}
                    </p>
                    <h2 className="font-medium text-xl mt-1">{section.label}</h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {section.items.map((item) => (
                      <SponsorCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ))
            )}

            <div className="bg-muted p-6">
              <h2 className="font-medium text-lg mb-4">協賛のお願い</h2>
              <p className="text-muted-foreground mb-4">
                こうよう祭では、協賛いただける企業・団体様を募集しております。
                ご興味のある方は、お問い合わせフォームよりご連絡ください。
              </p>
              <Link
                href="/about/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity text-sm"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  )
}
