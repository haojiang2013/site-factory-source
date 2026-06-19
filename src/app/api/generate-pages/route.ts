/**
 * Automated AI Page Generator — Vercel Cron endpoint
 * Runs weekly, finds uncovered keywords, generates new pages via DeepSeek,
 * commits to GitHub → triggers Vercel auto-deploy.
 *
 * GET /api/generate-pages?secret=CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = 'haojiang2013/site-factory';
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';

interface KeywordData {
  keyword: string; searchVolume: number; difficulty: number; intent: string;
  serpWeakness: string; userComplaints: string[];
}

async function generateContent(brand: string, niche: string, kw: KeywordData): Promise<any> {
  if (!DEEPSEEK_KEY) return templateContent(brand, niche, kw);

  const prompt = `Write SEO content for a free tool page. Return ONLY valid JSON, no markdown, no code fences.

SITE: ${brand} — ${niche}
KEYWORD: ${kw.keyword} (SV: ${kw.searchVolume}/mo)
PAIN: ${kw.userComplaints.join('; ')}

Return: {"h1":"<70 chars with keyword>","metaDescription":"<160 chars>","sections":[{"type":"text","heading":"...","body":"<p>200-400 words with real data. Use HTML tags.</p>"}],"faqs":[{"question":"...","answer":"2-4 sentences"}]}
Create 2-3 sections and 4-6 FAQs.`;

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${DEEPSEEK_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 3000 }),
    });
    const data: any = await res.json();
    const raw = data.choices?.[0]?.message?.content || '';
    return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  } catch {
    return templateContent(brand, niche, kw);
  }
}

function templateContent(brand: string, niche: string, kw: KeywordData): any {
  const pain = kw.userComplaints[0] || 'inaccurate results';
  return {
    h1: `${kw.keyword.charAt(0).toUpperCase() + kw.keyword.slice(1)} — Free ${niche}`,
    metaDescription: `Free ${kw.keyword}. No email, no signup. ${brand} fixes "${pain}". Instant results.`,
    sections: [
      { type: 'text', heading: `Why Most ${niche} Tools Fail`, body: `<p>Searching for "${kw.keyword}" usually leads to tools that demand your email before showing results. <strong>${brand} is different.</strong> No signup needed — just instant, accurate results.</p>` },
      { type: 'text', heading: `How ${brand} Works`, body: `<p>Enter your details, get results instantly. No email, no ads, no catch. Based on real industry data, updated regularly.</p>` },
    ],
    faqs: [
      { question: `Is ${brand} really free?`, answer: `Yes. No email, no signup, no credit card. 100% free.` },
      { question: `How is this different from other ${niche} tools?`, answer: `Most ask for email. We don't. Most show ads. We don't. Just answers.` },
      { question: `Can I use this on mobile?`, answer: `Yes — works on desktop, tablet, and phone.` },
    ],
  };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

async function getFileContent(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { content: Buffer.from(data.content, 'base64').toString('utf8'), sha: data.sha };
  } catch { return null; }
}

async function updateFile(path: string, content: string, sha: string, message: string) {
  return fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: Buffer.from(content).toString('base64'), sha }),
  });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GH_TOKEN not configured' }, { status: 500 });
  }

  const results: any[] = [];
  let totalNew = 0;

  // Get repo directory listing
  const dirsRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/src/data?ref=master`, {
    headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
  });
  if (!dirsRes.ok) {
    return NextResponse.json({ error: 'Cannot list data dir', status: dirsRes.status }, { status: 500 });
  }
  const dirs = (await dirsRes.json() as any[]).filter((d: any) => d.name.startsWith('site-')).sort();

  for (const dir of dirs.slice(0, 5)) { // Process 5 sites per run to stay within time limits
    const dirName = dir.name;

    // Read config.json
    const configFile = await getFileContent(`src/data/${dirName}/config.json`);
    if (!configFile) continue;
    const config = JSON.parse(configFile.content);

    // Read pages.json
    const pagesFile = await getFileContent(`src/data/${dirName}/pages.json`);
    if (!pagesFile) continue;
    const pages = JSON.parse(pagesFile.content);

    // Read kw-research.json (optional)
    const kwFile = await getFileContent(`src/data/${dirName}/kw-research.json`);
    const kwData = kwFile ? JSON.parse(kwFile.content) : null;
    if (!kwData?.keywords?.length) continue;

    // Find uncovered keywords
    const existingH1s = new Set(pages.map((p: any) => p.h1?.toLowerCase()));
    const newKWs = kwData.keywords.filter((kw: any) => {
      const key = kw.keyword.toLowerCase();
      return ![...existingH1s].some((h1: any) => h1.includes(key) || key.includes(h1.substring(0, 30)));
    });

    if (newKWs.length === 0) continue;

    const kw = newKWs[0]; // One per run per site
    const slug = kw.keyword ? slugify(kw.keyword) : `page-${Date.now()}`;

    try {
      const newPage = await generateContent(config.designConfig.brandName, config.niche, kw);
      newPage.slug = slug;
      newPage.title = newPage.h1;
      newPage.affiliateCTA = null;

      pages.push(newPage);
      const newContent = JSON.stringify(pages, null, 2) + '\n';

      const updateRes = await updateFile(
        `src/data/${dirName}/pages.json`,
        newContent,
        pagesFile.sha,
        `[auto] AI generated: ${slug}`
      );

      if (updateRes.ok) {
        totalNew++;
        results.push({ domain: config.domain, slug, status: 'created' });
      } else {
        results.push({ domain: config.domain, slug, status: 'gh_api_fail' });
      }
    } catch (e: any) {
      results.push({ domain: config.domain, slug, status: 'error', error: e.message?.substring(0, 80) });
    }
  }

  return NextResponse.json({
    success: true,
    sitesProcessed: Math.min(dirs.length, 5),
    newPages: totalNew,
    results,
  });
}
