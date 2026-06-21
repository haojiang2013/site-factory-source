/**
 * Batch add lastUpdated + author to ALL pages across all 25 sites.
 * Run: npx tsx src/cli/batch-add-meta.ts
 */
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');
const dirs = fs.readdirSync(dataDir).filter(d => d.startsWith('site-')).sort();

const today = new Date().toISOString().split('T')[0]; // "2026-06-20"

let totalPages = 0;

for (const dir of dirs) {
  const pagesPath = path.join(dataDir, dir, 'pages.json');
  if (!fs.existsSync(pagesPath)) continue;

  const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));

  for (const page of pages) {
    // Only add if not already present
    if (!page.lastUpdated) {
      page.lastUpdated = today;
    }
    if (!page.author) {
      page.author = {
        name: 'Steven Kuep',
        url: 'https://github.com/pank770766',
        jobTitle: 'Independent Tool Developer',
      };
    }
    totalPages++;
  }

  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
  console.log(`  ✓ ${dir}: ${pages.length} pages updated`);
}

console.log(`\nDone. ${totalPages} pages across ${dirs.length} sites.`);
