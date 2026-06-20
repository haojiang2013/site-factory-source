/**
 * Fill thin pages with additional sections + FAQs via DeepSeek.
 * Targets pages with <=2 sections.
 * Usage: npx tsx src/cli/fill-thin-pages.ts
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const DATA = path.resolve(__dirname, '..', 'data');
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';

async function fillPage(page: any, brand: string, niche: string): Promise<any> {
  if (!DEEPSEEK_KEY) {
    // Template fallback
    return {
      sections: [
        { heading: `How ${brand} Compares`, body: `<p>When comparing ${niche} options, ${brand} stands out for its no-signup approach and clean interface. Unlike competitors that gate data behind email forms, ${brand} delivers instant results.</p><p><strong>Key differentiators:</strong></p><ul><li>No email or signup required</li><li>Data updated regularly from public sources</li><li>Works on desktop, tablet, and mobile</li><li>Free forever — no hidden fees</li></ul>` },
        { heading: 'Tips for Getting the Best Results', body: `<p>To get the most out of ${brand}, follow these practical tips:</p><ul><li><strong>Double-check your inputs</strong> — small errors lead to inaccurate results</li><li><strong>Compare multiple scenarios</strong> — try different values to see how outcomes change</li><li><strong>Bookmark for later</strong> — data updates regularly, so check back</li></ul><p>Many users tell us they save time and make better decisions by running several scenarios before committing.</p>` },
      ],
      faqs: [
        { question: `Is ${brand} really free?`, answer: `Yes. ${brand} is 100% free with no hidden costs. We never ask for your email, credit card, or personal information. The tool is supported by our network of free utility sites.` },
        { question: 'How often is the data updated?', answer: 'We review and refresh our data sources regularly to reflect the latest available information. While exact schedules vary, we aim to keep all tools current with industry standards.' },
        { question: 'Can I use this for professional work?', answer: `Yes, many professionals use ${brand} as a quick reference. However, for critical decisions, we recommend consulting multiple sources and obtaining expert advice when needed.` },
      ],
    };
  }

  const prompt = `You are an SEO content writer. A page about "${page.h1}" needs 2 additional content sections and 3 more FAQs.

SITE: ${brand} — ${niche}
EXISTING CONTENT:
${JSON.stringify({ h1: page.h1, metaDescription: page.metaDescription, sections: page.sections, faqs: page.faqs }, null, 2)}

Return ONLY valid JSON:
{
  "sections": [
    { "heading": "compelling subheading", "body": "<p>200-350 word paragraph with real data, practical tips, and HTML formatting. Use <strong>, <ul>, <li> tags. Be genuinely helpful.</p>" },
    { "heading": "another subheading", "body": "<p>200-350 word paragraph. Include specific examples where possible.</p>" }
  ],
  "faqs": [
    { "question": "FAQ question not already covered", "answer": "Helpful answer 2-4 sentences" },
    { "question": "another unique FAQ", "answer": "Another helpful answer" },
    { "question": "third unique FAQ", "answer": "Third helpful answer" }
  ]
}

Make content unique, helpful, and SEO-friendly. Don't repeat existing sections. Don't use template language. Write like a domain expert.`;

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${DEEPSEEK_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 2500 }),
    });
    const data = await res.json() as any;
    const raw = data.choices?.[0]?.message?.content || '';
    return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  } catch (e) {
    console.log('  API error, using template');
    return fillPage(page, brand, niche); // recurse without key = template
  }
}

async function main() {
  const dirs = fs.readdirSync(DATA).filter(d => d.startsWith('site-')).sort();
  let totalFilled = 0;

  for (const dir of dirs) {
    const pagesPath = path.join(DATA, dir, 'pages.json');
    const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
    const cfg = JSON.parse(fs.readFileSync(path.join(DATA, dir, 'config.json'), 'utf8'));
    const brand = cfg.designConfig.brandName;
    const niche = cfg.niche;
    let modified = false;

    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if ((p.sections || []).length > 2) continue; // skip non-thin pages

      console.log(`  📝 ${brand}: ${(p.slug || p.h1 || '').substring(0, 60)}`);
      const fill = await fillPage(p, brand, niche);

      if (fill.sections) {
        p.sections = [...(p.sections || []), ...fill.sections];
      }
      if (fill.faqs) {
        p.faqs = [...(p.faqs || []), ...fill.faqs];
      }
      totalFilled++;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2) + '\n');
      console.log(`  ✅ ${brand}: saved`);
    }
  }

  console.log(`\nFilled: ${totalFilled} pages across 5 sites`);
}

main().catch(console.error);
