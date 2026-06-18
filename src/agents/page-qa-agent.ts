import { BaseAgent, AgentConfig } from './base-agent';
import { PAGE_QA_PROMPT } from './prompts/page-qa';

export interface PageQAInput {
  toolName: string;
  jsCode: string;
  testCases: string[];
  competitorUrls?: string[];
}

export interface PageQAOutput {
  overallVerdict: 'PASS' | 'FAIL';
  testCaseResults: { passed: number; failed: number; total: number };
  fuzzTestResults: { crashes: number; errors: number; passed: number };
  edgeCaseResults: { issues: string[] };
  competitorComparison: { ourEstimate: number; competitorAvg: number; deviationPercent: number };
  mobileTest: { layoutOK: boolean; touchTargetsOK: boolean; usableOnMobile: boolean };
  accessibilityIssues: string[];
  criticalBugs: string[];
  recommendation: 'deploy' | 'fix_and_retest' | 'major_rewrite';
}

export class PageQAAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'PageQA',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',  // Needs reasoning for test analysis
      systemPrompt: PAGE_QA_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  async execute(input: PageQAInput): Promise<PageQAOutput> {
    const userMessage = [
      `QA test the calculator: "${input.toolName}"`,
      ``,
      `=== CALCULATOR CODE ===`,
      input.jsCode.slice(0, 6000), // Truncate if very long
      ``,
      `=== DEVELOPER'S TEST CASES ===`,
      input.testCases.join('\n'),
      ``,
      `=== COMPETITOR URLS (for cross-validation) ===`,
      (input.competitorUrls || ['(no competitors provided — skip cross-validation)']).join('\n'),
      ``,
      `Run all tests. Identify critical bugs. Recommend deploy/fix/rewrite.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage, 4096);

    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) throw new Error('Page QA: no JSON found');
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    return JSON.parse(jsonStr) as PageQAOutput;
  }
}
