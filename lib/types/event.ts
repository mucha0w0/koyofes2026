/** microCMS events.category の許容値（単一の正とする） */
export const EVENT_CATEGORIES = ['class-exhibit', 'volunteer-exhibit', 'booth', 'stage', 'food-truck'] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const DEFAULT_EVENT_CATEGORY: EventCategory = 'booth';

const EVENT_CATEGORY_SET = new Set<string>(EVENT_CATEGORIES);

export function isEventCategory(value: string): value is EventCategory {
  return EVENT_CATEGORY_SET.has(value);
}

/** microCMS の category（string[]）を EventCategory に正規化する */
export function parseEventCategory(raw: string | string[] | undefined, context?: { slug?: string }): EventCategory {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value && isEventCategory(value)) {
    return value;
  }
  if (value) {
    console.warn(
      `[parseEventCategory] Unknown category ${JSON.stringify(value)}` +
        (context?.slug ? ` (slug=${context.slug})` : ''),
    );
  }
  return DEFAULT_EVENT_CATEGORY;
}

export interface Event {
  slug: string;
  title: string;
  catchphrase: string;
  icon: string; // image URL or empty
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
  category: EventCategory;
}
