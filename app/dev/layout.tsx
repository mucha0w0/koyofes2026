import { Mochiy_Pop_One, Zen_Maru_Gothic } from 'next/font/google';

import type { Metadata } from 'next';

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-zen-maru',
});

const mochiyPop = Mochiy_Pop_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mochiy-pop',
});

export const metadata: Metadata = {
  title: 'DESIGN2 見本 | こうよう祭 2026',
  description: '1dearland リデザインの開発用見本。検索エンジンの対象外です。',
  robots: { index: false, follow: false },
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${zenMaruGothic.variable} ${mochiyPop.variable} min-h-screen bg-white`}>{children}</div>
  );
}
