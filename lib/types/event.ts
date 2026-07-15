export interface Event {
  slug: string;
  title: string;
  catchphrase: string;
  icon: string; // lucide icon name (e.g., "Music", "Utensils")
  images: string[]; // URLs only
  organization: string;
  location: string;
  floor: string;
  classroom: string;
  'time-day1': string; // "10001600" format (HHMMMM)
  'time-day2': string; // "10001600" format (HHMMMM)
  duration: number; // minutes
  participantsUL: number; // upper limit
  participantsLL: number; // lower limit
  description: string; // markdown
  'organ-description': string; // markdown
  author: string;
  category: 'class-exhibit' | 'volunteer-exhibit' | 'booth' | 'stage' | 'food-truck';
}

export interface EventsData {
  events: Event[];
}
