import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/page-layout';

import { getEnabledOfficialSocials, getOfficialSocialIcon } from '@/lib/config/social';

function socialGridClass(count: number): string {
  if (count <= 1) {
    return 'mx-auto grid max-w-md grid-cols-1';
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
      <div className="mx-auto max-w-5xl">
        {platforms.length === 0 ? (
          <p className="text-center text-muted-foreground">公開中の公式SNSはありません。</p>
        ) : (
          <div className={`${socialGridClass(platforms.length)} gap-8`}>
            {platforms.map((platform) => {
              const IconComponent = getOfficialSocialIcon(platform.id);
              return (
                <div key={platform.id} className="ink-shell space-y-6 bg-card p-8 text-center">
                  <div className="flex justify-center">
                    <div className="flex size-24 items-center justify-center rounded-[var(--radius)] bg-mist">
                      <IconComponent className="h-12 w-12 text-ink" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-foreground">{platform.label}</h3>
                    <p className="text-lg font-medium text-ink">{platform.handle}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{platform.description}</p>
                  </div>
                  <Button asChild>
                    <a href={platform.url} rel="noopener noreferrer" target="_blank">
                      {platform.buttonText}
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
