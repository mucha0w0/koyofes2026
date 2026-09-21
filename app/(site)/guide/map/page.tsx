import { CampusMapFigure } from '@/components/guide/campus-map-figure';
import { MapAreaList } from '@/components/guide/map-area-list';
import { MapFacilityList } from '@/components/guide/map-facility-list';
import { MapSectionNav } from '@/components/guide/map-section-nav';
import { PageLayout } from '@/components/layout/page-layout';

import kounaizu from './kounaizu.jpg';

import { CAMPUS_MAP_ALT, CAMPUS_MAP_LEGEND, MAP_STATUS_NOTE } from '@/lib/config/venue-map';

export default function MapPage() {
  return (
    <PageLayout
      related={{
        pages: ['/guide/access', '/guide/faq', '/official/pamphlet'],
        background: 'paper-2',
      }}
      subtitle="校内の施設とエリアの案内です"
      title="会場マップ"
    >
      <div className="space-y-12 md:space-y-16">
        <div className="space-y-6">
          <div className="rounded-md bg-paper-2 p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">{MAP_STATUS_NOTE}</p>
          </div>
          <MapSectionNav />
        </div>

        <section className="scroll-mt-24 space-y-6" id="campus-map">
          <h2 className="text-2xl font-medium text-foreground">構内図</h2>
          <CampusMapFigure alt={CAMPUS_MAP_ALT} src={kounaizu} />
          <ul className="space-y-1 text-sm text-muted-foreground">
            {CAMPUS_MAP_LEGEND.map((item) => (
              <li key={item.id}>
                {item.mark}：{item.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="scroll-mt-24 space-y-6" id="facilities">
          <div>
            <h2 className="text-2xl font-medium text-foreground">主要施設</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              受付や救護など、当日必要な場所です。決まっていない項目は調整中と表示しています。
            </p>
          </div>
          <MapFacilityList />
        </section>

        <section className="scroll-mt-24 space-y-6" id="areas">
          <div>
            <h2 className="text-2xl font-medium text-foreground">エリア</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              構内図に掲載されている建物と屋外です。こうよう祭での用途が決まり次第、各カードを更新します。
            </p>
          </div>
          <MapAreaList />
        </section>
      </div>
    </PageLayout>
  );
}
