'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import type { FaqRelatedPage } from '@/lib/types/faq';

interface FAQItemProps {
  question: string;
  answer: string;
  related?: FaqRelatedPage;
}

export function FAQItem({ question, answer, related }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ink-shell bg-card px-6">
      <button
        aria-expanded={isOpen}
        className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="min-w-0 flex-1 text-base font-medium leading-normal text-foreground">{question}</span>
        <ChevronDown
          aria-hidden
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden" inert={!isOpen}>
          <div className="flex flex-col items-start gap-4 pb-5">
            <p className="text-base leading-relaxed whitespace-pre-line text-muted-foreground">{answer}</p>
            {related ? (
              <Button asChild variant="outline">
                <Link href={related.href}>{related.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
