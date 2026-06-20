/**
 * Gemini+DeepSeek mixed writing — Group B (financial)
 * Usage: npx tsx src/cli/gemini-mix.ts
 */
import fs from 'fs';

const KEY = 'AQ.Ab8RN6Lfu5uyFjT7Tab3nbWGleNgVrfEoCboLRB5doIxEmt49Q';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const dirs = ['site-001-moving-calculator', 'site-002-mortgage-calc'];
const styles = ['short punchy with numbers', 'direct commands', 'casual conversational', 'data-heavy examples', 'active voice Q&A'];

async function main() {
  let total = 0;
  for (const dir of dirs) {
    const pages = JSON.parse(fs.readFileSync(`src/data/${dir}/pages.json`, 'utf8'));
    console.log(`${dir}: ${pages.length}p`);
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if (!p.sections || p.sections.length < 2) continue;
      const si = (i % 2) + 1;
      if (si >= p.sections.length) continue;
      const orig = p.sections[si].body;
      if (!orig || orig.length < 50) continue;

      const style = styles[i % styles.length];
      console.log(`  [${i}] ${style}...`);
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Rewrite ${style}. Return ONLY HTML.\n\n${orig}` }] }],
              generationConfig: { temperature: 0.9, maxOutputTokens: 600 },
            }),
          }
        );
        const data = await res.json() as any;
        if (data.error) {
          console.log(`    RATE, waiting 25s...`);
          await sleep(25000);
          i--; continue;
        }
        let rewritten = data.candidates[0].content.parts[0].text;
        rewritten = rewritten.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
        p.sections[si].body = rewritten;
        total++;
        console.log(`    OK`);
      } catch (e: any) {
        console.log(`    err: ${e.message}`);
      }
      await sleep(15000);
    }
    fs.writeFileSync(`src/data/${dir}/pages.json`, JSON.stringify(pages, null, 2));
    console.log(`  saved`);
  }
  console.log(`\nDONE: ${total} sections rewritten with Gemini`);
}

main();
