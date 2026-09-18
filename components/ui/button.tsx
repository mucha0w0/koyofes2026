import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-display text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink border-0",
  {
    variants: {
      variant: {
        default: 'bg-festival-accent text-festival-accent-soft hover:bg-festival-accent-hover',
        destructive: 'bg-mist text-ink hover:bg-mist-hover',
        outline: 'bg-mist text-ink hover:bg-mist-hover',
        secondary: 'bg-card text-ink hover:bg-mist-hover',
        ghost: 'bg-transparent text-ink underline-offset-[0.2em] hover:underline',
        link: 'bg-transparent text-ink underline underline-offset-[0.2em] hover:opacity-70',
      },
      size: {
        default: 'h-11 min-h-11 px-5 py-2 has-[>svg]:px-3',
        sm: 'h-11 min-h-11 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 min-h-11 px-6 has-[>svg]:px-4',
        icon: 'size-11',
        'icon-sm': 'size-11',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp className={cn(buttonVariants({ variant, size, className }))} data-slot="button" {...props} />;
}

export { Button, buttonVariants };
