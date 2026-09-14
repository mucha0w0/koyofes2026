'use client';

import { ArrowRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';

const SEARCH_LIST_PATH = '/events/list';

type EventSearchVariant = 'prominent' | 'compact';

type EventSearchBarProps = {
  variant?: EventSearchVariant;
  className?: string;
};

export function EventSearchBar({ variant = 'compact', className }: EventSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    router.push(`${SEARCH_LIST_PATH}?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isProminent = variant === 'prominent';

  const input = (
    <div className={cn('relative', isProminent ? 'w-full' : 'flex-1')}>
      <Search
        className={cn(
          'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground',
          isProminent ? 'left-4' : 'left-3 sm:left-4',
        )}
      />
      <input
        className={cn(
          'w-full bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-colors',
          isProminent ? 'pl-12 pr-4 py-4' : 'h-12 pl-10 sm:pl-12 pr-10 text-sm sm:text-base',
        )}
        placeholder="企画名、キーワードで検索..."
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {searchQuery && (
        <button
          aria-label="検索キーワードをクリア"
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground',
            isProminent ? 'right-4' : 'right-3',
          )}
          onClick={() => setSearchQuery('')}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  const button = (
    <button
      className={cn(
        'bg-foreground text-background font-medium hover:opacity-80 cursor-pointer transition-opacity whitespace-nowrap',
        isProminent ? 'px-8 py-3' : 'h-12 px-4 sm:px-8 text-sm sm:text-base',
      )}
      onClick={handleSearch}
    >
      検索する
    </button>
  );

  if (isProminent) {
    return (
      <div className={cn('max-w-3xl mx-auto', className)}>
        <div className="mb-6">{input}</div>
        <div className="flex justify-center">{button}</div>
      </div>
    );
  }

  return (
    <div className={cn('max-w-3xl mx-auto flex flex-row items-stretch gap-2 sm:gap-3', className)}>
      {input}
      {button}
    </div>
  );
}

type EventSearchSectionProps = {
  variant?: EventSearchVariant;
  /** Default: false for prominent, true for compact */
  showViewAllLink?: boolean;
};

export function EventSearchSection({ variant = 'prominent', showViewAllLink }: EventSearchSectionProps) {
  const isProminent = variant === 'prominent';
  const viewAllLink = showViewAllLink ?? !isProminent;

  return (
    <section className={cn('bg-muted', isProminent ? 'py-12 md:py-16' : 'py-10 md:py-16')}>
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl">
          <div className={cn('mb-8 text-center', !isProminent && 'flex flex-col gap-2')}>
            <h2
              className={cn(
                'font-medium',
                isProminent ? 'text-2xl md:text-3xl mb-2' : 'text-xl md:text-2xl tracking-tight',
              )}
            >
              企画を探す
            </h2>
            {isProminent && <p className="text-muted-foreground">キーワードやカテゴリから企画を検索</p>}
          </div>

          <EventSearchBar variant={variant} />

          {viewAllLink && (
            <div className="mt-6 text-center">
              <Link
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                href={SEARCH_LIST_PATH}
              >
                すべての企画を見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
