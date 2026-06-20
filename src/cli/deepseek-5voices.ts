/**
 * DeepSeek 5-voice rewrite — breaks semantic fingerprint across 25 sites.
 * Each group gets a distinct voice/prompt to scatter S-BERT embeddings.
 */
import fs from 'fs';

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || 'sk-b4381f43378840cfa6e843c131bbb9db';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// 5 voice prompts — each produces different sentence length, vocabulary, structure
const VOICES: Record<string, string> = {
  academic: 'Rewrite this in an academic style: longer sentences, formal vocabulary, cite specific data. Return ONLY HTML.',
  punchy: 'Rewrite this in a punchy short-sentence style: 5-8 word sentences, concrete numbers, no fluff. Return ONLY HTML.',
  casual: 'Rewrite this in a casual conversational style: use "I" and "you", everyday language, shorter paragraphs. Return ONLY HTML.',
  technical: 'Rewrite this in a technical manual style: bullet points, specific parameters, step-by-step format. Return ONLY HTML.',
  game: 'Rewrite this in an energetic gaming community style: direct, exciting, emoji-friendly tone. Return ONLY HTML.',
};

// Group → voice mapping
const groupVoices: Record<string, string> = {
  'site-004-ai-tools': 'academic', 'site-008-ai-coding': 'academic', 'site-011-ai-design': 'academic',
  'site-012-ai-marketing': 'academic', 'site-013-ai-video': 'academic', 'site-021-ai-productivity': 'academic',
  'site-022-ai-audio': 'academic', 'site-023-ai-data': 'academic',
  'site-001-moving-calculator': 'punchy', 'site-002-mortgage-calc': 'punchy',
  'site-003-paint-calc': 'casual', 'site-017-garden': 'casual', 'site-018-cleaning': 'casual', 'site-019-solar': 'casual',
  'site-006-concrete-calc': 'technical', 'site-007-flooring-calc': 'technical', 'site-009-reno-calc': 'technical',
  'site-016-electrical': 'technical', 'site-020-hvac': 'technical',
  'site-005-game-guide': 'game', 'site-010-boss-guide': 'game', 'site-014-game-items': 'game',
  'site-015-game-builds': 'game', 'site-024-game-weapons': 'game', 'site-025-game-npcs': 'game',
};

async function main() {
  const dirs = fs.readdirSync('src/data').filter(d => d.startsWith('site-')).sort();
  let total = 0;

  for (const dir of dirs) {
    const voiceKey = groupVoices[dir] || 'academic';
    const voicePrompt = VOICES[voiceKey];
    const pages = JSON.parse(fs.readFileSync(`src/data/${dir}/pages.json`, 'utf8'));
    console.log(`${dir} (${voiceKey}): ${pages.length}p`);

    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if (!p.sections || p.sections.length === 0) continue;
      // Pick a different section per page: cycle through 0, 1, 2
      const si = i % Math.min(p.sections.length, 3);
      const orig = p.sections[si].body;
      if (!orig || orig.length < 50) continue;

      process.stdout.write(`  [${i}] `);
      try {
        const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${DEEPSEEK_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: `${voicePrompt}\n\n${orig}` }], temperature: 1.0, max_tokens: 600 }),
        });
        const data = await res.json() as any;
        if (data.error) { console.log(`API err: ${data.error.message}`); continue; }
        let rewritten = data.choices[0].message.content;
        rewritten = rewritten.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
        if (rewritten.length < 30) { console.log('too short'); continue; }
        p.sections[si].body = rewritten;
        total++;
        console.log('OK');
      } catch (e: any) {
        console.log(`err: ${e.message}`);
      }
      await sleep(200); // gentle delay to avoid rate limits
    }
    fs.writeFileSync(`src/data/${dir}/pages.json`, JSON.stringify(pages, null, 2));
    console.log(`  saved`);
  }
  console.log(`\nDONE: ${total} sections rewritten with DeepSeek 5 voices`);
}

main();
