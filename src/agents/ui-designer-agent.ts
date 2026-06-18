import { BaseAgent, AgentConfig } from './base-agent';
import { UI_DESIGNER_PROMPT } from './prompts/ui-designer';
import { DesignConfig } from '../lib/site-config';

export interface UIDesignerInput {
  niche: string;
  template: 'A' | 'B' | 'C';
}

export class UIDesignerAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'UIDesigner',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',  // Design taste needs stronger reasoning
      systemPrompt: UI_DESIGNER_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  async execute(input: UIDesignerInput): Promise<DesignConfig> {
    const userMessage = [
      `Design a visual identity for a "${input.niche}" website.`,
      `Template type: ${input.template === 'A' ? 'Calculator tool' : input.template === 'B' ? 'Data comparison' : 'Guide/wiki'}`,
      ``,
      `Pick a color palette from the 20 options. Generate a brand name. Check accessibility.`,
      `MOST IMPORTANT: Avoid the 3 AI-design defaults listed in the system prompt.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);

    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) {
      throw new Error('UI Designer: no JSON found in response');
    }
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    return JSON.parse(jsonStr) as DesignConfig;
  }
}
