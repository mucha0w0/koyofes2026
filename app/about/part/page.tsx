import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageLayout } from '@/components/page-layout';
import { PartCard } from '@/components/part-card';
import { getPartSections } from '@/lib/parts';
import type { PartSection } from '@/lib/types/part';

export const revalidate = 60;

export default async function PartPage() {
  let sections: PartSection[] = [];
  let error: string | null = null;

  try {
    sections = await getPartSections();
  } catch (err) {
    error = err instanceof Error ? err.message : 'パート情報の取得に失敗しました';
    console.error('パート取得エラー:', err);
  }

  return (
    <>
      <SiteHeader />
      <PageLayout title="パート" subtitle="こうよう祭を運営するパートのご紹介">
        {error ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-muted-foreground">パート情報はまだ登録されていません。</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`section-${section.id}`}>
                <div className="mb-5">
                  <p id={`section-${section.id}`} className="label-en text-sm text-muted-foreground">
                    {section.labelEn}
                  </p>
                  <h2 className="font-medium text-xl mt-1">{section.label}</h2>
                </div>

                <div className="flex flex-col gap-3">
                  {section.items.map((item) => (
                    <PartCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  );
}
