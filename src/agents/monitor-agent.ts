import { BaseAgent, AgentConfig } from './base-agent';
import { MONITOR_AGENT_PROMPT } from './prompts/monitor-agent';

export interface MonitorInput {
  siteSlug: string;
  domain: string;
  metrics: {
    traffic?: { dailyPV: number; previousDailyPV: number };
    revenue?: { adsense: number; affiliate: number };
    technicalIssues?: string[];
    stickiness?: { returnRate: number; multiPageRate: number };
    backlinks?: { total: number; toxicCount: number };
  };
}

export interface MonitorOutput {
  siteSlug: string;
  reportDate: string;
  traffic: { dailyPV: number; trend: 'up' | 'stable' | 'down'; alertThreshold: 'none' | 'warning' | 'critical' };
  revenue: { dailyTotal: number; breakdown: { adsense: number; affiliate: number } };
  technicalIssues: string[];
  stickiness: { returnRate: number; multiPageRate: number };
  competitorAlerts: string[];
  backlinkAlerts: string[];
  autoActions: string[];
  requiresApproval: string[];
}

export class MonitorAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Monitor',
      provider: 'deepseek',
      model: 'deepseek-v4-flash',
      systemPrompt: MONITOR_AGENT_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  async execute(input: MonitorInput): Promise<MonitorOutput> {
    const userMessage = [
      `Generate a monitoring report for: ${input.siteSlug} (${input.domain})`,
      ``,
      `=== CURRENT METRICS ===`,
      JSON.stringify(input.metrics, null, 2),
      ``,
      `Analyze all 6 dimensions. Recommend auto-actions and items needing approval.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);

    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) throw new Error('Monitor: no JSON found');
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    return JSON.parse(jsonStr) as MonitorOutput;
  }
}
