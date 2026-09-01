import { Mail, Phone, MapPin } from 'lucide-react';

import { PageLayout } from '@/components/layout/page-layout';

export default function ContactPage() {
  return (
      <PageLayout subtitle="ãè³ªåã»ãè¦æã¯ãã¡ããã" title="ãåãåãã">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card p-6">
              <h2 className="font-medium text-lg mb-4">é£çµ¡åï¼å­¦çèª²å­¦çæ¯æ´ä¿ï¼</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ã¡ã¼ã«</p>
                    <p className="font-medium">gakuseiâtoyota-ct.ac.jp ï¼âãã¼ã¯ã@ã«å¤ãã¦éä¿¡ï¼</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted">
                    <Phone className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">é»è©±</p>
                    <p className="font-medium">0565-36-5913</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted">
                    <MapPin className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ä½æ</p>
                    <p className="font-medium">ã471-0067 æç¥çè±ç°å¸æ ççºï¼ä¸ç®ï¼âï¼</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6">
              <p className="text-sm text-muted-foreground">
                ãåãåããã¸ã®åç­ã«ã¯æ°æ¥ããã ãå ´åããããã¾ãã ããããè³ªåããç¢ºèªãã ããã
              </p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
}
