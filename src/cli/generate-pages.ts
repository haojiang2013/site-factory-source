/**
 * AI Page Generator — Phase 3: Content Pipeline
 * Reads kw-research.json, generates new pages for uncovered keywords.
 * Uses DeepSeek API (configured in .env) for content generation.
 *
 * Usage:
 *   npx tsx src/cli/generate-pages.ts           — dry run: show what pages would be created
 *   npx tsx src/cli/generate-pages.ts --write   — actually generate and save pages
 *   npx tsx src/cli/generate-pages.ts 0         — single site (index 0-24)
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const DATA = path.resolve(__dirname, '..', 'data');
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

interface KWData {
  niche: string;
  keywords: Array<{
    keyword: string; searchVolume: number; difficulty: number; intent: string;
    serpWeakness: string; userComplaints: string[];
  }>;
}

interface SiteInfo {
  dir: string; config: any; pages: any[]; kwResearch: KWData;
}

function loadSite(dir: string): SiteInfo {
  const config = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
  const pages = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'pages.json'), 'utf8'));
  const kwPath = path.join(DATA, dir, 'kw-research.json');
  const kwResearch: KWData = fs.existsSync(kwPath)
    ? JSON.parse(fs.readFileSync(kwPath, 'utf8'))
    : { niche: config.niche, keywords: [] };
  return { dir, config, pages, kwResearch };
}

function loadAll(): SiteInfo[] {
  return fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort().map(loadSite);
}

function findNewKeywords(site: SiteInfo): KWData['keywords'] {
  const existingH1s = new Set(site.pages.map((p: any) => p.h1?.toLowerCase()));
  return site.kwResearch.keywords.filter(kw => {
    const key = kw.keyword.toLowerCase();
    return ![...existingH1s].some(h1 => h1.includes(key) || key.includes(h1.substring(0, 30)));
  });
}

async function generatePageContent(site: SiteInfo, kw: KWData['keywords'][0]): Promise<any> {
  if (!DEEPSEEK_KEY) {
    // Without API key, generate a template-based page
    return templatePage(site, kw);
  }

  const prompt = `Write SEO-optimized content for a free online tool page. Return ONLY valid JSON (no markdown, no code fences).

SITE: ${site.config.designConfig.brandName} — ${site.config.niche}
TARGET KEYWORD: ${kw.keyword}
SEARCH VOLUME: ${kw.searchVolume}/mo
USER PAIN: ${kw.userComplaints.join('; ')}
SERP WEAKNESS: ${kw.serpWeakness}

Return this JSON:
{
  "h1": "compelling H1 containing the keyword, under 70 chars",
  "metaDescription": "meta description under 160 chars with keyword and pain point",
  "sections": [
    { "type": "text", "heading": "2-3 compelling subheadings", "body": "200-400 word paragraphs with real data and practical tips. Use HTML <p>, <ul>, <li>, <strong> tags for formatting." }
  ],
  "faqs": [
    { "question": "FAQ question", "answer": "Helpful answer 2-4 sentences" }
  ]
}
Create 3-5 sections and 5-8 FAQs. Make content genuinely helpful, cite real numbers/metrics where possible.`;

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });
    const data = await res.json() as any;
    const raw = data.choices?.[0]?.message?.content || '';
    // Strip markdown code fences if present
    const json = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(json);
  } catch (e) {
    console.log('  API error, using template fallback:', (e as Error).message.substring(0, 60));
    return templatePage(site, kw);
  }
}

function templatePage(site: SiteInfo, kw: KWData['keywords'][0]): any {
  const brand = site.config.designConfig.brandName;
  const niche = site.config.niche;
  const pain = kw.userComplaints[0] || 'inaccurate results';

  return {
    h1: `${kw.keyword.charAt(0).toUpperCase() + kw.keyword.slice(1)} — Free ${niche}`,
    metaDescription: `Free ${kw.keyword}. No email, no signup. ${brand} fixes "${pain}". Based on real data. Instant results.`,
    sections: [
      {
        type: 'text',
        heading: `Why Most ${niche} Tools Are Frustrating`,
        body: `<p>If you've ever searched for "${kw.keyword}", you know the drill: click a link, see a promising tool, then — bam — a popup asking for your email before showing results. Or even worse, a paywall.</p><p><strong>${brand} is different.</strong> No email. No signup. No hidden fees. Just instant, accurate ${niche} results based on real industry data.</p><p>Our tool addresses the #1 complaint users have about existing options: <em>"${pain}."</em></p>`,
      },
      {
        type: 'text',
        heading: `How to Use ${brand} for ${kw.keyword}`,
        body: `<p>Using ${brand} is straightforward:</p><ul><li>Enter your details in the calculator above</li><li>Get instant results — no waiting, no email required</li><li>Compare options and make informed decisions</li></ul><p>Unlike other ${niche} tools that hide results behind signup forms, ${brand} shows you everything immediately. We update our data regularly to reflect current industry standards.</p>`,
      },
      {
        type: 'text',
        heading: `Real Data, Real ${niche.charAt(0).toUpperCase() + niche.slice(1)}`,
        body: `<p>Our estimates are based on publicly available industry data, cross-referenced with multiple independent sources. We don't guess — we calculate.</p><p>Whether you're a first-timer or a seasoned pro, ${brand} gives you the numbers you need without the hassle. Save this page, bookmark it, or share it — it's always free.</p>`,
      },
    ],
    faqs: [
      { question: `Is ${brand} really free?`, answer: `Yes. ${brand} is 100% free. No email required, no signup, no credit card. We believe useful tools should be freely accessible.` },
      { question: `How accurate is this ${niche}?`, answer: `Our calculations are based on publicly available industry data from reliable sources. Results are estimates and may vary by location and specific circumstances. Always get multiple quotes for major decisions.` },
      { question: `Do I need to create an account?`, answer: `No. ${brand} works instantly — just enter your values and see results. We never ask for personal information.` },
      { question: `Can I use ${brand} on my phone?`, answer: `Absolutely. ${brand} works on desktop, tablet, and mobile. No app download required — just open in your browser.` },
      { question: `How often is the data updated?`, answer: `We review and update our data regularly to ensure estimates reflect current market conditions and industry standards.` },
    ],
  };
}

async function main() {
  const sites = loadAll();
  const writeMode = process.argv.includes('--write');
  const siteIdx = parseInt(process.argv.find(a => /^\d+$/.test(a)) || '');
  const selectedSites = !isNaN(siteIdx) ? [sites[siteIdx]] : sites;

  console.log(`\nAI Page Generator — ${writeMode ? 'WRITE MODE' : 'DRY RUN'}`);
  console.log(DEEPSEEK_KEY ? 'DeepSeek API: configured\n' : 'Template mode (no API key)\n');

  let totalNew = 0;

  for (const site of selectedSites) {
    const newKWs = findNewKeywords(site);
    if (newKWs.length === 0) continue;

    console.log(`${site.config.designConfig.brandName} (${site.config.domain})`);
    console.log(`  ${site.pages.length} pages → ${newKWs.length} new keywords uncovered`);

    // Generate 1-2 new pages per site (don't overwhelm)
    const toGenerate = newKWs.slice(0, 2);

    for (const kw of toGenerate) {
      const slug = slugify(kw.keyword);
      console.log(`    📝 Generating: ${kw.keyword} (SV: ${kw.searchVolume})`);

      if (writeMode) {
        const newPage = await generatePageContent(site, kw);
        newPage.slug = slug;
        newPage.title = newPage.h1;
        newPage.type = 'text';
        newPage.affiliateCTA = null;

        site.pages.push(newPage);
        fs.writeFileSync(
          path.join(DATA, site.dir, 'pages.json'),
          JSON.stringify(site.pages, null, 2) + '\n'
        );
        console.log(`    ✅ Saved: /${slug}/`);
        totalNew++;
      } else {
        console.log(`    📋 Would create: /${slug}/`);
        totalNew++;
      }
    }
    console.log('');
  }

  console.log(`Total: ${totalNew} new pages ${writeMode ? 'SAVED' : 'identified (dry run)'}`);
  if (!writeMode) {
    console.log('\nRun with --write to actually generate and save pages.');
    console.log('npx tsx src/cli/generate-pages.ts --write');
  }
}

main().catch(console.error);
