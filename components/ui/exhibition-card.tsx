import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/lib/types/event";

const genreLabels: Record<string, string> = {
  "class-exhibit": "クラス・学科展",
  "volunteer-exhibit": "有志展示",
  booth: "模擬店",
  stage: "ステージ",
  "food-truck": "キッチンカー",
};

interface ExhibitionCardProps {
  event: Event;
}

export function ExhibitionCard({ event }: ExhibitionCardProps) {
  const isIconUrl =
    event.icon &&
    (event.icon.startsWith("http://") || event.icon.startsWith("https://"));

  const rawLine = event.catchphrase?.split("\n")[0] ?? "";
  const displayCatchphrase =
    rawLine.length > 40 ? rawLine.substring(0, 40) + "..." : rawLine;

  return (
<Link href={`/events/${event.slug}`} className="block">
  <Card className="hover:bg-muted transition-colors cursor-pointer py-0">
        <CardContent className="flex gap-4 p-6">
          {/* アイコン */}
          <div className="w-16 h-16 bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            {isIconUrl ? (
              <Image
                src={event.icon}
                alt={event.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No image</span>
            )}
          </div>

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-lg">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {event.organization}
            </p>
            {displayCatchphrase && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {displayCatchphrase}
              </p>
            )}
            <div className="flex gap-3 mt-3 flex-wrap text-xs">
              <span className="px-2 py-1 bg-muted text-foreground">
                {genreLabels[event.category] || event.category}
              </span>
              <span className="px-2 py-1 bg-muted text-foreground">
                {event.location}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
