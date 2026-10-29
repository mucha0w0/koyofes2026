import { Train, Bus, Car, MapPin } from 'lucide-react';

import { Illustration } from '@/components/illustration/illustration';
import { PageLayout } from '@/components/layout/page-layout';

export default function AccessPage() {
  return (
    <PageLayout
      illustration={<Illustration alt="" src="pin.png" />}
      related={{
        pages: ['/guide/map', '/guide/faq', '/official/pamphlet'],
        background: 'paper-2',
      }}
      subtitle="会場までのアクセス方法をご案内します"
      title="アクセス"
    >
      <div className="space-y-8">
        <div className="ink-shell bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-md p-2 bg-paper-2">
              <MapPin className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="font-medium text-lg">会場</h2>
          </div>
          <p className="text-lg font-medium">豊田高専</p>
          <p className="text-muted-foreground">〒471-0067 愛知県豊田市栄生町２丁目１−１</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="ink-shell bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-md p-2 bg-paper-2">
                <Train className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-medium">電車でお越しの方</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>名鉄「梅坪駅」より徒歩25分</li>
              <li>愛知環状鉄道「愛環梅坪駅」より徒歩21分</li>
            </ul>
          </div>

          <div className="ink-shell bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-md p-2 bg-paper-2">
                <Bus className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-medium">バスでお越しの方</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>上豊田駅・豊田市駅より、おいでんバスで約10分</li>
              <li>「西山公園」下車して徒歩9分</li>
            </ul>
          </div>

          <div className="ink-shell bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-md p-2 bg-paper-2">
                <Car className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-medium">お車でお越しの方</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>正門からの出入りはできません</li>
              <li>第１駐車場横の出入り口からお入りください</li>
              <li>
                詳しくは豊田高専公式ホームページをご覧ください。
                <a href="https://www.toyota-ct.ac.jp/life/gakuseikaigyouji/" rel="noopener noreferrer" target="_blank">
                  https://www.toyota-ct.ac.jp/life/gakuseikaigyouji/
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-md bg-paper-2 p-6">
          <h3 className="font-medium mb-4">地図（Google Maps）</h3>
          <div className="aspect-video">
            <iframe
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13056.517005433541!2d137.1309265!3d35.1034833!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60035ff6c15d45cf%3A0xd87866e720aee934!2z6LGK55Sw5bel5qWt6auY562J5bCC6ZaA5a2m5qCh!5e0!3m2!1sja!2sjp!4v1779592691840!5m2!1sja!2sjp"
              style={{ border: 0 }}
              title="Google マップ（豊田高専へのアクセス）"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
