"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

export function PageLayout({ 
  title, 
  subtitle, 
  children, 
  backHref = "/",
  backLabel = "トップページに戻る"
}: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-secondary to-background py-12 md:py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <Link 
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <h1 className="text-3xl md:text-4xl font-black">
            <span className="text-primary">{title.charAt(0)}</span>
            {title.slice(1)}
          </h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {children}
      </div>
    </main>
  )
}
