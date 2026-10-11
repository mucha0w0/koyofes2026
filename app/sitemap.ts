import type { MetadataRoute } from 'next';

import { SITE_ORIGIN } from '@/lib/config/site';
import { getEvents } from '@/lib/events';
import { getNews } from '@/lib/news';

const STATIC_PATHS = [
  '/',
  '/about/overview',
  '/about/theme',
  '/about/part',
  '/about/sponsor',
  '/events/list',
  '/events/recommended',
  '/events/timetable',
  '/guide/access',
  '/guide/map',
  '/guide/faq',
  '/guide/contact',
  '/official/news',
  '/official/pamphlet',
  '/stamp',
  '/ranking',
] as const;

function toUrl(path: string): string {
  return path === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, news] = await Promise.all([getEvents(), getNews()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: toUrl(path),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const eventEntries: MetadataRoute.Sitemap = events
    .filter((event) => event.slug)
    .map((event) => ({
      url: `${SITE_ORIGIN}/events/${encodeURIComponent(event.slug)}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  const newsEntries: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${SITE_ORIGIN}/official/news/${encodeURIComponent(item.id)}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticEntries, ...eventEntries, ...newsEntries];
}
