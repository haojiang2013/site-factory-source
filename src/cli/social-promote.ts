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
interface Pin {
  brand: string;
  domain: string;
  title: string;
  description: string;
  link: string;
  hashtags: string[];
  angle: 'pain-point' | 'how-to' | 'comparison' | 'tip' | 'feature' | 'numbers' | 'quiz' | 'before-after' | 'checklist' | 'secret';
  imageSpec: string;
}

function generatePinterestPins(sites: SiteBrief[]) {
  const allPins: Pin[] = [];
  const tagMap: Record<string, string> = { A: 'calculator', B: 'comparison', C: 'guide' };
  const nicheTag = (s: SiteBrief) => s.niche.replace(/\s+/g, '');

  // 10 pin angles per site
  const angles: Array<{ angle: Pin['angle']; title: (s: SiteBrief) => string; desc: (s: SiteBrief) => string }> = [
    {
      angle: 'pain-point',
      title: s => `Stop ${s.painPoint.split(' ').slice(0, 5).join(' ')}`,
      desc: s => `Tired of ${s.painPoint}? Try this free ${s.niche} — no signup, instant results. ${s.domain}`,
    },
    {
      angle: 'how-to',
      title: s => `How to ${s.h1.replace(/[-–—]/g, '').substring(0, 80)}`,
      desc: s => `Step-by-step: use our free ${s.niche} to get accurate estimates in 30 seconds. No email required.`,
    },
    {
      angle: 'comparison',
      title: s => `${s.brand} vs Paying a Pro: Real Cost Difference`,
      desc: s => `Before you hire someone, run the numbers. Free ${s.niche} saves you from overpaying. ${s.domain}`,
    },
    {
      angle: 'tip',
      title: s => `One Thing Most People Get Wrong About ${s.niche.replace('calculator', '').replace('estimator', '').trim()}`,
      desc: s => `Don't guess — calculate. Our free tool uses real industry data. ${s.domain}`,
    },
    {
      angle: 'feature',
      title: s => `${s.brand}: The Free Tool That Replaces Spreadsheets`,
      desc: s => `No Excel, no math, no signup. Just open and calculate. ${s.niche} — ${s.domain}`,
    },
    {
      angle: 'numbers',
      title: s => `Real Numbers: What ${s.niche.replace(' calculator', '').replace(' estimator', '')} Actually Costs in 2026`,
      desc: s => `Updated 2026 pricing data. Free ${s.niche} with breakdown by category. ${s.domain}`,
    },
    {
      angle: 'quiz',
      title: s => `Which ${s.niche.split(' ')[0]} Option Is Right For You?`,
      desc: s => `Answer 3 quick inputs and our free calculator tells you. No signup. ${s.domain}`,
    },
    {
      angle: 'before-after',
      title: s => `Before Buying ${s.niche.split(' ').slice(0, 2).join(' ')}: Run This First`,
      desc: s => `5 minutes of planning saves thousands. Free ${s.niche} → ${s.domain}`,
    },
    {
      angle: 'checklist',
      title: s => `The Ultimate ${s.niche.replace(' calculator', '').replace(' estimator', '')} Checklist (Free Tool Inside)`,
      desc: s => `Everything you need to know before starting. Plus a free calculator. ${s.domain}`,
    },
    {
      angle: 'secret',
      title: s => `Industry Secret: How Pros Estimate ${s.niche.split(' ').slice(0, 2).join(' ')} Costs`,
      desc: s => `We reverse-engineered professional pricing formulas. Try them free. ${s.domain}`,
    },
  ];

  for (const site of sites) {
    for (const a of angles) {
      const title = a.title(site).substring(0, 100);
      allPins.push({
        brand: site.brand,
        domain: site.domain,
        title,
        description: a.desc(site).substring(0, 500),
        link: `https://${site.domain}/`,
        hashtags: [`#${nicheTag(site)}`, '#freetool', `#${tagMap[site.template]}`, '#nocode', '#indiehacker'],
        angle: a.angle,
        imageSpec: '1000x1500px — tool screenshot with bold headline overlay, brand colors, clean white bg',
      });
    }
  }

  // Output to console
  console.log('\n=== Pinterest Pin Content ===\n');
  console.log(`Generated ${allPins.length} pins (10 per site × ${sites.length} sites)\n`);

  for (let i = 0; i < allPins.length; i++) {
    const pin = allPins[i];
    if (i > 0 && i % 10 === 0) console.log(`\n--- ${pin.brand} ---\n`);
    console.log(`${i + 1}. [${pin.angle}] ${pin.title}`);
    console.log(`   ${pin.description}`);
    console.log(`   🔗 ${pin.link}  |  ${pin.hashtags.join(' ')}`);
    console.log();
  }

  // Write JSON file for batch processing
  const outPath = path.join(process.cwd(), 'src', 'data', 'pinterest-pins.json');
  fs.writeFileSync(outPath, JSON.stringify(allPins, null, 2));
  console.log(`\n✓ Saved ${allPins.length} pins to src/data/pinterest-pins.json`);

  // Print summary by angle
  console.log('\nPin angle distribution:');
  const angleCount: Record<string, number> = {};
  allPins.forEach(p => { angleCount[p.angle] = (angleCount[p.angle] || 0) + 1; });
  Object.entries(angleCount).forEach(([a, c]) => console.log(`  ${a}: ${c} pins`));
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
