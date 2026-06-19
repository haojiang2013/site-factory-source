/**
 * Directory Submission Engine — Phase 2: Backlink Matrix
 * Generates ready-to-submit content for 20+ free tool directories.
 * Usage: npx tsx src/cli/submit-directories.ts [site-index] [platform]
 *
 * Platforms covered:
 * - AlternativeTo, Product Hunt, Toolify, SaaS Hub, BetaList, Hacker News,
 *   Indie Hackers, Alternative.me, Crozdesk, G2, Capterra, GetApp, SaaSWorthy,
 *   Startup Buffer, Launching Next, SideProjectors, 10words, TopAiTools,
 *   Futurepedia, There's An AI For That, ProductHunt Alternatives
 */
import fs from 'fs';
import path from 'path';

const DATA = path.resolve(__dirname, '..', 'data');

interface SiteInfo {
  slug: string; brand: string; domain: string; niche: string;
  template: string; h1: string; desc: string; keywords: string[];
  painPoints: string[]; colorScheme: string;
}

function loadSite(dir: string): SiteInfo {
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
  const pages = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'pages.json'), 'utf8'));
  return {
    slug: dir, brand: cfg.designConfig.brandName, domain: cfg.domain,
    niche: cfg.niche, template: cfg.template,
    h1: pages[0]?.h1 || '',
    desc: pages[0]?.metaDescription || '',
    keywords: (cfg.keywords || []).map((k: any) => k.keyword),
    painPoints: (cfg.keywords || []).slice(0, 3).map((k: any) => k.userComplaints?.[0] || ''),
    colorScheme: cfg.designConfig.colorScheme,
  };
}

function loadAll(): SiteInfo[] {
  return fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort().map(loadSite);
}

function shortDesc(site: SiteInfo): string {
  return `Free ${site.niche}. No signup, no email. ${site.painPoints[0] || 'Instant results.'}`.substring(0, 160);
}

function mediumDesc(site: SiteInfo): string {
  return `Tired of ${site.niche} tools that ask for your email before showing results? ${site.brand} is different. Just enter your data and get instant estimates — no signup, no ads, no catch. Based on real industry data.`.substring(0, 300);
}

function productHuntTagline(site: SiteInfo): string {
  const lines = [
    `No more "${site.painPoints[0]}" — get instant ${site.niche} results, no email required.`,
    `Free ${site.niche} tool. No signup. Just answers.`,
    `The ${site.niche} that doesn't ask for your email. Free forever.`,
  ];
  return lines[Math.floor(Math.random() * lines.length)].substring(0, 60);
}

function productHuntDesc(site: SiteInfo): string {
  return `👋 I built ${site.brand} because I was frustrated with ${site.niche} tools that hide results behind paywalls and email gates.

**What it does:**
${site.h1}

**Why it's different:**
✅ No signup — just use it
✅ No email — we never ask
✅ Real data — not guesswork
✅ Instant results
✅ Free forever

**Tech:** Next.js, serverless, static rendering. Blazing fast.

I'd love your feedback!`;
}

function tags(site: SiteInfo): string[] {
  const base = [site.niche, 'free', 'tool', 'no-signup'];
  if (site.template === 'A') base.push('calculator');
  if (site.template === 'B') base.push('comparison');
  if (site.niche.includes('game')) base.push('game', 'gaming');
  if (site.niche.includes('AI') || site.domain.includes('ai-')) base.push('AI', 'artificial-intelligence');
  return [...new Set(base)].slice(0, 8);
}

