#!/usr/bin/env tsx
import 'dotenv/config';
import { searchReddit, extractComplaints } from '../lib/reddit-search';

// Monitor Reddit for opportunities to share our tools
const NICHE_KEYWORDS = [
  { niche:'moving cost calculator', site:'gomovecalc.xyz' },
  { niche:'mortgage overpayment calculator', site:'payitoff.xyz' },
  { niche:'paint coverage calculator', site:'paintwise.xyz' },
  { niche:'concrete calculator', site:'pourtrue-tool.xyz' },
  { niche:'flooring cost calculator', site:'floorfound-tool.xyz' },
  { niche:'renovation cost estimator', site:'renowise-tool.xyz' },
  { niche:'electrical load calculator', site:'voltwise-tool.xyz' },
  { niche:'garden soil calculator', site:'soilwise-tool.xyz' },
  { niche:'cleaning cost estimator', site:'cleancalc-tool.xyz' },
  { niche:'solar panel calculator', site:'solarwise-tool.xyz' },
  { niche:'HVAC sizing calculator', site:'hvacwise-tool.xyz' },
];

async function main() {
  console.log(`Reddit Monitor — ${new Date().toISOString()}\n`);

  for (const item of NICHE_KEYWORDS) {
    console.log(`Searching: ${item.niche}...`);
    const posts = await searchReddit(item.niche);

    if (posts.length > 0) {
      // Find posts that are questions ("is there a good X", "X alternative")
      const questions = posts.filter(p =>
        p.title.toLowerCase().includes('good') ||
        p.title.toLowerCase().includes('alternative') ||
        p.title.toLowerCase().includes('recommend') ||
        p.selftext.toLowerCase().includes('looking for')
      );

      if (questions.length > 0) {
        console.log(`  🔔 ${questions.length} opportunity posts for ${item.site}:`);
        questions.slice(0, 3).forEach(q => {
          console.log(`    - r/${q.subreddit}: "${q.title.slice(0, 80)}" (${q.ups} upvotes)`);
          console.log(`      ${q.url}`);
        });
      } else {
        console.log(`  📊 ${posts.length} posts, no clear opportunities`);
      }
    }
  }
}

main().catch(e => console.error('Monitor failed:', e.message));
