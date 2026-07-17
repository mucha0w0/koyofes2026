import { Download } from 'lucide-react';

import { PageLayout } from '@/components/page-layout';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function PamphletPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout subtitle="こうよう祭2026公式パンフレット" title="パンフレット">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-card p-8 text-center">
            {/* PDFビューア */}
            <div className="w-full mb-6 aspect-[1/1.414]">
              <iframe
                className="w-full h-full"
                loading="lazy"
                src="/koyofes2026_pamphlet.pdf"
                style={{ border: 0 }}
                title="公式パンフレット PDF"
              />
            </div>
            <a
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity"
              href="/koyofes2026_pamphlet.pdf"
            >
              <Download className="h-5 w-5" />
              PDFをダウンロード
            </a>
          </div>

          <div className="bg-muted p-6">
            <h3 className="font-medium mb-4">当日配布について</h3>
            <p className="text-sm text-muted-foreground">
              当日は正門付近の本部にて、紙のパンフレットを無料配布いたします。
              数に限りがございますので、予めご了承ください。
            </p>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
