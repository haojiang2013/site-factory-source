import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `https://${host}/sitemap.xml`,
  };
}
