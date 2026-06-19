import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getAllEntries } from '@/lib/page-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  // Detect which domain is requesting the sitemap
  const heads = headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');

  const allPages = getAllEntries();
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const entry of allPages) {
    // Apex domain includes all its subdomains (for GSC Domain property)
    const isApex = !host.includes('.8zla.com') && host.endsWith('8zla.com');
    const belongs = entry.domain === host || (isApex && entry.domain.endsWith('.8zla.com'));
    if (!belongs) continue;

    const base = `https://${entry.domain}`;
    const isHome = entry.pageIndex === 0;

    entries.push({
      url: isHome ? base : `${base}/${entry.slug}`,
      lastModified: now,
      changeFrequency: isHome ? 'weekly' : 'monthly',
      priority: isHome ? 1.0 : 0.7,
    });

    // Static pages — add once
    if (isHome) {
      entries.push(
        { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
      );
    }
  }

  return entries;
}
