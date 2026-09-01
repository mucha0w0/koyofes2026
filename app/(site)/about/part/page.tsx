import { PartCard } from '@/components/about/part-card';
import { CmsPageLayout } from '@/components/cms/cms-page-layout';

import { getPartSections } from '@/lib/parts';

export default async function PartPage() {
  const sections = await getPartSections();

  return (
    <CmsPageLayout meta="part">
      {sections.length === 0 ? (
        <div className="mx-auto max-w-4xl py-12 text-center">
          <p className="text-muted-foreground">パート情報はまだ登録されていません。</p>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-12">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <div className="mb-5">
                <p className="label-en text-sm text-muted-foreground" id={`section-${section.id}`}>
                  {section.labelEn}
                </p>
                <h2 className="mt-1 text-xl font-medium">{section.label}</h2>
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
    </CmsPageLayout>
  );
}
