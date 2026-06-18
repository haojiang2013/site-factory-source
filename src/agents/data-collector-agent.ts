import { BaseAgent, AgentConfig } from './base-agent';
import { DATA_COLLECTOR_PROMPT } from './prompts/data-collector';
import { SourceData } from '../lib/site-config';

export interface DataCollectorInput {
  niche: string;
  dataNeeds: string[];  // e.g. ["average costs by home size", "truck sizes", "seasonal multipliers"]
  targetCountry?: string;
}

export class DataCollectorAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'DataCollector',
      provider: 'deepseek',
      model: 'deepseek-v4-flash',  // Data extraction is straightforward
      systemPrompt: DATA_COLLECTOR_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  async execute(input: DataCollectorInput): Promise<SourceData> {
    const userMessage = [
      `Collect structured data for: "${input.niche}"`,
      `Data needs: ${input.dataNeeds.join(', ')}`,
      `Target country: ${input.targetCountry || 'US'}`,
      ``,
      `Provide data with dual-source verification. Mark any unverified fields.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);

    // Parse JSON
    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) {
      throw new Error('Data Collector: no JSON found in response');
    }
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    return JSON.parse(jsonStr) as SourceData;
  }
}
