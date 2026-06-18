import { BaseAgent, AgentConfig } from './base-agent';
import { CONTENT_WRITER_PROMPT } from './prompts/content-writer';
import { PageContent, Keyword, SourceData } from '../lib/site-config';
import { getContentGuidance } from '../lib/knowledge-base';

export interface WriterInput {
  keyword: Keyword;
  sourceData: SourceData;
  designConfig: { brandName: string };
  template: 'A' | 'B' | 'C';
}

export class ContentWriterAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'ContentWriter',
      provider: 'deepseek',
      model: 'deepseek-chat',
      systemPrompt: CONTENT_WRITER_PROMPT,
      maxRetries: 3,
    };
    super(config);
  }

  async execute(input: WriterInput): Promise<PageContent> {
    // 10% outlier pages — break patterns to confuse Google's statistical fingerprinting
    const outlier = Math.random() < 0.1;
    const outlierNote = outlier ? '\n⚠️ OUTLIER MODE: Write a shorter page (300-500 words). Skip the FAQ section entirely. Use very short paragraphs. This page should look DIFFERENT from our other pages.' : '';

    const userMessage = [
      `Knowledge from previous sites:\n${getContentGuidance()}`,
      outlierNote,
      ``,
      `Write a page for keyword: "${input.keyword.keyword}"`,
      `Search intent: ${input.keyword.intent}`,
      `User complaints about existing tools: ${input.keyword.userComplaints.join('; ') || 'none recorded'}`,
      `Brand name: ${input.designConfig.brandName}`,
      `Template type: ${input.template === 'A' ? 'Calculator tool page' : input.template === 'B' ? 'Data comparison page' : 'Guide page'}`,
      ``,
      `Available structured data (use these facts, do NOT invent numbers):`,
      JSON.stringify(input.sourceData, null, 2),
      ``,
      `Generate a complete PageContent JSON. Include the calculator tool embed in the first content section.`,
      `Respond ONLY with valid JSON (no markdown wrappers, no explanations).`,
    ].join('\n');

    const response = await this.think(userMessage);

    // Robust JSON extraction
    let jsonStr = response.trim();

    // Strip markdown code fences if present
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();

    // Find outermost { }
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) {
      throw new Error(
        `ContentWriter: no JSON object found in response. First 200 chars: ${response.slice(0, 200)}`
      );
    }
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    let content: PageContent;
    try {
      content = JSON.parse(jsonStr) as PageContent;
    } catch (parseErr) {
      // Retry: ask AI to fix its JSON
      console.warn('ContentWriter: JSON parse failed, asking AI to fix...');
      const fixResponse = await this.think(
        `Your previous JSON response had a syntax error: ${(parseErr as Error).message}\n\n` +
        `Please fix the JSON and output ONLY valid JSON. Ensure all quotes inside strings are escaped with backslash.\n\n` +
        `Original response (truncated):\n${response.slice(0, 2000)}`
      );
      let fixStr = fixResponse.trim();
      const fixFence = fixStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fixFence) fixStr = fixFence[1].trim();
      const fb = fixStr.indexOf('{');
      const fe = fixStr.lastIndexOf('}');
      if (fb === -1 || fe === -1) throw new Error('ContentWriter: retry also failed — no JSON object');
      content = JSON.parse(fixStr.slice(fb, fe + 1)) as PageContent;
    }

    // Validate minimum requirements
    if (!content.title || !content.h1 || !content.sections?.length) {
      throw new Error('ContentWriter: output missing required fields (title, h1, sections)');
    }

    return content;
  }
}
