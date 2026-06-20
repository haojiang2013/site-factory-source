/**
 * GSC stats API — keyword clicks + impressions
 * GET /api/gsc-stats?domain=gomovecalc.xyz
 * GET /api/gsc-stats (queries first 5 sites for summary)
 *
 * Requires:
 *   GOOGLE_CLIENT_EMAIL — service account email
 *   GOOGLE_PRIVATE_KEY — service account private key
 */
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getGoogleAuth } from '@/lib/google-auth';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const auth = getGoogleAuth();
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    const { searchParams } = new URL(req.url);
    const reqDomain = searchParams.get('domain');

    // If domain specified, query that one
    if (reqDomain) {
      // Try both formats: domain property (sc-domain:) and URL prefix
      const tryUrls = reqDomain.includes('://')
        ? [reqDomain]
        : [`sc-domain:${reqDomain}`, `https://${reqDomain}/`];
      let siteUrl = '';
      let res: any = null;

      for (const url of tryUrls) {
        try {
          res = await searchconsole.searchanalytics.query({
            siteUrl: url,
            requestBody: {
              startDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              dimensions: ['query'],
              rowLimit: 20,
            },
          });
          siteUrl = url;
          break; // success — stop trying
        } catch (e: any) {
          if (e.code === 403 || e.message?.includes('not a valid')) continue;
          throw e;
        }
      }

      if (!siteUrl) {
        return NextResponse.json({ domain: reqDomain, error: 'Site not verified or no access (tried both formats)' }, { status: 403 });
      }

      const rows = (res.data.rows || []).map((row: any) => ({
        query: row.keys?.[0] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr ? Math.round(row.ctr * 10000) / 100 : 0,
        position: row.position ? Math.round(row.position * 10) / 10 : 0,
      }));

      return NextResponse.json({
        domain: reqDomain,
        siteUrl,
        queries: rows,
        totalClicks: rows.reduce((s: number, r: any) => s + r.clicks, 0),
        totalImpressions: rows.reduce((s: number, r: any) => s + r.impressions, 0),
        fetchedAt: new Date().toISOString(),
      });
    }

    // No domain — return summary from config domains (first 5)
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const dirs = fs.readdirSync(dataDir).filter(d => d.startsWith('site-')).sort();
    const domains: string[] = dirs.map(dir => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dataDir, dir, 'config.json'), 'utf8')).domain;
      } catch { return null; }
    }).filter(Boolean);

    const summaries: any[] = [];
    for (const domain of domains.slice(0, 5)) {
      let found = false;
      for (const url of [`sc-domain:${domain}`, `https://${domain}/`]) {
        try {
          const res = await searchconsole.searchanalytics.query({
            siteUrl: url,
            requestBody: {
              startDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              rowLimit: 1,
            },
          });
          const row = (res.data.rows || [])[0];
          summaries.push({
            domain,
            siteUrl: url,
            clicks: row?.clicks || 0,
            impressions: row?.impressions || 0,
            ctr: row?.ctr ? Math.round(row.ctr * 10000) / 100 : 0,
          });
          found = true;
          break;
        } catch { continue; }
      }
      if (!found) summaries.push({ domain, error: 'not_verified' });
    }

    const verified = summaries.filter(s => !s.error).length;

    return NextResponse.json({
      totalSites: domains.length,
      queried: summaries.length,
      verified,
      sites: summaries,
      totalClicks: summaries.reduce((s, r) => s + (r.clicks || 0), 0),
      totalImpressions: summaries.reduce((s, r) => s + (r.impressions || 0), 0),
      fetchedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error('GSC Stats error:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
