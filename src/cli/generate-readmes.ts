/**
 * GitHub README Generator — Phase 2: Backlink Matrix
 * Creates a ready-to-push README.md for each of the 25 sites.
 * One repo per site → 25 high-authority backlinks.
 * Usage: npx tsx src/cli/generate-readmes.ts [output-dir]
 */
import fs from 'fs';
import path from 'path';

const DATA = path.resolve(__dirname, '..', 'data');

interface SiteInfo {
  slug: string; brand: string; domain: string; niche: string;
  template: string; h1: string; desc: string; keywords: string[];
  painPoints: string[];
}

function loadSites(): SiteInfo[] {
  return fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort().map(dir => {
    const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
    const pages = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'pages.json'), 'utf8'));
    return {
      slug: dir, brand: cfg.designConfig.brandName, domain: cfg.domain,
      niche: cfg.niche, template: cfg.template,
      h1: pages[0]?.h1 || '', desc: pages[0]?.metaDescription || '',
      keywords: (cfg.keywords || []).map((k: any) => k.keyword),
      painPoints: (cfg.keywords || []).slice(0, 2).map((k: any) => k.userComplaints?.[0] || ''),
    };
  });
}

function generateREADME(site: SiteInfo): string {
  const kw = site.keywords.slice(0, 5).map(k => `- ${k}`).join('\n');
  const pains = site.painPoints.map(p => `- ❌ "${p}"`).join('\n');

  return `# ${site.brand} — Free ${site.niche}

> **Live:** [${site.domain}](https://${site.domain}/) · **Free** · **No Signup** · **Open Source**

## What is ${site.brand}?

${site.desc}

## Why I Built This

Every ${site.niche} tool I tried had the same problems:

${pains}

So I built ${site.brand} — a ${site.niche} that actually just works. No email gates, no paywalls, no ads. Just answers.

## Features

- ✅ Instant results — no waiting
- ✅ No signup — just use it
- ✅ No email required
- ✅ Real data from industry sources
- ✅ Works on mobile
- ✅ Free forever

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Hosting:** Vercel (Edge)
- **Styling:** Tailwind CSS + inline design tokens
- **Performance:** Static + SSR, 90+ Lighthouse

## Keywords

${kw}

## Related Sites

This is part of a network of 25 free tool sites:
- [MoveWise](https://gomovecalc.xyz/) — Free moving cost calculator
- [EquityFlow](https://payitoff.xyz/) — Free mortgage calculator
- [CoverWise](https://paintwise.xyz/) — Free paint calculator
- [MixWise](https://pourtrue.8zla.com/) — Free concrete calculator
- [... more tools](https://gomovecalc.xyz/hub)

## License

MIT — free to use, modify, and share.

---

Built by [@stevenkuep](https://x.com/stevenkuep) · Part of the [Site Factory](https://gomovecalc.xyz/hub) project
`;
}

function main() {
  const sites = loadSites();
  const outDir = process.argv[2] || path.resolve(__dirname, '..', '..', 'repos');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const site of sites) {
    const dir = path.join(outDir, site.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const readme = generateREADME(site);
    fs.writeFileSync(path.join(dir, 'README.md'), readme);
    console.log(`✅ ${site.slug} → ${site.domain}`);
  }

  console.log(`\nGenerated 25 READMEs in: ${outDir}`);
  console.log('\nNext steps:');
  console.log('  1. Create 25 GitHub repos (or one monorepo)');
  console.log('  2. Push each folder as a repo');
  console.log('  3. Add repo links to the Hub page for cross-linking');
}

main();
