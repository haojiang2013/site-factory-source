/**
 * Full-site audit — checks all 25 domains for:
 * 1. HTTP 200
 * 2. No Chinese text leakage
 * 3. Content rendered (h1, meta, OG, JSON-LD)
 * 4. Template-specific features
 *
 * Usage: npx tsx src/cli/audit-all-sites.ts
 */
import fs from 'fs';
import path from 'path';

const DATA = path.resolve(__dirname, '..', 'data');

interface AuditResult {
  domain: string; template: string; brand: string;
  home: { ok: boolean; status: number; hasH1: boolean; hasMeta: boolean; hasOG: boolean; hasJSONLD: boolean; chineseText: string[] };
  subPages?: string;
  issues: string[];
}

async function checkPage(url: string): Promise<{ ok: boolean; status: number; html: string }> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'SiteFactory-Audit/1.0' } });
    return { ok: res.ok, status: res.status, html: await res.text() };
  } catch (e: any) {
    return { ok: false, status: 0, html: e.message || 'fetch failed' };
  }
}

function findChinese(html: string): string[] {
  const matches = html.match(/[一-鿿㐀-䶿]{2,}/g);
  return matches ? [...new Set(matches)].slice(0, 10) : [];
}

async function auditSite(dir: string): Promise<AuditResult> {
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
  const pages = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'pages.json'), 'utf8'));
  const domain = cfg.domain;
  const brand = cfg.designConfig.brandName;
  const template = cfg.template;
  const issues: string[] = [];

  // Check homepage
  const homeUrl = `https://${domain}/`;
  const { ok, status, html } = await checkPage(homeUrl);

  const hasH1 = html.includes('<h1');
  const hasMeta = html.includes('<meta name="description"');
  const hasOG = html.includes('og:title');
  const hasJSONLD = html.includes('application/ld+json');
  const chinese = findChinese(html);

  if (!ok) issues.push(`Homepage HTTP ${status}`);
  if (!hasH1) issues.push('Missing H1');
  if (!hasMeta) issues.push('Missing meta description');
  if (!hasOG) issues.push('Missing OG tags');
  if (!hasJSONLD) issues.push('Missing JSON-LD');
  if (chinese.length > 0) {
    issues.push(`Chinese text: ${chinese.join(', ')}`);
  }

  // Template-specific checks
  if (template === 'A') {
    // Calculator: check widget rendered
    if (!html.includes('calculator') && !html.includes('Calculator')) issues.push('Calculator widget may not be rendered');
  }
  if (template === 'B') {
    if (!html.includes('<table') && !html.includes('data-table')) issues.push('Data table may be missing');
  }

  // Check a sub-page (first non-home page)
  let subPageCheck = '';
  if (pages.length > 1) {
    const sub = pages[1];
    const slug = sub.slug || '';
    if (slug) {
      const subUrl = `https://${domain}/${slug}/`;
      const subRes = await checkPage(subUrl);
      const subChinese = findChinese(subRes.html);
      subPageCheck = `${subRes.status} ${subChinese.length > 0 ? '⚠️CN' : '✅'} /${slug}`;
      if (subChinese.length > 0) issues.push(`Sub-page Chinese: ${subChinese.join(', ')}`);
    }
  }

  // Check for kw-research Chinese leakage in page content
  const allPageText = JSON.stringify(pages);
  if (/[一-鿿]/.test(allPageText)) {
    issues.push('pages.json has Chinese characters');
  }

  return {
    domain, template, brand,
    home: { ok, status, hasH1, hasMeta, hasOG, hasJSONLD, chineseText: chinese },
    subPages: subPageCheck || 'N/A',
    issues,
  };
}

async function main() {
  const dirs = fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort();
  console.log(`Auditing ${dirs.length} sites...\n`);

  const results: AuditResult[] = [];
  for (let i = 0; i < dirs.length; i++) {
    const d = dirs[i];
    process.stdout.write(`  [${String(i + 1).padStart(2)}/${dirs.length}] ${d}... `);
    const r = await auditSite(d);
    results.push(r);
    const icon = r.issues.length === 0 ? '✅' : '⚠️';
    console.log(`${icon} ${r.issues.length === 0 ? 'PASS' : r.issues.join('; ')}`);
  }

  // Summary
  const clean = results.filter(r => r.issues.length === 0).length;
  const withChinese = results.filter(r => r.home.chineseText.length > 0 || r.issues.some(i => i.includes('Chinese'))).length;
  const templateA = results.filter(r => r.template === 'A');
  const templateB = results.filter(r => r.template === 'B');
  const templateC = results.filter(r => r.template === 'C');

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`SUMMARY`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Clean: ${clean}/${results.length}`);
  console.log(`  Chinese text: ${withChinese} sites`);
  console.log(`  Template A (calc): ${templateA.length} sites, ${templateA.filter(r => r.issues.length === 0).length} clean`);
  console.log(`  Template B (data): ${templateB.length} sites, ${templateB.filter(r => r.issues.length === 0).length} clean`);
  console.log(`  Template C (guide): ${templateC.length} sites, ${templateC.filter(r => r.issues.length === 0).length} clean`);

  // Problem sites
  const problems = results.filter(r => r.issues.length > 0);
  if (problems.length > 0) {
    console.log(`\n❌ Sites with issues:`);
    problems.forEach(r => {
      console.log(`  ${r.domain} (${r.template}) — ${r.brand}`);
      r.issues.forEach(i => console.log(`    - ${i}`));
    });
  }

  // Save report
  const reportPath = path.resolve(__dirname, '..', '..', 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nFull report: ${reportPath}`);
}

main().catch(console.error);
