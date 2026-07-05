import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EventMarkdown } from "@/components/event-markdown";
import { EventCarousel } from "@/components/event-carousel";
import { getEvents } from "@/lib/microcms";
import { Event } from "@/lib/types/event";
import { Clock, MapPin, Users, Building2} from "lucide-react";
import { isImageUrl } from "@/lib/utils";
import { SimpleSerch } from "@/components/Simple-serch";

// Convert time format from HHMMMM to HH:MM~HH:MM
function formatTimeDisplay(timeStr: string): string {
  if (!timeStr || timeStr.length !== 8) return timeStr;
  const startHour = timeStr.substring(0, 2);
  const startMin = timeStr.substring(2, 4);
  const endHour = timeStr.substring(4, 6);
  const endMin = timeStr.substring(6, 8);
  return `${startHour}:${startMin}~${endHour}:${endMin}`;
}

// Format location display with floor and classroom
function formatLocation(event: Event): {
  firstLine: string;
  secondLine?: string;
} {
  const firstLine = [event.location];
  if (event.floor) firstLine.push(event.floor);

  return {
    firstLine: firstLine.join(" "),
    secondLine: event.classroom,
  };
}

// Format participants display
function formatParticipants(event: Event): string {
  // Both empty/undefined = unlimited
  if (!event.participantsUL && !event.participantsLL) {
    return "制限なし";
  }

  // Only lower limit exists
  if (!event.participantsUL && event.participantsLL) {
    return `${event.participantsLL}人`;
  }

  // Only upper limit exists
  if (event.participantsUL && !event.participantsLL) {
    if (event.participantsUL >= 9999) {
      return "一般（制限なし）";
    }
    return `${event.participantsUL}人`;
  }

  // Both exist
  if (event.participantsUL >= 9999) {
    return "一般（制限なし）";
  }
  if (event.participantsUL === event.participantsLL) {
    return `${event.participantsLL}人`;
  }
  return `${event.participantsLL}-${event.participantsUL}人`;
}

// Format duration display
function formatDuration(minutes: number): string {
  if (minutes === 0) return "時間未定";
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}時間`;
  return `${hours}時間${mins}分`;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const events = await getEvents();
    const event = (events as Event[]).find((e) => e.slug === slug);
    return event || null;
  } catch (error) {
    console.error("イベント取得エラー:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    return (events as Event[]).map((event) => ({
      slug: event.slug,
    }));
  } catch (error) {
    console.error("静的パラメータ生成エラー:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "イベントが見つかりません",
    };
  }

  return {
    title: `${event.title} | こうよう祭`,
    description: event.catchphrase || event.description.split("\n")[0],
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const timeDay1 = formatTimeDisplay(event["time-day1"]);
  const timeDay2 = formatTimeDisplay(event["time-day2"]);
  const locationDisplay = formatLocation(event);
  const participantsDisplay = formatParticipants(event);
  const durationDisplay = formatDuration(event.duration);

  const isIconUrl = isImageUrl(event.icon);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Banner Carousel */}
        <EventCarousel images={event.images} title={event.title} />

        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Title Section with Catchphrase - Full Width */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-start gap-4 md:gap-8 mb-6">
              {/* Icon */}
              <div className="shrink-0 w-16 h-16 md:w-24 md:h-24 bg-muted flex items-center justify-center overflow-hidden">
                {isIconUrl ? (
                  <Image
                    src={event.icon}
                    alt={event.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">No icon</span>
                )}
              </div>

              {/* Title and Organization */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-2">
                  {event.title}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  {event.organization}
                </p>
              </div>
            </div>

            {/* Catchphrase */}
            <p className="text-lg md:text-xl font-medium text-foreground">
              {event.catchphrase}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Quick Info Cards - 4等分 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium">場所</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {locationDisplay.firstLine}
                    </p>
                    {locationDisplay.secondLine && (
                      <p className="text-sm font-medium text-foreground">
                        {locationDisplay.secondLine}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">時間</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">
                      {timeDay1}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {timeDay2}
                    </p>
                  </div>
                </div>

                <div className="bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium">人数</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {participantsDisplay}
                  </p>
                </div>

                <div className="bg-card p-4">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">所要時間</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {durationDisplay}
                  </p>
                </div>
              </div>

              {/* Event Description */}
              <section>
                <h2 className="text-2xl font-medium mb-6 text-foreground">
                  企画について
                </h2>
                <div className="prose max-w-none">
                  <EventMarkdown content={event.description} />
                </div>
                {/* Author Info - Desktop */}
                <div className="hidden lg:block mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    執筆者: {event.author}
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Organization Card */}
              <div className="bg-muted p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-foreground" />
                  <h3 className="text-lg font-medium text-foreground">
                    企画団体
                  </h3>
                </div>
                <p className="text-2xl font-medium text-foreground mb-6">
                  {event.organization}
                </p>

                <div className="prose max-w-none">
                  <EventMarkdown
                    content={event["organ-description"]}
                    className="text-sm"
                  />
                </div>

                {/* Author Info - Mobile/Tablet */}
                <div className="lg:hidden mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    執筆者: {event.author}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <SimpleSerch />
      </main>
      <SiteFooter />
    </>
  );
}
