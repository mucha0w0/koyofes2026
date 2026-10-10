'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
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
        <div className="overflow-hidden">
          <p className="pb-5 text-base leading-relaxed whitespace-pre-line text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}
