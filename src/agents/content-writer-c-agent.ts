import { BaseAgent, AgentConfig } from './base-agent';
import { CONTENT_WRITER_C_PROMPT } from './prompts/content-writer-c';
import { Keyword, SourceData } from '../lib/site-config';
import { getContentGuidance } from '../lib/knowledge-base';

export interface WriterCOutput {
  title: string; metaDescription: string; h1: string; introBody: string;
  tocItems: { id: string; text: string; level: number }[];
  sections: { id: string; heading: string; body: string }[];
  dataCards: { title: string; subtitle?: string; stats: { label: string; value: string }[]; notes?: string }[];
  faqs: { question: string; answer: string }[];
}

export class ContentWriterCAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = { name: 'ContentWriterC', provider: 'deepseek', model: 'deepseek-v4-pro', systemPrompt: CONTENT_WRITER_C_PROMPT, maxRetries: 2 };
    super(config);
  }

  async execute(input: { keyword: Keyword; sourceData: SourceData; designConfig: { brandName: string } }): Promise<WriterCOutput> {
    const outlier = Math.random() < 0.1;
    const response = await this.think([
      `Knowledge: ${getContentGuidance()}`,
      outlier ? '⚠️ OUTLIER MODE: Shorter page, fewer sections, different structure than usual.' : '',
      `Keyword: "${input.keyword.keyword}" | Intent: ${input.keyword.intent}`,
      `Complaints: ${input.keyword.userComplaints.join('; ') || 'none'}`,
      `Brand: ${input.designConfig.brandName}`,
      `Source data: ${JSON.stringify(input.sourceData, null, 2)}`,
      `Output valid JSON only. No markdown wrappers.`,
    ].join('\n'), 8192);  // Guide pages need more tokens for sections+cards+faqs

    try { return parseJSON(response) as WriterCOutput; }
    catch (parseErr) {
      console.warn('WriterC: JSON parse failed, asking AI to fix...');
      const fixResp = await this.think(
        `Your previous JSON had a syntax error: ${(parseErr as Error).message}\nFix the JSON and output ONLY valid JSON.\nOriginal: ${response.slice(0, 2000)}`
      );
      return parseJSON(fixResp) as WriterCOutput;
    }
  }
}

function parseJSON(response: string): unknown {
  let s = response.trim();
  const fence = s.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('{'); const end = s.lastIndexOf('}');
  if (start === -1) throw new Error('No JSON found');
  let json = s.slice(start, end + 1);
  // Fix common AI JSON errors
  json = json.replace(/\\'/g, "'").replace(/\n/g, ' '); // unescaped single quotes, newlines
  try { return JSON.parse(json); } catch (e1) {
    // Second attempt: remove trailing commas
    try { return JSON.parse(json.replace(/,(\s*[}\]])/g, '$1')); } catch (e2) {
      throw new Error(`JSON parse failed after fixes: ${(e1 as Error).message}`);
    }
  }
}
