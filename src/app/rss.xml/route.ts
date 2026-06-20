/**
 * RSS 2.0 Feed — per-domain, served at /rss.xml
 * Phase 3: Content Distribution — feeds into Feedly, Inoreader, etc.
 */
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAllEntries } from '@/lib/page-registry';

export async function GET(req: NextRequest) {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');

  const allPages = getAllEntries();
  const domainPages = allPages.filter(e => e.domain === host);
  if (domainPages.length === 0) {
    return new NextResponse('No content for this domain', { status: 404 });
  }

  const brand = domainPages[0].config.designConfig.brandName;
  const now = new Date().toUTCString();

  const items = domainPages.map(e => {
    const page = e.page;
    const url = e.pageIndex === 0
      ? `https://${e.domain}/`
      : `https://${e.domain}/${e.slug}/`;
    const desc = page.metaDescription || page.h1 || '';
    const date = new Date().toUTCString();

    return `<item>
      <title>${escapeXml(page.h1 || e.slug)}</title>
      <link>${escapeXml(url)}</link>
      <description>${escapeXml(desc)}</description>
      <pubDate>${date}</pubDate>
      <guid>${escapeXml(url)}</guid>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(brand)} — Free Tools &amp; Guides</title>
    <link>https://${escapeXml(host)}/</link>
    <description>Free tools and guides from ${escapeXml(brand)}. No signup, no email.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://${escapeXml(host)}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
