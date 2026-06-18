#!/usr/bin/env tsx
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Competitor intrusion detection using GSC position data
// If a core keyword drops >3 positions in 7 days → possible competitor intrusion
async function main() {
  const accessToken = await getGSCAccessToken();
  if (!accessToken) { console.log('GSC not configured'); process.exit(0); }

  const domains = ['gomovecalc.xyz', 'payitoff.xyz', 'paintwise.xyz', 'aitoolshelf.xyz', 'lootcove.xyz'];
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const prevStart = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);

  const alerts: string[] = [];

  for (const domain of domains) {
    try {
      // Fetch current week positions
      const curr = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(`sc-domain:${domain}`)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate: sevenDaysAgo, endDate: today, dimensions: ['query'], rowLimit: 20 }),
        }
      ).then(r => r.json());

      // Fetch previous week positions for comparison
      const prev = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(`sc-domain:${domain}`)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate: prevStart, endDate: sevenDaysAgo, dimensions: ['query'], rowLimit: 20 }),
        }
      ).then(r => r.json());

      // Compare positions
      const prevMap = new Map((prev.rows || []).map((r: any) => [r.keys[0], r.position]));
      for (const row of (curr.rows || [])) {
        const query = row.keys[0];
        const currPos = row.position;
        const prevPos = prevMap.get(query);
        if (prevPos !== undefined && prevPos !== null && Number(currPos) > Number(prevPos) + 3) {
          alerts.push(`⚠️ ${domain}: "${query}" dropped from #${Number(prevPos).toFixed(1)} to #${Number(currPos).toFixed(1)} — possible competitor intrusion`);
        }
      }
    } catch { /* skip */ }
  }

  if (alerts.length === 0) {
    console.log('✅ No competitor intrusion detected');
  } else {
    console.log(`Found ${alerts.length} alerts:`);
    alerts.forEach(a => console.log(a));
  }

  // Save report
  const report = { checkedAt: new Date().toISOString(), alerts };
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'competitor-report.json'), JSON.stringify(report, null, 2));
}

async function getGSCAccessToken(): Promise<string | null> {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }),
    });
    return ((await res.json()) as any).access_token || null;
  } catch { return null; }
}

main().catch(e => { console.error('Competitor check failed:', e.message); process.exit(1); });
