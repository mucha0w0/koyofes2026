import { Analytics } from '@vercel/analytics/next';
import { Josefin_Sans, Zen_Kaku_Gothic_New } from 'next/font/google';

import type { Metadata } from 'next';
import './globals.css';

const zenKakuGothic = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-zen-kaku',
});
const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-josefin',
});

export const metadata: Metadata = {
  title: 'こうよう祭 2026 | 公式ウェブサイト',
  description: '令和8年度 こうよう祭の公式ウェブサイトです。企画情報、来場案内など。',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={`${zenKakuGothic.variable} ${josefinSans.variable} bg-background`}
      lang="ja"
    >
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
