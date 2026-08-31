import { Building2, Mic2, ShoppingBag, Truck, Users } from 'lucide-react';

import type { Event } from '@/lib/types/event';
import type { StampSourceCategory } from '@/lib/types/stamp';

import type { LucideIcon } from 'lucide-react';

export const EVENT_CATEGORY_ICONS = {
  'class-exhibit': Building2,
  'volunteer-exhibit': Users,
  booth: ShoppingBag,
  stage: Mic2,
  'food-truck': Truck,
} as const satisfies Record<Event['category'], LucideIcon>;

export const STAMP_CATEGORY_ICONS = {
  'class-exhibit': EVENT_CATEGORY_ICONS['class-exhibit'],
  'volunteer-exhibit': EVENT_CATEGORY_ICONS['volunteer-exhibit'],
} as const satisfies Record<StampSourceCategory, LucideIcon>;

export function getEventCategoryIcon(category: Event['category']): LucideIcon {
  return EVENT_CATEGORY_ICONS[category];
}

export function getStampCategoryIcon(category: StampSourceCategory): LucideIcon {
  return STAMP_CATEGORY_ICONS[category];
}
