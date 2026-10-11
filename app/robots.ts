import type { MetadataRoute } from 'next';

import { SITE_ORIGIN } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/stamp/collect', '/stamp/reset'],
    },
  };
}
