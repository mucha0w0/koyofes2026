import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string // 例: "/official/news"
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="ページネーション">
      <Link
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
        aria-disabled={currentPage === 1}
        aria-label="前のページへ"
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          currentPage === 1
            ? "pointer-events-none text-muted-foreground/40"
            : "text-foreground hover:opacity-70"
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={`${basePath}?page=${pageNum}`}
          className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-colors ${
            pageNum === currentPage
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:opacity-70"
          }`}
        >
          {pageNum}
        </Link>
      ))}

      <Link
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
        aria-disabled={currentPage === totalPages}
        aria-label="次のページへ"
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "pointer-events-none text-muted-foreground/40"
            : "text-foreground hover:opacity-70"
        }`}
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}