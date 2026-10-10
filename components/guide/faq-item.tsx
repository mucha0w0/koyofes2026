'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import { NavCardLink } from '@/components/layout/nav-card-link';

import { resolveRelatedPages, type RelatedPageHref } from '@/lib/config/related-links';

interface FAQItemProps {
  question: string;
  answer: string;
  points?: string[];
  steps?: string[];
  related?: RelatedPageHref[];
}

export function FAQItem({ question, answer, points = [], steps = [], related = [] }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();
  const relatedPages = resolveRelatedPages(related);
  const paragraphs = answer.split(/\n\n/).filter((paragraph) => paragraph.length > 0);

  return (
    <div className="ink-shell bg-card px-6">
      <button
        aria-controls={answerId}
        aria-expanded={isOpen}
        className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="min-w-0 flex-1 text-base font-medium leading-relaxed text-foreground">{question}</span>
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
          <div className="flex flex-col items-start gap-4 pb-5" id={answerId}>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {steps.length > 0 ? (
                <ol className="list-decimal space-y-2 pl-5">
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ) : null}
              {points.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5">
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            {relatedPages.length > 0 ? (
              <ul className="flex w-full flex-col gap-4 pt-1 pr-2 pb-2 pl-1">
                {relatedPages.map((page) => (
                  <li key={page.href}>
                    <NavCardLink
                      description={page.description}
                      descriptionClassName="sm:truncate"
                      href={page.href}
                      icon={page.icon}
                      label={page.label}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
