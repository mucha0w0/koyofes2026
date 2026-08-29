import { ExternalLink } from 'lucide-react';
import { SiInstagram, SiX, SiYoutube } from 'react-icons/si';

import { PageLayout } from '@/components/page-layout';

const socialPlatforms = [
  {
    name: 'Instagram',
    icon: SiInstagram,
    handle: '@kouyousai2026',
    description: 'こうよう祭の準備風景や企画紹介、当日の様子などをお届けします。',
    buttonText: 'Instagramをフォロー',
    url: 'https://instagram.com/kouyousai2026',
  },
  {
    name: 'X (Twitter)',
    icon: SiX,
    handle: '@kouyousai2026',
    description: '当日のリアルタイム情報、混雑状況、緊急のお知らせなどをお届けします。',
    buttonText: 'Xをフォロー',
    url: 'https://twitter.com/kouyousai2026',
  },
  {
    name: 'YouTube',
    icon: SiYoutube,
    handle: 'こうよう祭公式チャンネル',
    description: 'ステージイベントのダイジェスト、企画紹介動画などを配信します。',
    buttonText: 'チャンネル登録',
    url: 'https://youtube.com/@kouyousai2026',
  },
];

export default function SocialPage() {
  return (
      <PageLayout subtitle="最新情報をSNSでチェック" title="公式SNS">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <div key={platform.name} className="bg-card p-8 space-y-6 text-center hover:bg-muted transition-colors">
                  <div className="flex justify-center">
                    <div className="bg-primary w-24 h-24 flex items-center justify-center">
                      <IconComponent className="h-12 w-12 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-foreground">{platform.name}</h3>
                    <p className="text-lg font-medium text-primary">{platform.handle}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{platform.description}</p>
                  </div>
                  <a
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity text-sm"
                    href={platform.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {platform.buttonText}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </PageLayout>
    );
}
