import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { StateStore } from '../lib/state-store';
import { ToolDeveloperAgent } from '../agents/tool-developer-agent';
import { ContentWriterAgent } from '../agents/content-writer-agent';
import { ContentWriterBAgent } from '../agents/content-writer-b-agent';
import { ContentWriterCAgent } from '../agents/content-writer-c-agent';
import { KWResearcherAgent } from '../agents/kw-researcher-agent';
import { DataCollectorAgent } from '../agents/data-collector-agent';
import { UIDesignerAgent } from '../agents/ui-designer-agent';
import { ContentReviewerAgent } from '../agents/content-reviewer-agent';
import { SEOAuditorAgent } from '../agents/seo-auditor-agent';
import { SiteConfig, PageContent, Keyword, SourceData } from '../lib/site-config';

/**
 * Full site generation pipeline.
 * Run: node --require tsx/cjs src/cli/generate-site.ts <slug>
 */
export async function runPipeline(siteSlug: string, skipCount?: number): Promise<void> {
  const skip = skipCount || 0;
  console.log(`\n🚀 Pipeline starting for: ${siteSlug}\n`);

  const config = await StateStore.loadConfig(siteSlug);
  console.log(`✅ Config loaded — ${config.niche} (template ${config.template})`);

  // ── Stage 1: Research ──
  console.log(`\n── Stage 1: Research ──`);

  // 1a. KW Researcher — discover keywords + user complaints
  const kw = new KWResearcherAgent();
  let keywords: Keyword[];
  try {
    const kwResult = await kw.execute({ niche: config.niche, targetCountry: config.targetCountry });
    keywords = kwResult.keywords;
    await StateStore.saveAgentOutput(siteSlug, 'kw-research.json', kwResult);
    console.log(`✅ KW Research — ${keywords.length} keywords, top complaints: ${kwResult.topUserComplaints.slice(0, 2).join('; ')}`);
    // Update config with discovered keywords
    config.keywords = keywords;
    await StateStore.saveConfig(config);
  } catch (e) {
    console.warn(`⚠️  KW Researcher failed, using existing keywords: ${(e as Error).message}`);
    keywords = config.keywords;
  }

  // 1b. Data Collector — gather structured source data
  const dc = new DataCollectorAgent();
  let sourceData: SourceData;
  try {
    sourceData = await dc.execute({
      niche: config.niche,
      dataNeeds: deriveDataNeeds(config.niche),
      targetCountry: config.targetCountry,
    });
    await StateStore.saveAgentOutput(siteSlug, 'source-data.json', sourceData);
    console.log(`✅ Data Collected — sources: ${sourceData._meta?.sources?.join(', ') || 'N/A'}`);
  } catch (e) {
    console.warn(`⚠️  Data Collector failed: ${(e as Error).message}`);
    sourceData = await StateStore.loadAgentOutput<SourceData>(siteSlug, 'source-data.json').catch(() => ({ _meta: { sources: [], freshnessTTL_days: 365, collectedAt: new Date().toISOString().slice(0, 10), verifiedBySecondSource: false } } as SourceData));
  }

  // 1c. UI Designer — visual identity
  const ui = new UIDesignerAgent();
  try {
    const designConfig = await ui.execute({ niche: config.niche, template: config.template });
    config.designConfig = designConfig;
    await StateStore.saveConfig(config);
    console.log(`✅ UI Design — ${designConfig.brandName} / ${designConfig.colorScheme} / ${designConfig.fontPair}`);
  } catch (e) {
    console.warn(`⚠️  UI Designer failed, using existing: ${(e as Error).message}`);
  }

  // ── Stage 2: Production ──
  console.log(`\n── Stage 2: Production ──`);

  // 2a. Tool Developer
  const toolDev = new ToolDeveloperAgent();
  const params = getDefaultParams(config.niche);
  const toolResult = await toolDev.execute({
    toolName: config.niche,
    niche: config.niche,
    parameters: params,
    formulaReference: getFormulaRef(config.niche),
  });
  await StateStore.saveAgentOutput(siteSlug, 'tool-code.json', toolResult);
  console.log(`✅ Tool code — ${toolResult.jsCode.length} chars, ${toolResult.testCases.length} test cases`);

  // 2b. Content Writer — select by template
  const writer = config.template === 'B' ? new ContentWriterBAgent() :
                 config.template === 'C' ? new ContentWriterCAgent() :
                 new ContentWriterAgent();
  const seedPages: any[] = [];
  const existingPages = skip > 0 ? await StateStore.loadAgentOutput<any[]>(siteSlug, 'pages.json').catch(() => []) : [];
  const seedKeywords = keywords.slice(skip, skip + 5);

  for (const kw of seedKeywords) {
    console.log(`  Writing: ${kw.keyword}`);
    const page = await writer.execute({
      keyword: kw,
      sourceData,
      designConfig: { brandName: config.designConfig.brandName },
      template: config.template,
    });
    seedPages.push(page);
  }
  const allPages = [...existingPages, ...seedPages];
  await StateStore.saveAgentOutput(siteSlug, 'pages.json', allPages);
  console.log(`✅ Content — ${seedPages.length} new pages (${allPages.length} total)`);

  // ── Stage 3: Review ──
  console.log(`\n── Stage 3: Review ──`);

  // 3a. Content Reviewer
  const reviewer = new ContentReviewerAgent();
  let passCount = 0;
  for (const page of seedPages) {
    try {
      const reviewResult = await reviewer.execute({
        page,
        sourceData,
        designConfig: { brandName: config.designConfig.brandName },
      });
      if (reviewResult.overallVerdict === 'PASS') passCount++;
      else console.warn(`  ⚠️  ${page.title.slice(0, 40)}... — ${reviewResult.issues.join('; ')}`);
    } catch (e) {
      console.warn(`  ⚠️  Review failed for ${page.title?.slice(0, 40)}: ${(e as Error).message}`);
    }
  }
  console.log(`✅ Content Review — ${passCount}/${seedPages.length} passed`);

  // 3b. SEO Auditor
  const seo = new SEOAuditorAgent();
  try {
    const seoResult = await seo.execute({
      pages: seedPages,
      siteSlug,
      domain: config.domain,
    });
    await StateStore.saveAgentOutput(siteSlug, 'seo-report.json', seoResult);
    console.log(`✅ SEO Audit — ${seoResult.overallVerdict} (${seoResult.issues.length} issues)`);
  } catch (e) {
    console.warn(`⚠️  SEO Auditor failed: ${(e as Error).message}`);
  }

  console.log(`\n✨ Pipeline complete: ${siteSlug}`);
  console.log(`   Review outputs in src/data/${siteSlug}/`);
  console.log(`   Run: npx next dev -p 3456 to preview`);
}

