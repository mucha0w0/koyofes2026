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
      <CardContent className="flex items-start gap-4 p-4 sm:p-5">
        <InkPhoto
          alt={item.name}
          className="ink-shell-sm size-16 shrink-0 overflow-hidden"
          size={64}
          src={item.icon}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h3 className="truncate font-medium text-base leading-snug text-foreground sm:text-lg">{item.name}</h3>

            {item.social.length > 0 ? (
              <div className="flex flex-wrap gap-2 shrink-0">
                {item.social.map((link) => {
                  const SocialIcon = socialIcons[link.platform];
                  return (
                    <a
                      key={`${item.id}-${link.platform}`}
                      aria-label={`${item.name}の${link.label}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
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
            ) : null}
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
