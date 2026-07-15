import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // 例: "/official/news"
}

// 表示するページ番号と省略記号の配列を生成
function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  const showRange = 1; // 現在ページの前後に表示する件数

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
    <nav aria-label="ページネーション" className="flex items-center justify-center gap-2 mt-8">
      <Link
        aria-disabled={currentPage === 1}
        aria-label="前のページへ"
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          currentPage === 1 ? 'pointer-events-none text-muted-foreground/40' : 'text-foreground hover:opacity-70'
        }`}
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      {pageNumbers.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground/60"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-colors ${
              page === currentPage ? 'bg-primary text-primary-foreground' : 'text-foreground hover:opacity-70'
            }`}
            href={`${basePath}?page=${page}`}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        aria-disabled={currentPage === totalPages}
        aria-label="次のページへ"
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? 'pointer-events-none text-muted-foreground/40'
            : 'text-foreground hover:opacity-70'
        }`}
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
