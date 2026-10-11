import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn('ink-shell bg-card text-card-foreground flex flex-col gap-6 overflow-visible rounded-[var(--radius)] py-6', className)}
      data-slot="card"
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6', className)}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('font-display leading-none font-medium', className)} data-slot="card-title" {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-muted-foreground text-sm', className)} data-slot="card-description" {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-6', className)} data-slot="card-content" {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
