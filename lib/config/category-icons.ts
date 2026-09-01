import { EVENT_CATEGORY_CONFIG, getEventCategoryIcon } from '@/lib/config/event-categories';

import type { Event } from '@/lib/types/event';
import type { StampSourceCategory } from '@/lib/types/stamp';

import type { LucideIcon } from 'lucide-react';

export { getEventCategoryIcon };

export const EVENT_CATEGORY_ICONS = {
  'class-exhibit': EVENT_CATEGORY_CONFIG['class-exhibit'].icon,
  'volunteer-exhibit': EVENT_CATEGORY_CONFIG['volunteer-exhibit'].icon,
  booth: EVENT_CATEGORY_CONFIG.booth.icon,
  stage: EVENT_CATEGORY_CONFIG.stage.icon,
  'food-truck': EVENT_CATEGORY_CONFIG['food-truck'].icon,
} as const satisfies Record<Event['category'], LucideIcon>;

export const STAMP_CATEGORY_ICONS = {
  'class-exhibit': EVENT_CATEGORY_ICONS['class-exhibit'],
  'volunteer-exhibit': EVENT_CATEGORY_ICONS['volunteer-exhibit'],
} as const satisfies Record<StampSourceCategory, LucideIcon>;

export function getStampCategoryIcon(category: StampSourceCategory): LucideIcon {
  return STAMP_CATEGORY_ICONS[category];
}
