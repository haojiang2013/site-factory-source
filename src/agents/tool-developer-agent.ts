import { BaseAgent, AgentConfig } from './base-agent';
import { TOOL_DEVELOPER_PROMPT } from './prompts/tool-developer';

export interface ToolDevInput {
  toolName: string;
  niche: string;
  parameters: { name: string; type: string; description: string }[];
  formulaReference: string;
}

export interface ToolDevOutput {
  jsCode: string;
  testCases: string[];
}

export class ToolDeveloperAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'ToolDeveloper',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',  // v4-pro for better code quality
      systemPrompt: TOOL_DEVELOPER_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  async execute(input: ToolDevInput): Promise<ToolDevOutput> {
    const userMessage = [
      `Build a calculator for: ${input.toolName}`,
      `Niche: ${input.niche}`,
      `Required parameters:`,
      ...input.parameters.map(
        p => `  - ${p.name} (${p.type}): ${p.description}`
      ),
      `Formula reference: ${input.formulaReference}`,
      ``,
      `Generate 20+ test cases FIRST (Red phase), then the complete calculator code (Green phase).`,
    ].join('\n');

    // Calculator code + 20 test cases need significant output space
    const response = await this.think(
      userMessage + '\n\nIMPORTANT: Output the COMPLETE calculator code. Do NOT truncate. Include ALL 20 test cases and the full implementation.',
      8192  // Calculator code + 20 tests needs more room
    );

    // Extract JS code block
    const codeMatch = response.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    const jsCode = codeMatch ? codeMatch[1].trim() : response;

    // Extract test cases from comments
    const testCases = jsCode
      .split('\n')
      .filter(line => /^\s*\/\/\s*TC\d+/.test(line))
      .map(line => line.replace(/^\s*\/\/\s*/, '').trim());

    return { jsCode, testCases };
  }
}
