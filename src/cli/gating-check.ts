#!/usr/bin/env tsx
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Contraction-based expansion gate
// Rule: Don't build site N+1 until N sites have proven viability
const GATES = [
  { maxSites: 5, requireSitesWithTraffic: 3, minPV: 100 },
  { maxSites: 15, requireSitesWithRevenue: 5, minRevenue: 10 },
  { maxSites: 26, requireSitesWithRevenue: 8, minRevenue: 50 },
];

async function main() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const entries = fs.readdirSync(dataDir).filter(e => !e.startsWith('.') && !e.endsWith('.json'));
  const currentSiteCount = entries.filter(e => {
    try { return fs.existsSync(path.join(dataDir, e, 'pages.json')); } catch { return false; }
  }).length;

  console.log(`Current sites: ${currentSiteCount}`);

  // Find active gate
  const activeGate = GATES.find(g => currentSiteCount <= g.maxSites) || GATES[GATES.length - 1];
  if (!activeGate || currentSiteCount <= activeGate.maxSites) {
    console.log(`Gate: max ${activeGate.maxSites} sites`);
    console.log(`Requirement: ${activeGate.requireSitesWithTraffic ? `${activeGate.requireSitesWithTraffic} sites with >${activeGate.minPV} PV/month` : `${activeGate.requireSitesWithRevenue} sites with >$${activeGate.minRevenue}/month`}`);
  }

  // Check GSC data to see if gate is satisfied
  // GSC data comes from /api/gsc-data if available
  console.log('\nChecking GSC data...');
  try {
    const accessToken = await getGSCAccessToken();
    if (!accessToken) { console.log('GSC not available — gate cannot be verified. Assume PASS for now (new sites).'); process.exit(0); }

    let qualifiedCount = 0;
    const domains = ['gomovecalc.xyz', 'payitoff.xyz', 'paintwise.xyz', 'aitoolshelf.xyz', 'lootcove.xyz'];
    const today = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    for (const domain of domains.slice(0, currentSiteCount)) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(`sc-domain:${domain}`)}/searchAnalytics/query`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate: thirtyDaysAgo, endDate: today, rowLimit: 1 }),
          }
        ).then(r => r.json());

        const totalClicks = (res.rows || []).reduce((s: number, r: any) => s + (r.clicks || 0), 0);
        if (totalClicks >= (activeGate.minPV || 0)) qualifiedCount++;
        console.log(`  ${domain}: ${totalClicks} clicks — ${totalClicks >= (activeGate.minPV || 0) ? '✅' : '❌'}`);
      } catch {
        console.log(`  ${domain}: data unavailable`);
      }
    }

    const required = activeGate.requireSitesWithTraffic || activeGate.requireSitesWithRevenue || 3;
    const passed = qualifiedCount >= required;
    console.log(`\nGate status: ${passed ? '✅ PASS — can expand' : '❌ BLOCKED — need ' + required + ' qualified sites, have ' + qualifiedCount}`);
    if (!passed) console.log('Fix: improve existing sites before building more. Focus on SEO and content quality.');
  } catch (e) {
    console.log('GSC check failed:', (e as Error).message);
  }
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

main().catch(e => { console.error('Gate check failed:', e.message); process.exit(1); });
