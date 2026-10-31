import { Suspense } from 'react';

import { Spinner } from '@/components/common/spinner';
import { ExhibitionMaps } from '@/components/guide/exhibition-maps';
import { PageLayout } from '@/components/layout/page-layout';
import { RelatedLinks } from '@/components/layout/related-links';
import { StampBook } from '@/components/stamp/stamp-book';
import { StampSuggestions } from '@/components/stamp/stamp-suggestions';

import { isRankingEnabled } from '@/lib/config/rankingConfig';
import { getStampBoothGroups } from '@/lib/stamp/booths';

export const metadata = {
  title: 'スタンプラリー | こうよう祭 2026',
  description:
    'クラス・学科展・有志展示のデジタルスタンプラリー。スタンプ帳の確認とふくびき参加券の引き換えができます。',
};

export default async function StampPage() {
  const groups = await getStampBoothGroups();
  const rankingEnabled = isRankingEnabled();
  const booths = groups.flatMap((group) => group.booths);

  return (
    <PageLayout fullWidth subtitle="スタンプを集めてふくびきに参加" title="スタンプラリー">
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spinner className="size-6" />
          </div>
        }
      >
        <StampBook groups={groups} rankingEnabled={rankingEnabled} />
      </Suspense>
      <div className="mt-auto">
        <StampSuggestions booths={booths} />
        <section className="bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
            <h2 className="mb-6 text-xl font-medium md:text-2xl">展示マップ</h2>
            <ExhibitionMaps />
            <div className="mx-auto mt-12 max-w-3xl md:mt-16">
              <div className="rounded-md bg-paper-2 p-6">
                <h2 className="mb-4 text-lg font-medium">スタンプラリーがうまくたまらない方へ</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>スタンプがうまくたまらない場合は、お使いの端末に合わせて次の点を確認してください。</p>
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground">iPhoneの方</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Safariの「プライベート」モードをオフにして開いてください</li>
                      <li>
                        QRコードは毎回iPhoneの標準カメラで読み取ってください（LINEやInstagramなど、ほかのアプリ内で開くと記録が引き継がれません）
                      </li>
                      <li>「設定」→「Safari」→「すべてのCookieをブロック」をオフにしてください</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground">Androidの方</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Chromeの「シークレットモード」ではなく、通常のタブで開いてください</li>
                      <li>
                        QRコードは毎回同じ方法で読み取り、同じブラウザ（Chromeなど）で開いてください（LINEなどのアプリ内で開いたり、毎回違うブラウザで開いたりすると、記録が引き継がれません）
                      </li>
                      <li>
                        Chromeの「設定」→「サイトの設定」→「サードパーティCookie」で、Cookieをブロックする設定になっていないか確認してください
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <RelatedLinks background="paper-2" pages={['/events/list', '/ranking', '/events/recommended']} />
      </div>
    </PageLayout>
  );
}
