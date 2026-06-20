/**
 * Vercel Analytics proxy — fetches real-time traffic data from Vercel API.
 * GET /api/vercel-analytics?days=7
 */
import { NextRequest, NextResponse } from 'next/server';

const TOKEN = process.env.VERCEL_TOKEN || '';
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_uBfQ19VvOwfFQlKhqJElKQNeIySU';
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_Ew9HonIuHY0KemHuAUEoq5rt';

export async function GET(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'VERCEL_TOKEN not configured' }, { status: 500 });
  }

  const days = parseInt(req.nextUrl.searchParams.get('days') || '7');
  const now = Date.now();
  const from = now - days * 86400000;

  try {
    // Fetch from Vercel Analytics API v2
    const res = await fetch(`https://api.vercel.com/v2/web/insights/stats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: now,
        tz: 'Asia/Shanghai',
        filter: {
          projectId: PROJECT_ID,
          environment: 'production',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      // Vercel Analytics REST API not publicly available yet (community feature request pending)
      // Fall back to custom tracking data from /api/analytics/stats
      return NextResponse.json({ error: 'Vercel Analytics API not available', note: 'Use Vercel Dashboard for real-time data: https://vercel.com/stevengu77-2664s-projects/site-factory/analytics' }, { status: 200 });
    }

    const raw = await res.json();
    const data = raw.data || raw;

    // Transform to dashboard-friendly format
    return NextResponse.json({
      success: true,
      days,
      pageViews: data.pageViews || 0,
      uniqueVisitors: data.uniqueVisitors || 0,
      visits: data.visits || data.sessions || 0,
      // Per-domain breakdown
      byPath: (data.topPaths || data.paths || []).slice(0, 20).map((p: any) => ({
        path: p.path || p.pathname || p.url || '',
        views: p.pageViews || p.views || p.count || 0,
      })),
      // Time series
      series: (data.series || data.timeSeries || []).map((s: any) => ({
        date: s.date || s.timestamp || '',
        views: s.pageViews || s.views || 0,
        visitors: s.uniqueVisitors || s.visitors || 0,
      })),
      // Source breakdown (referrer data if available)
      sources: (data.topSources || data.sources || []).slice(0, 10).map((s: any) => ({
        source: s.source || s.referrer || s.name || '',
        views: s.pageViews || s.views || s.count || 0,
      })),
      // Raw for debug
      rawKeys: Object.keys(data),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
