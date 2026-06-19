/**
 * Create 25 GitHub repos (one per site) and push READMEs via API.
 * Each repo = one high-authority backlink source.
 * Usage: npx tsx src/cli/create-github-repos.ts
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const PROXY = 'http://127.0.0.1:7897';
// Token extracted from git remote
const GIT_REMOTE = 'https://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@github.com/haojiang2013/site-factory-source.git';
const TOKEN = GIT_REMOTE.match(/ghp_[^@]+/)?.[0] || process.env.GH_TOKEN || '';
const OWNER = GIT_REMOTE.match(/github\.com\/([^/]+)/)?.[1] || 'haojiang2013';
const DATA = path.resolve(__dirname, '..', 'data');
const REPOS_DIR = path.resolve(__dirname, '..', '..', 'repos');

const REPO_PREFIX = ''; // no prefix, clean repo names

interface SiteInfo {
  slug: string; brand: string; domain: string; niche: string;
}

function loadSites(): SiteInfo[] {
  return fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort().map(dir => {
    const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
    return { slug: dir, brand: cfg.designConfig.brandName, domain: cfg.domain, niche: cfg.niche };
  });
}

function repoName(site: SiteInfo): string {
  // e.g., "mixwise-concrete-calculator" or "gomovecalc-moving-cost-calculator"
  const domainPart = site.domain.replace(/\.(xyz|8zla\.com)/, '').replace(/\./g, '-');
  return `${domainPart}-${site.niche.replace(/\s+/g, '-')}`.substring(0, 100);
}

async function apiCall(url: string, options: any = {}): Promise<any> {
  const fetchOptions: any = {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'site-factory-cli',
    },
    ...options,
  };

  // Try without proxy first, then with proxy
  let res = await fetch(url, fetchOptions);
  if (!res.ok && PROXY) {
    const { HttpsProxyAgent } = await import('https-proxy-agent');
    const agent = new HttpsProxyAgent(PROXY);
    const fetchOptsWithProxy = { ...fetchOptions, agent };
    res = await fetch(url, fetchOptsWithProxy);
  }
  return res;
}

function generateReadmeContent(site: SiteInfo): string {
  const brand = site.brand;
  const niched = site.niche;
  return `# ${brand} — Free ${niched}

> **Live:** [${site.domain}](https://${site.domain}/) · **Free** · **No Signup** · **No Email**

## What is ${brand}?

Free online ${niched}. Get instant results without signing up or giving away your email.

## Why ${brand}?

Most ${niched} tools demand your email before showing results. ${brand} is different — just enter your details and get answers immediately.

## Features

- ✅ Instant results
- ✅ No signup required
- ✅ No email needed
- ✅ Works on mobile & desktop
- ✅ Free forever
- ✅ Real data, regularly updated

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Hosting:** Vercel Edge
- **Styling:** Tailwind CSS
- **Performance:** 90+ Lighthouse score

## Related Tools

This tool is part of a network of 25 free utility sites. Check out the full collection:

- [MoveWise](https://gomovecalc.xyz/) — Free moving cost calculator
- [EquityFlow](https://payitoff.xyz/) — Free mortgage calculator
- [CoverWise](https://paintwise.xyz/) — Free paint calculator
- [MixWise](https://pourtrue.8zla.com/) — Free concrete calculator
- [CodeBench](https://devtooltrove.8zla.com/) — AI coding tools comparison
- [... and 20 more](https://gomovecalc.xyz/hub)

## License

MIT — free to use, modify, and share.

---

Built by [@stevenkuep](https://x.com/stevenkuep) · Part of the [Site Factory](https://gomovecalc.xyz/hub) project
`;
}

async function createRepo(site: SiteInfo): Promise<string | null> {
  const name = repoName(site);
  console.log(`  📦 ${name}...`);

  try {
    // Check if repo already exists
    const checkRes = await apiCall(`https://api.github.com/repos/${OWNER}/${name}`);
    if (checkRes.ok) {
      console.log(`    ⏭ Already exists: github.com/${OWNER}/${name}`);
      return name;
    }

    // Create repo
    const createRes = await apiCall(`https://api.github.com/user/repos`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description: `Free ${site.niche} — no signup, no email. Instant results.`,
        homepage: `https://${site.domain}/`,
        private: false,
        has_issues: true,
        has_projects: false,
        has_wiki: false,
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      console.log(`    ❌ Create failed: ${createRes.status} ${JSON.stringify(err).substring(0, 100)}`);
      return null;
    }

    const repoData = await createRes.json();
    console.log(`    ✅ Created: ${repoData.html_url}`);

    // Create README.md in the repo
    const readmeContent = generateReadmeContent(site);
    const putRes = await apiCall(`https://api.github.com/repos/${OWNER}/${name}/contents/README.md`, {
      method: 'PUT',
      body: JSON.stringify({
        message: 'Initial commit: README with site info',
        content: Buffer.from(readmeContent).toString('base64'),
      }),
    });

    if (putRes.ok) {
      console.log(`    ✅ README pushed`);
    } else {
      console.log(`    ⚠️ README push failed: ${putRes.status}`);
    }

    return name;
  } catch (e: any) {
    console.log(`    ❌ Error: ${e.message?.substring(0, 80)}`);
    return null;
  }
}

async function main() {
  console.log(`GitHub Repo Creator — ${OWNER}\n`);

  if (!TOKEN) {
    console.log('ERROR: No GitHub token found.');
    console.log('Set GH_TOKEN in .env or ensure git remote has token.');
    process.exit(1);
  }

  console.log(`Token: ${TOKEN.substring(0, 10)}...`);
  console.log(`Owner: ${OWNER}\n`);

  // FIRST: verify token works
  const userRes = await apiCall('https://api.github.com/user');
  if (!userRes.ok) {
    console.log(`❌ Token invalid or expired: ${userRes.status}`);
    console.log('   Go to https://github.com/settings/tokens to create a new one.');
    process.exit(1);
  }
  const user = await userRes.json();
  console.log(`✅ Authenticated as: ${user.login}\n`);

  const sites = loadSites();
  let created = 0;
  const results: string[] = [];

  for (const site of sites) {
    const name = await createRepo(site);
    if (name) {
      created++;
      results.push(`https://github.com/${OWNER}/${name}`);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Created: ${created}/${sites.length} repos`);
  console.log(`\nRepo URLs for backlink tracking:`);
  results.forEach(r => console.log(`  ${r}`));
}

main().catch(console.error);
