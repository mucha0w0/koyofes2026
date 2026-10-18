import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/** 宣材を、顔が主役になるようトリミング。元画像: https://natalie.mu/owarai/artist/100932 */
const GUEST_PORTRAIT = {
  src: '/guests/satsumakawa-rpg-portrait.jpg',
  alt: 'サツマカワRPG',
  width: 1320,
  height: 1111,
} as const;

export function SpecialGuestSection() {
  return (
    <section aria-labelledby="special-guest-heading" className="bg-paper py-16 md:py-24" data-palette="orange">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">スペシャルゲスト</p>
          <h2 className="mt-2 text-4xl md:text-5xl" id="special-guest-heading">
            このひとがくるよ！
          </h2>
        </div>

        <figure className="ink-shell mx-auto mt-8 w-full max-w-2xl bg-card">
          <div className="overflow-hidden rounded-[calc(var(--radius)-var(--shell-stroke))]">
            <Image
              alt={GUEST_PORTRAIT.alt}
              className="h-auto w-full"
              height={GUEST_PORTRAIT.height}
              sizes="(min-width: 768px) 672px, calc(100vw - 32px)"
              src={GUEST_PORTRAIT.src}
              width={GUEST_PORTRAIT.width}
            />
          </div>
        </figure>

        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="font-display text-3xl font-medium md:text-4xl">サツマカワRPG</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            メインステージ
            <br />
            2026年10月31日（土）・11月1日（日）
            <br />
            開始時刻はタイムテーブルで案内します
          </p>
          <div className="mt-8">
            <Button asChild className="px-8" size="lg">
              <Link href="/events/timetable" prefetch={false}>
                タイムテーブルを見る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
