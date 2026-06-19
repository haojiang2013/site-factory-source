/**
 * Generate kw-research.json for sites that are missing it.
 * Uses DeepSeek API to add serpWeakness analysis to existing config keywords.
 *
 * Usage: npx tsx src/cli/gen-kw-research.ts
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const DATA = path.resolve(__dirname, '..', 'data');
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';

async function generateKWResearch(config: any): Promise<any> {
  const brand = config.designConfig.brandName;
  const niche = config.niche;
  const kws = config.keywords;

  const prompt = `You are an SEO analyst. I need SERP weakness analysis for a ${niche} tool called ${brand}.

Here are the keywords from config.json:
${JSON.stringify(kws.map((k: any) => ({keyword: k.keyword, searchVolume: k.searchVolume, difficulty: k.difficulty, intent: k.intent, userComplaints: k.userComplaints})), null, 2)}

Return ONLY valid JSON (no markdown fences, no extra text):
{
  "niche": "${niche}",
  "keywords": [
    // Copy ALL keywords from above EXACTLY, and add a "serpWeakness" field to each.
    // serpWeakness: 1-2 sentences about why current SERP results are weak for this keyword.
    // What do top-ranking pages do poorly? What user need is unmet?
  ],
  "topUserComplaints": ["5 most common user pain points across all keywords, sorted by frequency/severity"],
  "recommendedAngles": ["5 content/tool angles that exploit SERP weaknesses and would rank well"]
}

Make serpWeakness specific and actionable — reference actual SERP features/competitors where possible.`;

  if (!DEEPSEEK_KEY) {
    // Fallback: generate basic serpWeakness from userComplaints
    return {
      niche,
      keywords: kws.map((k: any) => ({
        ...k,
        serpWeakness: `Top results for "${k.keyword}" ${k.userComplaints[0] || 'lack quality interactive tools'}. Most SERP listings are outdated or require signup.`,
      })),
      topUserComplaints: [...new Set(kws.flatMap((k: any) => k.userComplaints))].slice(0, 5),
      recommendedAngles: [
        `Anonymous instant ${niche} with no sign-up required`,
        `Mobile-optimized ${niche} with real-time data`,
        `Side-by-side comparison of multiple ${niche} options`,
        `Free ${niche} with downloadable PDF report`,
        `AI-powered ${niche} that learns from actual user data`,
      ],
    };
  }

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${DEEPSEEK_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.5, max_tokens: 4000 }),
  });
  const data = await res.json() as any;
  const raw = data.choices?.[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
}

async function main() {
  const dirs = fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort();
  let generated = 0;

  for (const dir of dirs) {
    const kwPath = path.join(DATA, dir, 'kw-research.json');
    if (fs.existsSync(kwPath)) {
      console.log(`  ⏭ ${dir}: already exists`);
      continue;
    }

    const cfgPath = path.join(DATA, dir, 'config.json');
    if (!fs.existsSync(cfgPath)) {
      console.log(`  ⚠️ ${dir}: no config.json`);
      continue;
    }

    const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    if (!config.keywords?.length) {
      console.log(`  ⚠️ ${dir}: no keywords in config`);
      continue;
    }

    console.log(`  🧠 ${dir}: generating via DeepSeek...`);
    try {
      const research = await generateKWResearch(config);
      fs.writeFileSync(kwPath, JSON.stringify(research, null, 2) + '\n');
      console.log(`  ✅ ${dir}: ${research.keywords.length} keywords`);
      generated++;
    } catch (e: any) {
      console.log(`  ❌ ${dir}: ${e.message?.substring(0, 80)}`);
    }
  }

  console.log(`\nGenerated: ${generated} new kw-research.json files`);
}

main().catch(console.error);
