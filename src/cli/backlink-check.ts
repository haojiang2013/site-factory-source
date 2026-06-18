#!/usr/bin/env tsx
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Simple backlink health check using Google Search Console data
// Full backlink monitoring requires Ahrefs/SEMrush API ($), but GSC provides basic data free
async function main() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const reportPath = path.join(dataDir, 'backlink-report.json');

  // Load previous report for comparison
  let previous: any = {};
  try { previous = JSON.parse(fs.readFileSync(reportPath, 'utf-8')); } catch { /* first run */ }

  const domains = ['gomovecalc.xyz', 'payitoff.xyz', 'paintwise.xyz', 'aitoolshelf.xyz', 'lootcove.xyz'];
  const alerts: string[] = [];
  const current: Record<string, any> = {};

  for (const domain of domains) {
    try {
      // Use GSC API to get backlink data
      const accessToken = await getGSCAccessToken();
      if (!accessToken) { alerts.push('GSC not configured — backlink monitoring offline'); break; }

      const res = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(`sc-domain:${domain}`)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      ).then(r => r.json());

      current[domain] = { checkedAt: new Date().toISOString(), backlinks: res.links || 'no data' };

      // Check for sudden spikes vs previous
      if (previous[domain]?.backlinks && current[domain].backlinks !== 'no data') {
        const prev = previous[domain].backlinks;
        const curr = current[domain].backlinks;
        if (curr > prev * 2) {
          alerts.push(`⚠️ ${domain}: backlink count doubled from ${prev} to ${curr} — possible negative SEO attack`);
        }
      }
    } catch (e) {
      current[domain] = { error: (e as Error).message };
    }
  }

  fs.writeFileSync(reportPath, JSON.stringify(current, null, 2));

  if (alerts.length === 0) {
    console.log('✅ Backlink health: normal');
  } else {
    console.log(`Found ${alerts.length} alerts:`);
    alerts.forEach(a => console.log(a));
    console.log('If negative SEO detected: prepare Disavow file at https://www.google.com/webmasters/tools/disavow');
  }
  console.log('Report: src/data/backlink-report.json');
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
    const data = await res.json() as any;
    return data.access_token || null;
  } catch { return null; }
}

main().catch(e => { console.error('Backlink check failed:', e.message); process.exit(1); });
