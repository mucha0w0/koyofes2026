'use client';

import { HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const helpBodyClassName = [
  'min-h-0 overflow-y-auto overscroll-contain',
  'space-y-3 text-base leading-relaxed text-ink-soft',
  '[&_a]:text-ink [&_a]:underline [&_a]:underline-offset-[0.2em]',
  '[&_h2]:font-display [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-ink',
  '[&_h3]:font-display [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-ink',
  '[&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5',
  '[&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5',
  '[&_strong]:font-medium [&_strong]:text-ink',
].join(' ');

interface HelpButtonProps {
  /** モーダルの見出し */
  title: string;
  /** モーダルに表示する説明 */
  children: ReactNode;
  /** 見出しの下に出す短いリード */
  description?: string;
  className?: string;
}

/**
 * ページ本文を増やさずに説明を出すアイコン。
 * 押すとモーダルが開き、children を説明として表示する。
 */
export function HelpButton({ title, children, description, className }: HelpButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label={`${title}の説明`}
          className={cn(
            'inline-flex size-11 items-center justify-center rounded-(--radius) text-ink-soft outline-none transition-colors hover:bg-mist-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink',
            className,
          )}
          type="button"
        >
          <HelpCircle aria-hidden className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[min(90dvh,40rem)] flex-col gap-5 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle className="font-display text-xl leading-snug font-medium">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-left text-sm leading-relaxed text-ink-soft">
              {description}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}の説明</DialogDescription>
          )}
        </DialogHeader>
        <div className={helpBodyClassName}>{children}</div>
        <DialogFooter className="shrink-0">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" type="button" variant="secondary">
              閉じる
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
