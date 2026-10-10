'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { NavCardLink } from '@/components/layout/nav-card-link';

import { resolveRelatedPages, type RelatedPageHref } from '@/lib/config/related-links';

interface FAQItemProps {
  question: string;
  answer: string;
  related?: RelatedPageHref;
}

export function FAQItem({ question, answer, related }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const relatedPage = related ? resolveRelatedPages([related], true)[0] : undefined;

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
            {relatedPage ? (
              <div className="w-full pt-1 pr-2 pb-2 pl-1">
                <NavCardLink
                  description={relatedPage.description}
                  descriptionClassName="sm:truncate"
                  href={relatedPage.href}
                  icon={relatedPage.icon}
                  label={relatedPage.label}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
