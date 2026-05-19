import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageLayout } from "@/components/page-layout"
import { Camera } from "lucide-react"

const galleries = [
  { year: "2025", count: 120 },
  { year: "2024", count: 98 },
  { year: "2023", count: 85 },
]

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <PageLayout title="フォトギャラリー" subtitle="過去のこうよう祭の思い出">
        <div className="space-y-8">
          <div className="bg-card p-6 text-center">
            <Camera className="h-12 w-12 text-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              こうよう祭2026のフォトギャラリーは開催後に公開予定です
            </p>
          </div>

          <div>
            <h2 className="font-medium text-lg mb-4">過去のギャラリー</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {galleries.map((gallery) => (
                <div key={gallery.year} className="bg-card overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="aspect-video bg-secondary flex items-center justify-center">
                    <span className="text-4xl font-medium text-muted-foreground">{gallery.year}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">こうよう祭{gallery.year}</h3>
                    <p className="text-sm text-muted-foreground">{gallery.count}枚の写真</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  )
}
