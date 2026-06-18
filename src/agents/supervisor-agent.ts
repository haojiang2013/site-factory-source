import { BaseAgent, AgentConfig } from './base-agent';
import { SUPERVISOR_PROMPT } from './prompts/supervisor-agent';
import { StateStore } from '../lib/state-store';
import { AgentTask } from '../lib/site-config';

function extractJSONStr(text: string, open: string, close: string): string {
  let s = text.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  const start = s.indexOf(open);
  const end = s.lastIndexOf(close);
  if (start === -1) throw new Error('No JSON found');
  return s.slice(start, end + 1);
}

export interface SupervisorTask {
  taskId: string;
  assignTo: string;
  siteSlug: string;
  priority: 'high' | 'medium' | 'low';
  input: unknown;
  deadline?: string;
}

export interface SupervisorStatus {
  activeTasks: number;
  completedToday: number;
  agentHealth: Record<string, 'healthy' | 'warning' | 'down'>;
  blockers: string[];
  readyForDeploy: string[];
}

export class SupervisorAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Supervisor',
      provider: 'deepseek',
      model: 'deepseek-v4-flash',  // Task scheduling = Haiku-level sufficient
      systemPrompt: SUPERVISOR_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  /** Decompose a CSA strategic directive into specific agent tasks */
  async planTasks(directive: string, availableSites: string[]): Promise<SupervisorTask[]> {
    const userMessage = [
      `Plan tasks for directive: "${directive}"`,
      `Available sites: ${availableSites.join(', ') || 'none'}`,
      `Active tasks: ${(await StateStore.loadAllTasks()).filter(t => t.status === 'running').length}`,
      ``,
      `Break into specific agent assignments. Follow scheduling rules.`,
      `Respond with a JSON array of task objects.`,
    ].join('\n');

    const response = await this.think(userMessage);

    try {
      const jsonStr = extractJSONStr(response, '[', ']');
      return JSON.parse(jsonStr) as SupervisorTask[];
    } catch {
      // Retry: ask AI to fix JSON
      const fixResp = await this.think(
        `Your previous JSON had a syntax error. Output ONLY valid JSON array. Fix any unescaped quotes or newlines in string values.\n\nOriginal: ${response.slice(0, 1500)}`
      );
      const fixStr = extractJSONStr(fixResp, '[', ']');
      return JSON.parse(fixStr) as SupervisorTask[];
    }
  }

  /** Check health of all agents based on recent task history */
  async checkAgentHealth(): Promise<SupervisorStatus> {
    const allTasks = await StateStore.loadAllTasks();
    const activeTasks = allTasks.filter(t => t.status === 'running' || t.status === 'pending');

    // Build agent health map from recent task results
    const agentHealth: Record<string, 'healthy' | 'warning' | 'down'> = {};
    const agentNames = [...new Set(allTasks.map(t => t.agentName))];

    for (const name of agentNames) {
      const recentTasks = allTasks.filter(t => t.agentName === name).slice(-10);
      const failedCount = recentTasks.filter(t => t.status === 'failed').length;
      if (failedCount >= 5) agentHealth[name] = 'down';
      else if (failedCount >= 2) agentHealth[name] = 'warning';
      else agentHealth[name] = 'healthy';
    }

    return {
      activeTasks: activeTasks.length,
      completedToday: allTasks.filter(t =>
        t.status === 'done' && t.completedAt?.startsWith(new Date().toISOString().slice(0, 10))
      ).length,
      agentHealth,
      blockers: activeTasks.filter(t => t.status === 'failed').map(t => t.error || 'unknown'),
      readyForDeploy: [],  // To be populated by Deploy Agent status checks
    };
  }

  /** Minimal execute — Supervisor is primarily called via planTasks + checkAgentHealth */
  async execute(input: { directive: string }): Promise<SupervisorTask[]> {
    const sites = await StateStore.listSites();
    return this.planTasks(input.directive, sites);
  }
}
