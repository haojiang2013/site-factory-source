/**
 * YouTube Video Content Generator — Phase 3: Content Leverage
 * Generates 30-second tool demo scripts + SEO titles/descriptions for all 25 sites.
 * Usage: npx tsx src/cli/youtube-generate.ts [site-index]
 */
import fs from 'fs';
import path from 'path';

const DATA = path.resolve(__dirname, '..', 'data');

interface SiteInfo {
  slug: string; brand: string; domain: string; niche: string;
  template: string; h1: string; desc: string; keywords: string[]; painPoints: string[];
}

function loadSites(): SiteInfo[] {
  return fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort().map(dir => {
    const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
    const pages = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'pages.json'), 'utf8'));
    return {
      slug: dir, brand: cfg.designConfig.brandName, domain: cfg.domain,
      niche: cfg.niche, template: cfg.template,
      h1: pages[0]?.h1 || '', desc: pages[0]?.metaDescription || '',
      keywords: (cfg.keywords || []).slice(0, 5).map((k: any) => k.keyword),
      painPoints: (cfg.keywords || []).slice(0, 2).map((k: any) => k.userComplaints?.[0] || ''),
    };
  });
}

function generateScript(site: SiteInfo): string {
  const pain = site.painPoints[0] || '';
  return `[0:00-0:05] INTRO
Show ${site.domain} homepage with cursor hovering over the calculator.
Voice: "Tired of ${pain}? Meet ${site.brand} — free ${site.niche}."

[0:05-0:15] DEMO
Type sample values into the calculator fields. Show results updating instantly.
Voice: "No email. No signup. Just enter your info and get instant results."
${site.template === 'A' ? 'Highlight the total estimate appearing at the bottom.' : 'Scroll through the comparison table showing key differences.'}

[0:15-0:25] FEATURES
Cut to feature bullets overlaying the tool:
✅ Free forever
✅ No signup
✅ Real data
✅ Mobile friendly
Voice: "Based on real industry data. Works on desktop and mobile. Free forever."

[0:25-0:30] CTA
Show ${site.domain} URL prominently. Fade to black.
Voice: "Try it now at ${site.domain} — link in description."`;
}

function generateTitle(site: SiteInfo): string {
  const titles = [
    `Free ${site.niche} — No Signup Required (${site.brand} Demo)`,
    `How to ${site.keywords[0] || site.niche} in 30 Seconds (Free Tool)`,
    `${site.brand}: The Free ${site.niche} That Doesn't Ask for Email`,
    `Stop Paying for ${site.niche} Tools — Try This Free Alternative`,
    `Best Free ${site.niche} 2026 — ${site.brand} Walkthrough`,
  ];
  return titles[Math.floor(Math.random() * titles.length)].substring(0, 100);
}

function generateDescription(site: SiteInfo): string {
  return `🔗 Try ${site.brand} for free: https://${site.domain}/

Tired of ${site.niche} tools that ask for your email before showing results?

${site.brand} is different:
✅ No signup required
✅ Instant results
✅ Based on real industry data
✅ Works on mobile and desktop
✅ 100% free — no ads, no catch

${site.desc}

#${site.niche.replace(/\s+/g, '')} #FreeTool #NoSignup #${site.template === 'A' ? 'Calculator' : 'Comparison'}

📺 More free tools: https://gomovecalc.xyz/hub`;
}

function generateTags(site: SiteInfo): string[] {
  return [
    site.niche, 'free tool', 'no signup',
    site.template === 'A' ? 'calculator' : 'comparison',
    'free online tool', site.brand,
    site.keywords[0] || '', 'productivity tool', 'free website',
  ].slice(0, 10);
}

function main() {
  const sites = loadSites();
  const idx = parseInt(process.argv[2] || '');

  const selectedSites = isNaN(idx) ? sites : [sites[idx]];

  for (const site of selectedSites) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`${site.brand} — ${site.domain}`);
    console.log(`${'═'.repeat(60)}`);

    console.log('\n📹 VIDEO TITLE (pick one):');
    console.log(`   ${generateTitle(site)}`);

    console.log('\n🏷️ TAGS (copy all):');
    console.log(`   ${generateTags(site).join(', ')}`);

    console.log('\n📝 DESCRIPTION:');
    console.log(generateDescription(site).split('\n').map(l => `   ${l}`).join('\n'));

    console.log('\n🎬 30-SECOND SCRIPT:');
    console.log(generateScript(site).split('\n').map(l => `   ${l}`).join('\n'));

    console.log('\n📸 SCREENSHOT STEPS:');
    console.log('   1. Open https://' + site.domain + '/');
    console.log('   2. Enter sample values');
    console.log('   3. Screenshot the results');
    console.log('   4. Record 30s screen capture (OBS or Screen Studio)');
    console.log('   5. AI voiceover: elevenlabs.io or play.ht (free tier)');
    console.log('   6. Edit with Canva or CapCut (free templates)');
  }

  if (isNaN(idx)) {
    console.log(`\n\nGenerated content for ${sites.length} sites.`);
    console.log('Use: npx tsx src/cli/youtube-generate.ts [0-24] for single site detail');
  }
}

main();
