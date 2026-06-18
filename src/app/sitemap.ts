import { MetadataRoute } from 'next';

const BASE_URLS: Record<string, string> = {
  'gomovecalc.xyz': 'https://gomovecalc.xyz',
  'payitoff.xyz': 'https://payitoff.xyz',
  'paintwise.xyz': 'https://paintwise.xyz',
  'aitoolshelf.xyz': 'https://aitoolshelf.xyz',
  'lootcove.xyz': 'https://lootcove.xyz',
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate sitemap entries for all known domains
  const entries: MetadataRoute.Sitemap = [];

  for (const [domain, baseUrl] of Object.entries(BASE_URLS)) {
    entries.push(
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
      { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    );
  }

  return entries;
}
