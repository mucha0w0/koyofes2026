import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  const showRange = 1;

  for (let i = 1; i <= totalPages; i++) {
    const isFirstOrLast = i === 1 || i === totalPages;
    const isNearCurrent = Math.abs(i - currentPage) <= showRange;

    if (isFirstOrLast || isNearCurrent) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return pages;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="ページネーション" className="mt-8 flex items-center justify-center gap-2">
      <Link
        aria-disabled={currentPage === 1}
        aria-label="前のページへ"
        className={`flex size-11 items-center justify-center ${
          currentPage === 1 ? 'pointer-events-none text-muted-foreground/40' : 'ink-link'
        }`}
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
        prefetch={false}
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      {pageNumbers.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex size-11 items-center justify-center text-sm text-muted-foreground/60"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-pressed={page === currentPage}
            className={`ink-shell ink-lift flex size-11 items-center justify-center text-sm font-medium ${
              page === currentPage ? 'bg-card' : 'bg-mist'
            }`}
            href={`${basePath}?page=${page}`}
            prefetch={false}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        aria-disabled={currentPage === totalPages}
        aria-label="次のページへ"
        className={`flex size-11 items-center justify-center ${
          currentPage === totalPages ? 'pointer-events-none text-muted-foreground/40' : 'ink-link'
        }`}
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
        prefetch={false}
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
