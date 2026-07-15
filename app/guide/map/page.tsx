import Image from 'next/image';

import { PageLayout } from '@/components/page-layout';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';


import kounaizu from './kounaizu.jpg'; // ← インポート追加

export default function MapPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout subtitle="校内の各施設・企画の配置図です" title="会場マップ">
        <div className="space-y-8">
          <div className="bg-card p-6">
            <h2 className="font-medium text-lg mb-4">構内図</h2>
            <div className="bg-white overflow-hidden flex items-center justify-center">
              <Image alt="構内図" className="w-full h-auto" src={kounaizu} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-4">
              <h3 className="font-medium text-foreground mb-2">本館1階</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>受付・案内所</li>
                <li>1年生展示</li>
                <li>救護室</li>
              </ul>
            </div>
            <div className="bg-card p-4">
              <h3 className="font-medium text-foreground mb-2">本館2階</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>2年生展示</li>
                <li>休憩スペース</li>
              </ul>
            </div>
            <div className="bg-card p-4">
              <h3 className="font-medium text-foreground mb-2">本館3階</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>3年生展示</li>
                <li>お化け屋敷</li>
              </ul>
            </div>
            <div className="bg-card p-4">
              <h3 className="font-medium text-foreground mb-2">体育館</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>ステージイベント</li>
                <li>開閉会式</li>
              </ul>
            </div>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