const PLATFORMS: Record<string, { name: string; url: string; submitUrl?: string }> = {
  alternativeto: { name: 'AlternativeTo', url: 'https://alternativeto.net/', submitUrl: 'https://alternativeto.net/software/add/' },
  producthunt: { name: 'Product Hunt', url: 'https://www.producthunt.com/', submitUrl: 'https://www.producthunt.com/posts/new' },
  toolify: { name: 'Toolify', url: 'https://www.toolify.ai/', submitUrl: 'https://www.toolify.ai/submit' },
  saashub: { name: 'SaaS Hub', url: 'https://www.saashub.com/', submitUrl: 'https://www.saashub.com/submit' },
  betalist: { name: 'BetaList', url: 'https://betalist.com/', submitUrl: 'https://betalist.com/submit' },
  indiehackers: { name: 'Indie Hackers', url: 'https://www.indiehackers.com/', submitUrl: 'https://www.indiehackers.com/products/new' },
  crozdesk: { name: 'Crozdesk', url: 'https://crozdesk.com/', submitUrl: 'https://crozdesk.com/submit-software' },
  g2: { name: 'G2', url: 'https://www.g2.com/', submitUrl: 'https://www.g2.com/products/new' },
  capterra: { name: 'Capterra', url: 'https://www.capterra.com/', submitUrl: 'https://www.capterra.com/software-submission' },
  getapp: { name: 'GetApp', url: 'https://www.getapp.com/', submitUrl: 'https://www.getapp.com/software-submission' },
  saasworthy: { name: 'SaaSWorthy', url: 'https://www.saasworthy.com/', submitUrl: 'https://www.saasworthy.com/submit-software' },
  futurepedia: { name: 'Futurepedia', url: 'https://www.futurepedia.io/', submitUrl: 'https://www.futurepedia.io/submit-tool' },
  theresanaiforthat: { name: "There's An AI For That", url: 'https://theresanaiforthat.com/', submitUrl: 'https://theresanaiforthat.com/submit/' },
  topaitools: { name: 'TopAiTools', url: 'https://topai.tools/', submitUrl: 'https://topai.tools/submit' },
  sideprojectors: { name: 'SideProjectors', url: 'https://www.sideprojectors.com/', submitUrl: 'https://www.sideprojectors.com/project/new' },
  startupbuffer: { name: 'Startup Buffer', url: 'https://startupbuffer.com/', submitUrl: 'https://startupbuffer.com/submit' },
  launchingnext: { name: 'Launching Next', url: 'https://www.launchingnext.com/', submitUrl: 'https://www.launchingnext.com/submit/' },
};

function generateAll(site: SiteInfo) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`${site.brand} — ${site.domain}`);
  console.log(`${'═'.repeat(60)}`);

  console.log('\n📋 通用信息');
  console.log(`  Name: ${site.brand}`);
  console.log(`  URL: https://${site.domain}/`);
  console.log(`  Short: ${shortDesc(site)}`);
  console.log(`  Tags: ${tags(site).join(', ')}`);

  console.log('\n🟠 Product Hunt');
  console.log(`  Tagline: ${productHuntTagline(site)}`);
  console.log(`  Description:\n${productHuntDesc(site)}`);

  console.log('\n📝 各平台提交链接:');
  for (const [key, p] of Object.entries(PLATFORMS)) {
    console.log(`  ${p.name}: ${p.submitUrl || p.url}`);
  }

  console.log('\n📸 截图要求:');
  console.log('  - 1280x800 PNG, 工具首页截图');
  console.log('  - Show the calculator/table without personal info');
  console.log('  - Clean background, no browser chrome');
}

function generateQuickList(sites: SiteInfo[]) {
  console.log('\n=== Quick Submit Checklist ===\n');
  for (const site of sites) {
    const t = tags(site);
    console.log(`${site.brand}`);
    console.log(`  URL: https://${site.domain}/`);
    console.log(`  Desc: ${shortDesc(site)}`);
    console.log(`  Tags: ${t.slice(0, 5).join(', ')}`);
    console.log(`  PH Tagline: ${productHuntTagline(site)}`);
    console.log();
  }
}

function main() {
  const sites = loadAll();
  const idx = parseInt(process.argv[3] || '');
  const platform = process.argv[4] || '';

  if (!isNaN(idx) && idx >= 0 && idx < sites.length) {
    // Single site — full detail
    generateAll(sites[idx]);
  } else if (platform && PLATFORMS[platform]) {
    // All sites for one platform
    console.log(`\n=== ${PLATFORMS[platform].name} Submissions ===\n`);
    for (const site of sites) {
      console.log(`${site.brand} | ${shortDesc(site)} | https://${site.domain}/ | ${tags(site).join(', ')}`);
    }
  } else {
    // All sites — quick list
    generateQuickList(sites);
    console.log(`\n共 ${sites.length} 个站点。`);
    console.log('用法: npx tsx src/cli/submit-directories.ts [site-index] [platform-key]');
    console.log('  npx tsx src/cli/submit-directories.ts          → 所有站点摘要');
    console.log('  npx tsx src/cli/submit-directories.ts 0        → site-001 完整详情');
    console.log('  npx tsx src/cli/submit-directories.ts - producthunt → 所有站点 PH 格式');
    console.log('\n可用平台:', Object.keys(PLATFORMS).join(', '));
  }
}

main();
