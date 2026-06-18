import { BaseAgent, AgentConfig } from './base-agent';
import { SEO_AUDITOR_PROMPT } from './prompts/seo-auditor';
import { PageContent } from '../lib/site-config';

export interface SEOAuditInput {
  pages: PageContent[];
  siteSlug: string;
  domain: string;
}

export interface SEOAuditOutput {
  overallVerdict: 'PASS' | 'FAIL';
  issues: string[];
  optimizations: string[];
  anchorTextDiversity: Record<string, number>;
  internalLinkCount: number;
  schemaValidation: 'valid' | 'missing' | 'invalid';
}

export class SEOAuditorAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'SEOAuditor',
      provider: 'deepseek',
      model: 'deepseek-v4-flash',
      systemPrompt: SEO_AUDITOR_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  async execute(input: SEOAuditInput): Promise<SEOAuditOutput> {
    // Audit the first page in detail + summary of all pages
    const firstPage = input.pages[0];
    const userMessage = [
      `Audit site: ${input.siteSlug} (${input.domain})`,
      `Total pages: ${input.pages.length}`,
      ``,
      `=== SAMPLE PAGE (detailed audit) ===`,
      `URL: /${firstPage.slug}`,
      `Title: ${firstPage.title}`,
      `Meta: ${firstPage.metaDescription}`,
      `H1: ${firstPage.h1}`,
      `Sections: ${firstPage.sections.length}`,
      `FAQs: ${firstPage.faqs.length}`,
      ``,
      `=== ALL PAGE TITLES (scan for issues) ===`,
      ...input.pages.map((p, i) => `${i + 1}. [${p.slug}] ${p.title}`),
      ``,
      `Check all dimensions. Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);

    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) throw new Error('SEO Auditor: no JSON found');
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    return JSON.parse(jsonStr) as SEOAuditOutput;
  }
}
