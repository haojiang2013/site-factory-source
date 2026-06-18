/**
 * Social Media Promotion Engine
 * - Generates AND posts to Mastodon (free API)
 * - Finds high-value Reddit threads to reply to
 * - Rotates through all 25 sites
 * Usage: node --require tsx/cjs src/cli/social-promote.ts [calendar|reddit|send|dry|all]
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const DATA = path.resolve(__dirname, '..', 'data');
const MASTODON_SERVER = process.env.MASTODON_SERVER || 'https://mastodon.social';
const MASTODON_TOKEN = process.env.MASTODON_TOKEN || '';
const PROXY = process.env.MASTODON_PROXY || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || '';

function createFetch() {
  if (!PROXY) return globalThis.fetch;
  const { HttpsProxyAgent } = require('https-proxy-agent') as any;
  const agent = new HttpsProxyAgent(PROXY);
  return (url: string, init?: any) => globalThis.fetch(url, { ...init, agent } as any);
}

interface SiteBrief {
  slug: string;
  brand: string;
  domain: string;
  niche: string;
  template: string;
  h1: string;
  painPoint: string;
  bestResult: string;
}

function loadSites(): SiteBrief[] {
  const dirs = fs.readdirSync(DATA).filter((d: string) => d.startsWith('site-')).sort();
  return dirs.map((dir: string) => {
    const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
    const pages = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'pages.json'), 'utf8'));
    const firstPage = pages[0] || {};
    return {
      slug: dir,
      brand: cfg.designConfig.brandName,
      domain: cfg.domain,
      niche: cfg.niche,
      template: cfg.template,
      h1: firstPage.h1 || '',
      painPoint: cfg.keywords?.[0]?.userComplaints?.[0] || '',
      bestResult: cfg.keywords?.[0]?.keyword || cfg.niche,
    };
  });
}

function generateMastodonPost(site: SiteBrief): string {
  const templates = [
    `🛠️ Free tool alert: ${site.brand} — ${site.niche}\n\n"${site.painPoint}"\n\nWe fixed that. No signup, no email, just results.\n\n${site.domain}`,
    `Tired of "${site.painPoint}"?\n\nTry ${site.brand}: ${site.niche}. Free, no ads, no catch.\n\n👉 ${site.domain}`,
    `Built because Reddit complained: ${site.painPoint}\n\nSo we made ${site.brand}. Free forever.\n\n${site.domain}`,
    `New free tool: ${site.h1}\n\n✅ No signup\n✅ Real data\n✅ Instant results\n\n${site.domain}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function findRedditOpportunities(sites: SiteBrief[]) {
  console.log('\n=== Reddit Promotion Opportunities ===\n');

  for (const site of sites) {
    const category = site.niche.includes('game') ? 'game' : site.template === 'A' ? 'calculator' : 'AI';
    console.log(`${site.brand} (${site.domain})`);
    console.log(`  Pain: "${site.painPoint}"`);
    console.log(`  Search: https://reddit.com/search/?q=${encodeURIComponent(site.bestResult)}`);
    console.log();
  }
}

function dailyPostCalendar(sites: SiteBrief[], days: number = 7) {
  console.log('\n=== Daily Post Calendar ===\n');
  const shuffled = [...sites].sort(() => Math.random() - 0.5);

  for (let i = 0; i < days && i < shuffled.length; i++) {
    const site = shuffled[i];
    const d = new Date();
    d.setDate(d.getDate() + i);
    const tag = d.toLocaleDateString('en-US', {weekday:'short',month:'short',day:'numeric'});
    console.log(`${tag}: ${site.brand} — ${site.domain}`);
    console.log(`  ${generateMastodonPost(site).replace(/\n/g,' | ')}`);
    console.log();
  }
}

async function postToMastodon(text: string): Promise<boolean> {
  if (!MASTODON_TOKEN) {
    console.log('❌ Set MASTODON_TOKEN in .env (get it from mastodon.social/settings/applications)');
    return false;
  }
  const fetchWithProxy = createFetch();
  try {
    const res = await fetchWithProxy(`${MASTODON_SERVER}/api/v1/statuses`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${MASTODON_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: text, visibility: 'public' }),
    });
    if (res.ok) {
      const data: any = await res.json();
      console.log(`✅ Posted: ${data.url || data.id}`);
      return true;
    }
    const err: any = await res.json();
    console.log(`❌ Failed: ${err.error || res.status}`);
    return false;
  } catch (e) {
    console.log(`❌ Network error: ${(e as Error).message}`);
    return false;
  }
}

async function sendOne(sites: SiteBrief[], idx?: number) {
  const site = (idx !== undefined && sites[idx]) ? sites[idx]
    : sites[Math.floor(Math.random() * sites.length)];
  const text = generateMastodonPost(site);
  console.log(`📤 Posting: ${site.brand} — ${site.domain}`);
  console.log(text);
  console.log();
  await postToMastodon(text);
}

async function sendDryRun(sites: SiteBrief[]) {
  console.log('\n=== Dry Run — Would post ===\n');
  let i = 0;
  const today = new Date().toLocaleDateString('en-US', {weekday:'short',month:'short',day:'numeric'});
  for (const site of sites) {
    if (i >= 5) break;
    i++;
    const text = generateMastodonPost(site);
    const length = text.length;
    console.log(`${i}. ${site.brand} (${site.domain}) [${length} chars]`);
    console.log(`   ${text.replace(/\n/g,' | ')}`);
    console.log();
  }
}

async function main() {
  const sites = loadSites();
  console.log(`\nSocial Promote Engine — ${sites.length} sites loaded`);
  if (MASTODON_TOKEN) console.log(`Mastodon: ${MASTODON_SERVER} ✅`);
  else console.log(`Mastodon: ${MASTODON_SERVER} ⚠️ (set MASTODON_TOKEN to post)`);

  const cmd = process.argv[2] || 'dry';

  if (cmd === 'calendar' || cmd === 'cal') {
    dailyPostCalendar(sites, parseInt(process.argv[3]) || 7);
  } else if (cmd === 'reddit' || cmd === 'r') {
    findRedditOpportunities(sites);
  } else if (cmd === 'send' || cmd === 'post') {
    await sendOne(sites, parseInt(process.argv[3]) || -1);
  } else if (cmd === 'dry') {
    await sendDryRun(sites);
  } else if (cmd === 'all') {
    for (const s of sites) console.log(`\n--- ${s.brand} ---\n${generateMastodonPost(s)}`);
  } else {
    console.log('\nUsage: node --require tsx/cjs src/cli/social-promote.ts [dry|send|calendar|reddit|all]');
    console.log('  dry      — Preview 5 posts (safe, no token needed)');
    console.log('  send [n] — Post one to Mastodon (random, or site index 0-24)');
    console.log('  calendar — 7-day posting schedule');
    console.log('  reddit   — Find Reddit promotion opportunities');
    console.log('  all      — Generate posts for all 25 sites');
  }
}

main().catch(console.error);
