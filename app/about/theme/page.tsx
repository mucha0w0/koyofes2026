import { PageLayout } from '@/components/page-layout';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';


export default function ThemePage() {
  return (
    <>
      <SiteHeader />
      <PageLayout subtitle="こうよう祭2026のテーマについて" title="テーマ">
        <div className="space-y-8 max-w-3xl mx-auto text-center">
          <div className="py-12">
            <h2 className="hero-display text-3xl md:text-4xl mb-4">1dearland</h2>
            <p className="text-xl text-muted-foreground"></p>
          </div>

          <div className="bg-card p-8 text-left">
            <h3 className="font-medium text-lg mb-4">テーマに込めた想い</h3>
            <p className="text-muted-foreground leading-relaxed">ああああああああああああああああ</p>
            <p className="text-muted-foreground leading-relaxed mt-4">あああああああああ。</p>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
