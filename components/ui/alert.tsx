import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'ink-shell relative flex w-full items-start gap-3 bg-card p-6 text-sm text-foreground',
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div className={cn(alertVariants({ variant }), className)} data-slot="alert" role="alert" {...props}>
      <span
        aria-hidden
        className={cn(
          'mt-[0.45em] size-2 shrink-0 rounded-[4px]',
          variant === 'destructive' ? 'bg-destructive' : 'bg-ink',
        )}
      />
      <div className="grid min-w-0 flex-1 justify-items-start gap-1">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('font-display text-muted-foreground line-clamp-1 min-h-4 font-medium', className)}
      data-slot="alert-title"
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-foreground grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
      data-slot="alert-description"
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
