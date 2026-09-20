import Image from 'next/image';

import { PageLayout } from '@/components/layout/page-layout';

export default function ThemePage() {
  return (
    <PageLayout subtitle="こうよう祭2026のテーマについて" title="テーマ">
      <div className="space-y-12">
        <figure className="ink-shell overflow-visible bg-card">
          <div className="overflow-hidden rounded-[calc(var(--radius)-var(--shell-stroke))]">
            <Image
              alt="こうよう祭 2026 テーマ 1dearland のコンセプトアート"
              className="h-auto w-full object-contain"
              height={295}
              priority
              sizes="(min-width: 1280px) 1248px, calc(100vw - 32px)"
              src="/conceptart.jpg"
              width={1178}
            />
          </div>
        </figure>

        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-medium">1dearland</h2>
            <p className="mt-3 text-sm text-muted-foreground">読み：ワンダーランド</p>
          </div>

          <div className="ink-shell bg-card p-8">
            <h3 className="mb-4 text-lg font-medium">テーマの由来</h3>
            <p className="leading-relaxed text-foreground">
              今年のテーマ 1dearland は、楽しいひとときを過ごす Wonderland（ワンダーランド）と、「みんなで１つに」という言葉遊びです。
            </p>
            <p className="mt-4 leading-relaxed text-foreground">
              タイトルの文字には、ひとつひとつ目がついています。来場する人も、出す人も、つくる人も、みんなで１つになる。字母を人に見立てたのは、その「みんな」を表すためです。
            </p>
          </div>

          <div className="ink-shell bg-card p-8">
            <h3 className="mb-4 text-lg font-medium">イラストに込めた思い</h3>
            <p className="leading-relaxed text-foreground">
              汽車が、雲の上の遊園地へ迎えに来ます。線路は中心へ巻き込まれ、機関車の時計はハートの針で正しい時刻がわかりません。時間を忘れて、この場所を楽しんでほしい——そんな願いが絵になっています。
            </p>
            <p className="mt-4 leading-relaxed text-foreground">
              絵の中には、こうよう祭と学校の記憶がいくつか仕込まれています。答えは書きません。探しながら見てもらえたら、と思います。
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
