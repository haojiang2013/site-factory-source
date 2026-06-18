import { NextResponse } from 'next/server';

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }),
  });
  const data = await res.json() as any;
  return data.access_token || null;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return NextResponse.json({ error: 'GSC not configured. Add GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN env vars.' }, { status: 500 });

    const domains = ['gomovecalc.xyz', 'payitoff.xyz', 'paintwise.xyz', 'aitoolshelf.xyz', 'lootcove.xyz'];
    const results: Record<string, any> = {};
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);

    for (const domain of domains) {
      try {
        const siteUrl = `sc-domain:${domain}`;
        const analyticsRes = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate: sevenDaysAgo, endDate: today, dimensions: ['query'], rowLimit: 15, aggregationType: 'byPage' }),
          }
        ).then(r => r.json());

        if (analyticsRes.error) {
          results[domain] = { error: analyticsRes.error.message };
          continue;
        }

        const rows = analyticsRes.rows || [];
        results[domain] = {
          queries: rows.slice(0, 10).map((r: any) => ({
            query: r.keys[0], clicks: r.clicks, impressions: r.impressions,
            ctr: r.ctr ? (r.ctr * 100).toFixed(1) + '%' : '0%', position: r.position?.toFixed(1),
          })),
          totalClicks: rows.reduce((s: number, r: any) => s + (r.clicks || 0), 0),
          totalImpressions: rows.reduce((s: number, r: any) => s + (r.impressions || 0), 0),
        };
      } catch {
        results[domain] = { error: 'Fetch failed' };
      }
    }

    return NextResponse.json({ fetched: new Date().toISOString(), sites: results });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
