import { BaseAgent, AgentConfig } from './base-agent';
import { CONTENT_REVIEWER_PROMPT } from './prompts/content-reviewer';
import { PageContent, SourceData } from '../lib/site-config';

export interface ReviewerInput {
  page: PageContent;
  sourceData: SourceData;
  designConfig: { brandName: string };
}

export interface ReviewerOutput {
  overallVerdict: 'PASS' | 'FAIL';
  scores: Record<string, 'PASS' | 'FAIL'>;
  issues: string[];
  rewriteInstructions: string;
}

export class ContentReviewerAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'ContentReviewer',
      provider: 'gemini',  // Cross-model: Gemini reviews DeepSeek output — different model family
      model: 'gemini-1.5-flash',
      systemPrompt: CONTENT_REVIEWER_PROMPT,
      maxRetries: 1,
    };
    super(config);
  }

  async execute(input: ReviewerInput): Promise<ReviewerOutput> {
    const userMessage = [
      `Review this page: "${input.page.title}"`,
      ``,
      `=== PAGE CONTENT ===`,
      JSON.stringify(input.page, null, 2),
      ``,
      `=== SOURCE DATA (ground truth) ===`,
      JSON.stringify(input.sourceData, null, 2),
      ``,
      `=== BRAND: ${input.designConfig.brandName} ===`,
      ``,
      `Check all 5 dimensions. Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);

    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) {
      throw new Error('Content Reviewer: no JSON found in response');
    }
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    return JSON.parse(jsonStr) as ReviewerOutput;
  }
}
