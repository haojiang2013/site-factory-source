/**
 * IndexNow + Google Ping endpoint — submits ALL pages across all 25 domains.
 *
 * Usage:
 *   GET /api/submit-index?secret=CRON_SECRET           → all 25 domains
 *   GET /api/submit-index?secret=CRON_SECRET&dry=1     → dry run (count only)
 *
 * IndexNow key: fa71c99a2cd5449fbbfc0c37f2cf6080
 * Key file: /indexnow-fa71c99a2cd5449fbbfc0c37f2cf6080.txt → must serve the key
 */
import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = 'fa71c99a2cd5449fbbfc0c37f2cf6080';

// Load all sites dynamically
function loadAllDomains(): { domain: string; pages: any[] }[] {
  const fs = require('fs');
  const path = require('path');
  const dataDir = path.resolve(process.cwd(), 'src', 'data');
  const dirs = fs.readdirSync(dataDir).filter((d: string) => d.startsWith('site-')).sort();
  return dirs.map((d: string) => {
    const cfg = JSON.parse(fs.readFileSync(path.join(dataDir, d, 'config.json'), 'utf8'));
    const pages = JSON.parse(fs.readFileSync(path.join(dataDir, d, 'pages.json'), 'utf8'));
    return { domain: cfg.domain, pages };
  });
}

function getAllUrls(site: { domain: string; pages: any[] }): string[] {
  const urls = [
    `https://${site.domain}/`,
    `https://${site.domain}/about`,
    `https://${site.domain}/contact`,
    `https://${site.domain}/privacy`,
    `https://${site.domain}/terms`,
  ];
  for (const page of site.pages) {
    if (page.slug) {
      urls.push(`https://${site.domain}/${page.slug}/`);
    }
  }
  return [...new Set(urls)]; // dedupe
}

async function submitIndexNow(domain: string, urlList: string[]): Promise<{ ok: boolean; status: number; body: string }> {
  try {
    // IndexNow max is 10,000 URLs per request, our max is ~14 per domain — well within limit
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: domain,
        key: INDEXNOW_KEY,
        keyLocation: `https://${domain}/indexnow-${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(20000),
    });
    return { ok: res.ok, status: res.status, body: (await res.text()).substring(0, 150) };
  } catch (e: any) {
    return { ok: false, status: 0, body: e.message?.substring(0, 100) || 'unknown' };
  }
}

async function pingGoogle(domain: string): Promise<{ ok: boolean; status: number; body: string }> {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(`https://${domain}/sitemap.xml`)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return { ok: res.ok, status: res.status, body: (await res.text()).substring(0, 100) };
  } catch (e: any) {
    return { ok: false, status: 0, body: e.message?.substring(0, 100) || 'unknown' };
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const isDry = req.nextUrl.searchParams.get('dry') === '1';
  const sites = loadAllDomains();
  let totalUrls = 0;

  // Count URLs
  const allUrls: { domain: string; urls: string[] }[] = [];
  for (const site of sites) {
    const urls = getAllUrls(site);
    allUrls.push({ domain: site.domain, urls });
    totalUrls += urls.length;
  }

  if (isDry) {
    return NextResponse.json({
      success: true,
      dry: true,
      domains: sites.length,
      totalUrls,
      breakdown: allUrls.map(a => ({ domain: a.domain, urls: a.urls.length })),
    });
  }

  // Submit to IndexNow (25 requests in parallel)
  const ixSettled = await Promise.allSettled(
    allUrls.map(a => submitIndexNow(a.domain, a.urls))
  );

  // Ping Google sitemaps
  const googleSettled = await Promise.allSettled(
    allUrls.map(a => pingGoogle(a.domain))
  );

  const results = allUrls.map((a, i) => {
    const ix = ixSettled[i];
    const g = googleSettled[i];
    return {
      domain: a.domain,
      urls: a.urls.length,
      indexnow: ix.status === 'fulfilled' && ix.value.ok ? 'OK' : 'FAIL',
      google: g.status === 'fulfilled' && g.value.ok ? 'OK' : 'FAIL',
    };
  });

  const ixOk = results.filter(r => r.indexnow === 'OK').length;
  const gOk = results.filter(r => r.google === 'OK').length;

  return NextResponse.json({
    success: true,
    totalUrls,
    indexnow: `${ixOk}/${sites.length} OK`,
    google: `${gOk}/${sites.length} OK`,
    results,
  });
}
