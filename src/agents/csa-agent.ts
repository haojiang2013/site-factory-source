import { BaseAgent, AgentConfig } from './base-agent';
import { CSA_PROMPT } from './prompts/csa-agent';
import { StateStore } from '../lib/state-store';

export interface CSADailyBrief {
  date: string;
  headline: string;
  metrics: { totalPV: number; totalRevenue: number; activeSites: number };
  redAlerts: string[];
  needsAttention: string[];
  verdict: 'all-clear' | 'attention-needed' | 'critical';
}

export interface CSAWeeklyReport {
  weekEnding: string;
  executiveSummary: string;
  topSites: { slug: string; pv: number; revenue: number; trend: 'up' | 'stable' | 'down' }[];
  bottomSites: { slug: string; pv: number; issue: string }[];
  nicheROI: { niche: string; roi: number; recommendation: 'scale' | 'hold' | 'exit' }[];
  newOpportunities: { niche: string; potential: 'high' | 'medium'; rationale: string }[];
  decisionsNeeded: string[];
  knowledgeBaseUpdates: string[];
}

export class CSAAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'CSA',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',  // Strategic reasoning needs full power
      systemPrompt: CSA_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  /** Generate a daily brief for the CEO */
  async dailyBrief(siteMetrics: Record<string, unknown>): Promise<CSADailyBrief> {
    const userMessage = [
      `Generate a DAILY BRIEF for the CEO.`,
      `Active sites and metrics: ${JSON.stringify(siteMetrics)}`,
      `Keep it to a 30-second read. Flag only critical issues.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);
    return this.parseJSON<CSADailyBrief>(response);
  }

  /** Generate a weekly strategic report */
  async weeklyReport(allSiteData: Record<string, unknown>): Promise<CSAWeeklyReport> {
    const userMessage = [
      `Generate a WEEKLY STRATEGIC REPORT for the CEO.`,
      `All site data: ${JSON.stringify(allSiteData)}`,
      `Include: top/bottom sites, niche ROI, new opportunities, decisions needed, knowledge base updates.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage, 8192);
    return this.parseJSON<CSAWeeklyReport>(response);
  }

  /** Discover new niche opportunities */
  async discoverNiches(currentNiches: string[]): Promise<{
    opportunities: { niche: string; potential: 'high' | 'medium'; rationale: string }[];
  }> {
    const userMessage = [
      `Discover new niche opportunities for tool websites.`,
      `Current niches: ${currentNiches.join(', ')}`,
      `Look for: underserved long-tail keywords, niches with weak SERP competition, user complaints on Reddit about existing tools.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);
    return this.parseJSON<{ opportunities: { niche: string; potential: 'high' | 'medium'; rationale: string }[] }>(response);
  }

  /** Evaluate whether to scale, hold, or exit a niche */
  async evaluateNiche(nicheData: Record<string, unknown>): Promise<{
    recommendation: 'scale' | 'hold' | 'exit';
    rationale: string;
  }> {
    const userMessage = [
      `Evaluate niche performance: ${JSON.stringify(nicheData)}`,
      `Recommend: scale (invest more), hold (maintain), or exit (stop building).`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);
    return this.parseJSON<{ recommendation: 'scale' | 'hold' | 'exit'; rationale: string }>(response);
  }

  async execute(input: { action: string; data: Record<string, unknown> }): Promise<unknown> {
    switch (input.action) {
      case 'dailyBrief': return this.dailyBrief(input.data);
      case 'weeklyReport': return this.weeklyReport(input.data);
      case 'discoverNiches': return this.discoverNiches(input.data.currentNiches as string[] || []);
      case 'evaluateNiche': return this.evaluateNiche(input.data);
      default: throw new Error(`CSA: unknown action "${input.action}"`);
    }
  }

  /** Helper: robust JSON extraction */
  private parseJSON<T>(response: string): T {
    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) throw new Error('CSA: no JSON found');
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);
    return JSON.parse(jsonStr) as T;
  }
}
