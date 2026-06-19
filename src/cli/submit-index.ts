/**
 * Google / Bing Index Submission CLI
 * - Pings Google sitemap endpoint for all 25 sites
 * - Submits to IndexNow (Bing + Yandex)
 * Usage: node --require tsx/cjs src/cli/submit-index.ts [ping|indexnow|all]
 */
import fs from 'fs';
import path from 'path';
import https from 'https';

const DATA = path.resolve(__dirname, '..', 'data');

interface SiteInfo {
  slug: string;
  domain: string;
  brand: string;
}

function loadSites(): SiteInfo[] {
  const dirs = fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort();
  return dirs.map(dir => {
    const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
    return { slug: dir, domain: cfg.domain, brand: cfg.designConfig.brandName };
  });
}

function httpGet(url: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c: string) => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode || 0, body }));
    }).on('error', (e) => resolve({ status: -1, body: e.message }));
  });
}

/** Ping Google with sitemap URL (deprecated but still works) */
async function pingGoogle(site: SiteInfo): Promise<string> {
  const sitemapUrl = `https://${site.domain}/sitemap.xml`;
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  const { status, body } = await httpGet(pingUrl);
  if (status === 200) return `OK (200)`;
  return `${status} ${body.substring(0, 80)}`;
}

/** Submit to IndexNow (Bing, Yandex, Seznam) */
async function submitIndexNow(site: SiteInfo): Promise<string> {
  const apiKey = 'fa71c99a2cd5449fbbfc0c37f2cf6080'; // generated key
  const payload = JSON.stringify({
    host: site.domain,
    key: apiKey,
    keyLocation: `https://${site.domain}/indexnow-${apiKey}.txt`,
    urlList: [
      `https://${site.domain}/`,
      `https://${site.domain}/about`,
      `https://${site.domain}/contact`,
      `https://${site.domain}/privacy`,
      `https://${site.domain}/terms`,
    ],
  });

  return new Promise((resolve) => {
    const u = new URL('https://api.indexnow.org/IndexNow');
    const req = https.request({
      hostname: u.hostname, path: u.pathname,
      method: 'POST', headers: { 'Content-Type': 'application/json' },
    }, (res) => {
      let body = '';
      res.on('data', (c: string) => { body += c; });
      res.on('end', () => resolve(`${res.statusCode} ${body.substring(0, 80)}`));
    });
    req.on('error', (e) => resolve(`err: ${e.message}`));
    req.write(payload); req.end();
  });
}

async function main() {
  const sites = loadSites();
  console.log(`\nIndex Submission Tool — ${sites.length} sites\n`);

  const cmd = process.argv[2] || 'all';

  if (cmd === 'ping' || cmd === 'all') {
    console.log('=== Google Sitemap Ping ===\n');
    let ok = 0, fail = 0;
    for (const site of sites) {
      const result = await pingGoogle(site);
      if (result.startsWith('OK')) ok++; else fail++;
      console.log(`  ${result.startsWith('OK') ? '✅' : '❌'} ${site.domain} — ${result}`);
    }
    console.log(`\n  OK: ${ok}  Fail: ${fail}`);
  }

  if (cmd === 'indexnow' || cmd === 'all') {
    console.log('\n=== IndexNow (Bing/Yandex) ===\n');
    let ok = 0, fail = 0;
    for (const site of sites) {
      const result = await submitIndexNow(site);
      if (result.startsWith('200') || result.startsWith('202')) ok++; else fail++;
      console.log(`  ${result.startsWith('200') ? '✅' : '⚠️'} ${site.domain} — ${result}`);
    }
    console.log(`\n  OK: ${ok}  Fail: ${fail}`);
  }
}

main().catch(console.error);
