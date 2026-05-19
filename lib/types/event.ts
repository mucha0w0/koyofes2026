export interface EventTime {
  day1: string // "10:00-15:00" format
  day2: string
}

export interface EventImage {
  url: string
  alt: string
  caption?: string
}

export interface Event {
  id: string
  slug: string
  title: string
  icon: string // lucide icon name (e.g., "Music", "Utensils")
  images: EventImage[]
  organization: string
  location: string
  time: EventTime
  recommendedParticipants: string // e.g., "2-4人" or "グループ向け"
  description: string // markdown
  organizationDescription: string // markdown
  category: "exhibition" | "food" | "stage" | "performance" | "workshop"
}

export interface EventsData {
  events: Event[]
}
