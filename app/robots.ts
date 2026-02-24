import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://kamiui.com/sitemap.xml',
    host: 'https://kamiui.com',
  };
}