// ── Helpers ──

function getDefaultParams(niche: string): { name: string; type: string; description: string }[] {
  const n = niche.toLowerCase();
  if (n.includes('moving') || n.includes('搬家')) return [
    { name: 'movingType', type: 'select', description: 'Local / Long-distance / International' },
    { name: 'homeSize', type: 'select', description: 'Studio / 1BR / 2BR / 3BR / 4BR+' },
    { name: 'distance', type: 'number', description: 'Distance in miles (>0)' },
    { name: 'hasPiano', type: 'checkbox', description: 'Piano or large appliance?' },
    { name: 'packingService', type: 'select', description: 'Self / Partial / Full' },
    { name: 'storageNeeded', type: 'checkbox', description: 'Need temporary storage?' },
  ];
  if (n.includes('paint') || n.includes('油漆')) return [
    { name: 'roomWidth', type: 'number', description: 'Room width (feet)' },
    { name: 'roomLength', type: 'number', description: 'Room length (feet)' },
    { name: 'ceilingHeight', type: 'number', description: 'Ceiling height (feet, default 8)' },
    { name: 'doors', type: 'number', description: 'Number of doors (to subtract)' },
    { name: 'windows', type: 'number', description: 'Number of windows (to subtract)' },
    { name: 'coats', type: 'select', description: 'Coats (1-3)' },
  ];
  return [
    { name: 'param1', type: 'number', description: 'Primary input' },
    { name: 'param2', type: 'number', description: 'Secondary input' },
    { name: 'param3', type: 'select', description: 'Option' },
    { name: 'param4', type: 'checkbox', description: 'Toggle' },
  ];
}

function getFormulaRef(niche: string): string {
  const n = niche.toLowerCase();
  if (n.includes('moving')) return 'AMSA 2025 + U-Haul public pricing';
  if (n.includes('paint')) return 'EPA Architectural Coatings + Sherwin-Williams coverage data';
  return 'Industry standard — verify with two independent sources';
}

function deriveDataNeeds(niche: string): string[] {
  const n = niche.toLowerCase();
  if (n.includes('moving')) return ['average moving costs by home size', 'truck sizes', 'packing costs', 'storage fees', 'piano moving fees', 'seasonal price multipliers'];
  if (n.includes('paint')) return ['paint coverage per gallon by type', 'standard room dimensions', 'average paint prices', 'primer coverage rates'];
  return ['core pricing data', 'standard measurements', 'industry benchmarks'];
}
