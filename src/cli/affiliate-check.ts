#!/usr/bin/env tsx
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Scan all site data for affiliate links and verify they're accessible
async function main() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const entries = fs.readdirSync(dataDir).filter(e => !e.startsWith('.'));
  const issues: string[] = [];

  for (const slug of entries) {
    try {
      const pages = JSON.parse(fs.readFileSync(path.join(dataDir, slug, 'pages.json'), 'utf-8'));
      // Template A pages: PageContent format
      for (const page of (Array.isArray(pages) ? pages : [pages])) {
        if (page.affiliateCTA?.link) {
          const link = page.affiliateCTA.link;
          try {
            const res = await fetch(link, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
            if (res.status >= 400) {
              issues.push(`❌ ${slug}: "${page.title?.slice(0,40)}" — ${link} → HTTP ${res.status}`);
            }
          } catch {
            issues.push(`⚠️ ${slug}: "${page.title?.slice(0,40)}" — ${link} → unreachable`);
          }
        }
        // Template B/C pages may have affiliate properties differently
        if (page.tableRows) {
          for (const row of page.tableRows) {
            if (row.affiliateUrl) {
              try {
                const res = await fetch(row.affiliateUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
                if (res.status >= 400) issues.push(`❌ ${slug}/${row.id}: ${row.affiliateUrl} → HTTP ${res.status}`);
              } catch {
                issues.push(`⚠️ ${slug}/${row.id}: ${row.affiliateUrl} → unreachable`);
              }
            }
          }
        }
      }
    } catch (e) { issues.push(`⚠️ ${slug}: parse error`); }
  }

  if (issues.length === 0) {
    console.log('✅ All affiliate links healthy');
  } else {
    console.log(`Found ${issues.length} issues:`);
    issues.forEach(i => console.log(i));
  }

  // Write report
  const report = { checkedAt: new Date().toISOString(), issues };
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'affiliate-report.json'), JSON.stringify(report, null, 2));
  console.log('Report: src/data/affiliate-report.json');
}

main().catch(e => { console.error('Check failed:', e.message); process.exit(1); });
