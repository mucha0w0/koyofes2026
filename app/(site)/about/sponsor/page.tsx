import Link from 'next/link';

import { SponsorCard } from '@/components/about/sponsor-card';
import { CmsPageLayout } from '@/components/cms/cms-page-layout';

import { getSponsorSections } from '@/lib/sponsors';

export default async function SponsorPage() {
  const sections = await getSponsorSections();

  return (
    <CmsPageLayout
      meta="sponsor"
      related={{
        pages: ['/events/list', '/about/overview', '/official/pamphlet'],
        background: 'paper-2',
      }}
    >
      <div className="mx-auto max-w-4xl space-y-12">
        <p className="text-muted-foreground leading-relaxed">
          こうよう祭の開催にあたり、多くの企業・団体様にご協賛いただいております。 心より感謝申し上げます。
        </p>

        {sections.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">協賛企業・団体はまだ登録されていません。</p>
          </div>
        ) : (
          sections.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <div className="mb-5">
                <p className="label-en text-sm text-muted-foreground" id={`section-${section.id}`}>
                  {section.labelEn}
                </p>
                <h2 className="mt-1 text-xl font-medium">{section.label}</h2>
              </div>

              <div className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <SponsorCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))
        )}

        <div className="rounded-md bg-paper-2 p-6">
          <h2 className="mb-4 text-lg font-medium">協賛のお願い</h2>
          <p className="text-muted-foreground">
            こうよう祭では、協賛いただける企業・団体様を募集しております。
            ご興味のある方は、<Link className="text-ink underline underline-offset-[0.2em] outline-none hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink" href="/guide/contact">お問い合わせフォーム</Link>よりご連絡ください。
          </p>
        </div>
      </div>
    </CmsPageLayout>
  );
}
