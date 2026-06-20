/**
 * GA4 stats API — geography + traffic sources
 * GET /api/ga-stats
 *
 * Requires:
 *   GOOGLE_CLIENT_EMAIL — service account email
 *   GOOGLE_PRIVATE_KEY — service account private key
 *   GA4_PROPERTY_ID — numeric property ID (not measurement ID), e.g. "123456789"
 */
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getGoogleAuth } from '@/lib/google-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = getGoogleAuth();
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      return NextResponse.json({ error: 'Missing GA4_PROPERTY_ID' }, { status: 500 });
    }

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

    // ── Geography report ──
    const geoRes = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: '20',
      },
    });

    // ── Traffic source report ──
    const trafficRes = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: '10',
      },
    });

    // Parse geo data
    const geo = (geoRes.data.rows || []).map((row: any) => ({
      country: row.dimensionValues?.[0]?.value || 'Unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    }));

    // Parse traffic sources
    const totalSessions = (trafficRes.data.rows || []).reduce(
      (sum: number, r: any) => sum + parseInt(r.metricValues?.[0]?.value || '0'), 0
    ) || 1;

    const traffic = (trafficRes.data.rows || []).map((row: any) => {
      const sessions = parseInt(row.metricValues?.[0]?.value || '0');
      return {
        source: row.dimensionValues?.[0]?.value || 'Unknown',
        sessions,
        pct: Math.round((sessions / totalSessions) * 100),
      };
    });

    // Aggregate categories
    const categories: Record<string, number> = { direct: 0, google: 0, reddit: 0, other: 0 };
    traffic.forEach((t: any) => {
      const s = t.source.toLowerCase();
      if (s === '(direct)' || s === 'direct') categories.direct += t.sessions;
      else if (s.includes('google')) categories.google += t.sessions;
      else if (s.includes('reddit')) categories.reddit += t.sessions;
      else categories.other += t.sessions;
    });
    const catTotal = categories.direct + categories.google + categories.reddit + categories.other || 1;

    return NextResponse.json({
      geo,
      traffic,
      categories: {
        direct: { sessions: categories.direct, pct: Math.round((categories.direct / catTotal) * 100) },
        google: { sessions: categories.google, pct: Math.round((categories.google / catTotal) * 100) },
        reddit: { sessions: categories.reddit, pct: Math.round((categories.reddit / catTotal) * 100) },
        other: { sessions: categories.other, pct: Math.round((categories.other / catTotal) * 100) },
      },
      meta: { propertyId, fetchedAt: new Date().toISOString() },
    });
  } catch (e: any) {
    console.error('GA Stats error:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
