import { BaseAgent, AgentConfig } from './base-agent';
import { CONTENT_WRITER_B_PROMPT } from './prompts/content-writer-b';
import { Keyword, SourceData } from '../lib/site-config';
import { getContentGuidance } from '../lib/knowledge-base';

export interface WriterBOutput {
  title: string; metaDescription: string; h1: string; introBody: string;
  tableColumns: { key: string; label: string; sortable?: boolean }[];
  tableRows: { id: string; cells: Record<string, string>; detail?: string; affiliateUrl?: string }[];
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  affiliateCTA: any;
}

export class ContentWriterBAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = { name: 'ContentWriterB', provider: 'deepseek', model: 'deepseek-v4-flash', systemPrompt: CONTENT_WRITER_B_PROMPT, maxRetries: 2 };
    super(config);
  }

  async execute(input: { keyword: Keyword; sourceData: SourceData; designConfig: { brandName: string } }): Promise<WriterBOutput> {
    const outlier = Math.random() < 0.1;
    const response = await this.think([
      `Knowledge: ${getContentGuidance()}`,
      outlier ? '⚠️ OUTLIER MODE: Shorter page, skip FAQ, different structure.' : '',
      `Keyword: "${input.keyword.keyword}" | Intent: ${input.keyword.intent}`,
      `Complaints: ${input.keyword.userComplaints.join('; ') || 'none'}`,
      `Brand: ${input.designConfig.brandName}`,
      `Source data: ${JSON.stringify(input.sourceData, null, 2)}`,
      `Output valid JSON only. No markdown wrappers.`,
    ].join('\n'));

    try { return parseJSON(response) as WriterBOutput; }
    catch (parseErr) {
      console.warn('WriterB: JSON parse failed, asking AI to fix...');
      const fixResp = await this.think(
        `Your previous JSON had a syntax error: ${(parseErr as Error).message}\nFix the JSON and output ONLY valid JSON.\nOriginal: ${response.slice(0, 2000)}`
      );
      return parseJSON(fixResp) as WriterBOutput;
    }
  }
}

function parseJSON(response: string): unknown {
  let s = response.trim();
  const fence = s.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('{'); const end = s.lastIndexOf('}');
  if (start === -1) throw new Error('No JSON found');
  let data = JSON.parse(s.slice(start, end + 1));
  return data;
}
