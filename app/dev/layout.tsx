import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from 'next/font/google';

import type { Metadata } from 'next';

const zenKakuGothic = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-zen-kaku',
});

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-zen-maru',
});

export const metadata: Metadata = {
  title: 'DESIGN2 見本 | こうよう祭 2026',
  description: '1dearland リデザインの開発用見本。検索エンジンの対象外です。',
  robots: { index: false, follow: false },
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${zenKakuGothic.variable} ${zenMaruGothic.variable} min-h-screen bg-white`}>
      {children}
    </div>
  );
}
