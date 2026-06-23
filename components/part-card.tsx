import Image from "next/image"
import { Instagram, Twitter, Youtube, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getLucideIcon } from "@/lib/lucide-icons"
import type { PartItem, SocialPlatform } from "@/lib/types/part"

const socialIcons: Record<SocialPlatform, typeof Instagram> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
}

interface PartCardProps {
  item: PartItem
}

export function PartCard({ item }: PartCardProps) {
  const IconComponent = getLucideIcon(item.icon)
  const isIconUrl =
    item.icon.startsWith("http://") || item.icon.startsWith("https://") || item.icon.startsWith("/")

  return (
    <Card className="py-0">
      <CardContent className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-4 sm:p-5 sm:gap-y-2">
        <div className="row-start-1 col-start-1 sm:row-span-2 w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-muted flex items-center justify-center overflow-hidden mt-0.5">
          {isIconUrl ? (
            <Image
              src={item.icon}
              alt={item.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : IconComponent ? (
            <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-foreground" />
          ) : (
            <span className="text-xs text-muted-foreground">No icon</span>
          )}
        </div>

        <div className="row-start-1 col-start-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 min-w-0">
          <h3 className="font-medium text-base sm:text-lg text-foreground leading-snug">
            {item.name}
          </h3>

          {item.social.length > 0 && (
            <div className="flex flex-wrap gap-2 shrink-0">
              {item.social.map((link) => {
                const SocialIcon = socialIcons[link.platform]
                return (
                  <a
                    key={`${item.id}-${link.platform}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`${item.name}の${link.label}`}
                  >
                    <SocialIcon className="h-3.5 w-3.5" />
                    {link.handle ?? link.label}
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <p className="row-start-2 col-start-1 col-span-2 sm:col-start-2 sm:col-span-1 text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </CardContent>
    </Card>
  )
}
