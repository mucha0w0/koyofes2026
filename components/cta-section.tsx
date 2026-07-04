import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-medium text-primary mb-4">企画一覧へ</h2>
        <p className="text-muted-foreground mb-8">他の企画もチェックしましょう</p>
        
        <a href="/events/list"
          className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-muted font-medium hover:opacity-80 transition-opacity"
        >
          企画を探す
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}