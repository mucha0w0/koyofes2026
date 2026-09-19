import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const ARROW_ICONS = {
  left: ArrowLeft,
  right: ArrowRight,
} as const;

type InkTextLinkProps = ComponentProps<typeof Link> & {
  arrow?: keyof typeof ARROW_ICONS;
};

export function InkTextLink({ arrow = 'right', className, children, ...props }: InkTextLinkProps) {
  const Icon = ARROW_ICONS[arrow];

  return (
    <Link className={cn('ink-link inline-flex items-center gap-2 text-sm no-underline', className)} {...props}>
      {arrow === 'left' ? <Icon aria-hidden className="h-4 w-4" /> : null}
      {children}
      {arrow === 'right' ? <Icon aria-hidden className="h-4 w-4" /> : null}
    </Link>
  );
}
