import { Download } from 'lucide-react';

import { Illustration } from '@/components/illustration/illustration';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';

export default function PamphletPage() {
  return (
    <PageLayout
      illustration={<Illustration alt="" src="news.png" />}
      related={{
        pages: ['/events/list', '/guide/map', '/guide/faq'],
        background: 'paper-2',
      }}
      subtitle="こうよう祭2026公式パンフレット"
      title="パンフレット"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="ink-shell bg-card p-8 text-center">
          {/* PDFビューア */}
          <div className="w-full mb-6 aspect-[1/1.414]">
            <iframe
              className="w-full h-full"
              loading="lazy"
              src="/pamf.pdf"
              style={{ border: 0 }}
              title="公式パンフレット PDF"
            />
          </div>
          <Button asChild className="px-6" size="lg">
            <a download href="/koyofes2026_pamphlet.pdf">
              <Download className="h-5 w-5" />
              PDFをダウンロード
            </a>
          </Button>
        </div>

        <div className="rounded-md bg-paper-2 p-6">
          <h3 className="font-medium mb-4">当日配布について</h3>
          <p className="text-sm text-muted-foreground">
            当日は、正門付近であらかじめ印刷したパンフレットを無料配布いたします。
            数に限りがございますので、予めご了承ください。
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
