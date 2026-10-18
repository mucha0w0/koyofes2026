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
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-center text-2xl font-medium md:text-3xl" id="special-guest-heading">
            スペシャルゲスト
          </h2>

          <figure className="ink-shell w-full max-w-135 bg-card">
            <div className="overflow-hidden rounded-[calc(var(--radius)-var(--shell-stroke))]">
              <Image
                alt={GUEST_PORTRAIT.alt}
                className="h-auto w-full"
                height={GUEST_PORTRAIT.height}
                sizes="(min-width: 768px) 540px, calc(100vw - 32px)"
                src={GUEST_PORTRAIT.src}
                width={GUEST_PORTRAIT.width}
              />
            </div>
          </figure>

          <p className="text-center text-xl font-medium">サツマカワRPG</p>

          <div className="w-full max-w-135 rounded-md bg-paper-2 p-6">
            <p className="text-sm text-muted-foreground">
              マッシュルームヘアの髪型がトレードマーク。主にコントやピンネタを得意とし、ハイテンションかつ狂気や不条理を感じさせる独特な世界観のネタで高い評価を得ています。R-1グランプリでは2022年から3年連続で決勝に進出するなど、実力派ピン芸人として確固たる地位を築きました。
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              ピン芸としての活動に加え、芸人仲間のどんぐりたけし、Yes!アキトとともに「怪奇!YesどんぐりRPG」を結成。息の合ったギャグ連発のスタイルでM-1グランプリでも話題を集めました。
            </p>
          </div>

          <Button asChild className="px-8" size="lg">
            <Link href="/events/timetable" prefetch={false}>
              タイムテーブルを見る
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
