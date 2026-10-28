'use client';

import { ExternalLink } from 'lucide-react';
import { SiInstagram, SiX, SiYoutube } from 'react-icons/si';

import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InkPhoto } from '@/components/ui/ink-photo';

import type { PartItem, SocialPlatform } from '@/lib/types/part';

import { cn } from '@/lib/utils';

const socialIcons: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  instagram: SiInstagram,
  twitter: SiX,
  youtube: SiYoutube,
};

interface PartCardProps {
  item: PartItem;
}

function PartSocialLinks({ item, className }: { item: PartItem; className?: string }) {
  if (item.social.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
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
  );
}

export function PartCard({ item }: PartCardProps) {
  return (
    <Dialog>
      <Card className="ink-lift relative py-0">
        <DialogTrigger
          aria-label={`${item.name}の紹介を全文表示`}
          className="absolute inset-0 cursor-pointer rounded-(--radius) focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
          type="button"
        />

        <CardContent className="pointer-events-none flex items-start gap-4 p-4 sm:p-5">
          <InkPhoto
            alt={item.name}
            className="ink-shell-sm size-16 shrink-0 overflow-hidden"
            size={64}
            src={item.icon}
          />

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-4">
              <h3 className="min-w-0 truncate font-medium text-base leading-snug text-foreground sm:text-lg">
                {item.name}
              </h3>
              <PartSocialLinks className="pointer-events-auto relative shrink-0" item={item} />
            </div>

            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        </CardContent>
      </Card>

      <DialogContent className="flex max-h-[min(90dvh,40rem)] flex-col gap-5 overflow-hidden">
        <DialogHeader className="shrink-0 text-left">
          <div className="flex items-start gap-4 pr-8">
            <InkPhoto
              alt={item.name}
              className="ink-shell-sm size-16 shrink-0 overflow-hidden"
              size={64}
              src={item.icon}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <DialogTitle className="font-display text-xl leading-snug font-medium">{item.name}</DialogTitle>
              <PartSocialLinks item={item} />
            </div>
          </div>
          <DialogDescription className="sr-only">{item.name}の紹介</DialogDescription>
        </DialogHeader>

        <p className="min-h-0 overflow-y-auto text-base leading-relaxed whitespace-pre-line text-ink-soft">
          {item.description}
        </p>
      </DialogContent>
    </Dialog>
  );
}
