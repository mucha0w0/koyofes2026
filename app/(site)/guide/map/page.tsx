import Image from 'next/image';

import { PageLayout } from '@/components/layout/page-layout';

import kounaizu from './kounaizu.jpg';

export default function MapPage() {
  return (
    <PageLayout
      related={{
        pages: ['/guide/access', '/guide/faq', '/official/pamphlet'],
        background: 'paper-2',
      }}
      subtitle="豊田高専の構内図です"
      title="会場マップ"
    >
      <figure className="ink-shell overflow-visible bg-card">
        <div className="overflow-hidden rounded-[calc(var(--radius)-var(--shell-stroke))]">
          <Image
            priority
            alt="豊田高専の構内図。正門、駐車場、各学科棟、講義棟、図書館、体育館、競技場などが記載されています。"
            className="h-auto w-full"
            sizes="(min-width: 1280px) 1248px, calc(100vw - 32px)"
            src={kounaizu}
          />
        </div>
      </figure>
    </PageLayout>
  );
}
