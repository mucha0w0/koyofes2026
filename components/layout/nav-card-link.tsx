import Link from 'next/link';

import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface NavCardLinkProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** 説明文の折り返し。関連ページは sm 以上、トップの列は常に 1 行 */
  descriptionClassName?: string;
}

export function NavCardLink({ href, label, description, icon: Icon, descriptionClassName }: NavCardLinkProps) {
  return (
    <Link className="ink-shell ink-lift group flex items-center gap-4 bg-card p-4" href={href} prefetch={false}>
      <div className="shrink-0 rounded-md bg-paper-2 p-2">
        <Icon aria-hidden className="h-5 w-5 text-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium">{label}</span>
        <p className={cn('text-xs text-muted-foreground', descriptionClassName)}>{description}</p>
      </div>
    </Link>
  );
}
