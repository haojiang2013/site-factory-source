/**
 * Social Promotion Engine v2
 * - Mastodon posting (CLI)
 * - Reddit: find threads + generate reply drafts
 * - Pinterest: generate Pin-ready content
 * Usage: npx tsx src/cli/social-promote.ts [mastodon|reddit|pinterest|calendar|dry|all]
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
  slug: string; brand: string; domain: string; niche: string;
  template: string; h1: string; painPoint: string; bestResult: string;
  keywords: string[];
}

function loadSites(): SiteBrief[] {
  const dirs = fs.readdirSync(DATA).filter((d: string) => d.startsWith('site-')).sort();
  return dirs.map((dir: string) => {
    const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
    const pages = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'pages.json'), 'utf8'));
    return {
      slug: dir, brand: cfg.designConfig.brandName, domain: cfg.domain,
      niche: cfg.niche, template: cfg.template,
      h1: pages[0]?.h1 || '',
      painPoint: cfg.keywords?.[0]?.userComplaints?.[0] || '',
      bestResult: cfg.keywords?.[0]?.keyword || cfg.niche,
      keywords: (cfg.keywords || []).slice(0, 5).map((k: any) => k.keyword),
    };
  });
}

function generatePost(site: SiteBrief): string {
  const templates = [
    `🛠️ ${site.brand} — Free ${site.niche}\n\nMost tools ask for email. Ours doesn't.\n\nNo signup. Just answers.\n\n🔗 ${site.domain}`,
    `Tired of "${site.painPoint}"?\n\nWe built ${site.brand}: free ${site.niche}. No ads, no catch.\n\n👉 ${site.domain}`,
    `Just shipped: ${site.brand}\n\n${site.niche} — no signup, no paywall.\n\nTry it: ${site.domain}`,
    `Why does every ${site.niche} tool hide results behind a paywall? 🤔\n\n${site.brand} doesn't. Free.\n\n${site.domain}`,
    `Built because people asked: ${site.keywords[0] || site.niche}\n\n100% free at ${site.domain}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ═══ REDDIT ═══
function findRedditThreads(sites: SiteBrief[]) {
  console.log('\n=== Reddit Thread Opportunities ===\n');

  const subreddits: Record<string, string[]> = {
    'moving': ['r/moving', 'r/Frugal', 'r/homeowners'],
    'mortgage': ['r/personalfinance', 'r/RealEstate', 'r/FirstTimeHomeBuyer'],
    'paint': ['r/HomeImprovement', 'r/DIY', 'r/paint'],
    'concrete': ['r/HomeImprovement', 'r/DIY', 'r/Construction'],
    'flooring': ['r/HomeImprovement', 'r/DIY', 'r/Flooring'],
    'electrical': ['r/electrical', 'r/HomeImprovement', 'r/DIY'],
    'garden': ['r/gardening', 'r/landscaping', 'r/vegetablegardening'],
    'cleaning': ['r/CleaningTips', 'r/homeowners', 'r/Apartmentliving'],
    'solar': ['r/solar', 'r/HomeImprovement', 'r/Frugal'],
    'hvac': ['r/hvacadvice', 'r/HomeImprovement', 'r/homeowners'],
    'game': ['r/gaming', 'r/truegaming', 'r/patientgamers'],
    'ai': ['r/artificial', 'r/ChatGPT', 'r/singularity'],
  };

  for (const site of sites) {
    const cat = site.niche.includes('game') ? 'game'
      : site.niche.includes('AI') || site.niche.includes('ai') ? 'ai'
      : site.niche.split(' ')[0];
    const subs = subreddits[cat] || ['r/selfhosted', 'r/InternetIsBeautiful'];
    console.log(`${site.brand} (${site.domain})`);
    console.log(`  Subs: ${subs.join(', ')}`);
    console.log(`  Pain: "${site.painPoint}"`);
    for (const kw of site.keywords.slice(0, 3)) {
      console.log(`  🔍 https://reddit.com/search/?q=${encodeURIComponent(kw)}&sort=new`);
    }
    console.log();
  }
}

function generateRedditReply(site: SiteBrief): string {
  return `I actually built a free ${site.niche} tool because I was tired of the same thing.

${site.domain} — no email, no signup, just gives you the numbers instantly.

Let me know if it helps!`;
}

// ═══ PINTEREST ═══
function generatePinterestPins(sites: SiteBrief[]) {
  console.log('\n=== Pinterest Pin Content ===\n');
  console.log('Pin design template: 1000x1500px, tool screenshot + headline\n');

  for (const site of sites) {
    const headline = site.h1.replace(/[-–—]/g, '').substring(0, 90);
    console.log(`### ${site.brand}`);
    console.log(`Title: ${headline}`);
    console.log(`Description: Free ${site.niche}. No signup, no email. ${site.painPoint} → ${site.domain}`);
    console.log(`Link: https://${site.domain}/`);
    console.log(`Hashtags: #${site.niche.replace(/\s+/g, '')} #freetool #${site.template === 'A' ? 'calculator' : site.template === 'B' ? 'comparison' : 'guide'}`);
    console.log();
  }
}

// ═══ MASTODON ═══
async function postToMastodon(text: string): Promise<boolean> {
  if (!MASTODON_TOKEN) {
    console.log('❌ Set MASTODON_TOKEN in .env');
    return false;
  }
  const f = createFetch();
  try {
    const res = await f(`${MASTODON_SERVER}/api/v1/statuses`, {
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
    console.log(`❌ Error: ${(e as Error).message}`);
    return false;
  }
}

// ═══ MAIN ═══
async function main() {
  const sites = loadSites();
  console.log(`\nSocial Promote v2 — ${sites.length} sites`);

  const cmd = process.argv[2] || 'dry';

  if (cmd === 'reddit' || cmd === 'r') {
    findRedditThreads(sites);
    const idx = parseInt(process.argv[3]);
    if (idx >= 0 && idx < sites.length) {
      const site = sites[idx];
      console.log(`\n=== Reply draft for ${site.brand} ===`);
      console.log(generateRedditReply(site));
    }
  } else if (cmd === 'pinterest' || cmd === 'pin') {
    generatePinterestPins(sites);
  } else if (cmd === 'mastodon' || cmd === 'send') {
    const idx = parseInt(process.argv[3]);
    const site = (idx >= 0 && sites[idx]) ? sites[idx] : sites[Math.floor(Math.random() * sites.length)];
    const text = generatePost(site);
    console.log(`📤 Posting: ${site.brand}\n${text}\n`);
    await postToMastodon(text);
  } else if (cmd === 'calendar' || cmd === 'cal') {
    console.log('\n=== 7-Day Post Schedule ===\n');
    const shuffled = [...sites].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 7 && i < shuffled.length; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      console.log(`${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${shuffled[i].brand} — ${shuffled[i].domain}`);
    }
  } else if (cmd === 'dry') {
    console.log('\n=== Post Preview (5 samples) ===\n');
    for (let i = 0; i < 5 && i < sites.length; i++) {
      console.log(`${sites[i].brand} (${sites[i].domain})`);
      console.log(`  ${generatePost(sites[i]).replace(/\n/g, ' | ')}`);
      console.log();
    }
  } else {
    console.log('\nUsage: npx tsx src/cli/social-promote.ts [command] [site-index]');
    console.log('  mastodon [n] — Post to Mastodon (random or site n)');
    console.log('  reddit       — Find Reddit threads + subreddit suggestions');
    console.log('  reddit [n]   — Also generate reply draft for site n');
    console.log('  pinterest    — Generate Pin titles/descriptions for all 25 sites');
    console.log('  calendar     — 7-day posting schedule');
    console.log('  dry          — Preview 5 posts');
    console.log('  all          — Show all 25 post texts');
  }
}

main().catch(console.error);
