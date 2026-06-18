import 'dotenv/config';
import { ContentWriterAgent } from './src/agents/content-writer-agent';
import { ContentReviewerAgent } from './src/agents/content-reviewer-agent';
import { StateStore } from './src/lib/state-store';
import * as fs from 'fs';

const slug = 'site-001-moving-calculator';

(async () => {
  const config = await StateStore.loadConfig(slug);
  const sourceData = JSON.parse(fs.readFileSync(`src/data/${slug}/source-data.json`, 'utf-8'));
  const pages = JSON.parse(fs.readFileSync(`src/data/${slug}/pages.json`, 'utf-8'));
  const writer = new ContentWriterAgent();
  const reviewer = new ContentReviewerAgent();

  let rewriteCount = 0, passCount = 0;
  for (let i = 0; i < pages.length; i++) {
    const review = await reviewer.execute({
      page: pages[i], sourceData,
      designConfig: { brandName: config.designConfig.brandName }
    });
    if (review.overallVerdict === 'PASS') { passCount++; continue; }

    console.log(`Rewriting page ${i+1}: ${pages[i].title.slice(0,50)}`);
    try {
      pages[i] = await writer.execute({
        keyword: config.keywords[i], sourceData,
        designConfig: { brandName: config.designConfig.brandName },
        template: config.template,
      });
      rewriteCount++;
    } catch(e) { console.log(`  FAILED: ${(e as Error).message.slice(0,80)}`); }
  }
  await StateStore.saveAgentOutput(slug, 'pages.json', pages);
  console.log(`\nPassed: ${passCount} | Rewritten: ${rewriteCount} | Total: ${pages.length}`);
})();
