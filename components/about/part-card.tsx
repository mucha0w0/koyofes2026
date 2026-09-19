import { ExternalLink } from 'lucide-react';
import { SiInstagram, SiX, SiYoutube } from 'react-icons/si';

import { Card, CardContent } from '@/components/ui/card';
import { InkPhoto } from '@/components/ui/ink-photo';

import type { PartItem, SocialPlatform } from '@/lib/types/part';

const socialIcons: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  instagram: SiInstagram,
  twitter: SiX,
  youtube: SiYoutube,
};

interface PartCardProps {
  item: PartItem;
}

export function PartCard({ item }: PartCardProps) {
  return (
    <Card className="py-0">
      <CardContent className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-4 sm:p-5 sm:gap-y-2">
        <div className="row-start-1 col-start-1 mt-0.5 size-12 shrink-0 sm:row-span-2 sm:size-14">
          <InkPhoto alt={item.name} className="ink-shell-sm size-full" size={56} src={item.icon} />
        </div>

        <div className="row-start-1 col-start-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 min-w-0">
          <h3 className="font-medium text-base sm:text-lg text-foreground leading-snug">{item.name}</h3>

          {item.social.length > 0 && (
            <div className="flex flex-wrap gap-2 shrink-0">
              {item.social.map((link) => {
                const SocialIcon = socialIcons[link.platform];
                return (
                  <a
                    key={`${item.id}-${link.platform}`}
                    aria-label={`${item.name}の${link.label}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    href={link.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SocialIcon className="h-3.5 w-3.5" />
                    {link.handle ?? link.label}
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <p className="row-start-2 col-start-1 col-span-2 sm:col-start-2 sm:col-span-1 text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}
