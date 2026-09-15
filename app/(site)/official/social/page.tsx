import { ExternalLink } from 'lucide-react';

import { PageLayout } from '@/components/layout/page-layout';

import { getEnabledOfficialSocials, getOfficialSocialIcon } from '@/lib/config/social';

function socialGridClass(count: number): string {
  if (count <= 1) {
    return 'grid grid-cols-1 max-w-md mx-auto';
  }
  if (count === 2) {
    return 'grid grid-cols-1 md:grid-cols-2';
  }
  return 'grid grid-cols-1 md:grid-cols-3';
}

export default function SocialPage() {
  const platforms = getEnabledOfficialSocials();

  return (
    <PageLayout subtitle="最新情報をSNSでチェック" title="公式SNS">
      <div className="max-w-5xl mx-auto">
        {platforms.length === 0 ? (
          <p className="text-center text-muted-foreground">公開中の公式SNSはありません。</p>
        ) : (
          <div className={`${socialGridClass(platforms.length)} gap-8`}>
            {platforms.map((platform) => {
              const IconComponent = getOfficialSocialIcon(platform.id);
              return (
                <div key={platform.id} className="bg-card p-8 space-y-6 text-center hover:bg-muted transition-colors">
                  <div className="flex justify-center">
                    <div className="bg-primary w-24 h-24 flex items-center justify-center">
                      <IconComponent className="h-12 w-12 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-foreground">{platform.label}</h3>
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
        )}
      </div>
    </PageLayout>
  );
}
