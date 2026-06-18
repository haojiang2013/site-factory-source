import fs from 'fs/promises';
import path from 'path';
import { SiteConfig, AgentTask } from './site-config';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const STATE_DIR = path.join(process.cwd(), '.state');

export class StateStore {
  // ── Site lifecycle ──

  static async init(siteSlug: string): Promise<void> {
    const dir = path.join(DATA_DIR, siteSlug);
    await fs.mkdir(dir, { recursive: true });
    await fs.mkdir(STATE_DIR, { recursive: true });
  }

  static async siteExists(siteSlug: string): Promise<boolean> {
    try {
      await fs.access(path.join(DATA_DIR, siteSlug, 'config.json'));
      return true;
    } catch {
      return false;
    }
  }

  static async listSites(): Promise<string[]> {
    try {
      const entries = await fs.readdir(DATA_DIR);
      const sites: string[] = [];
      for (const e of entries) {
        const stat = await fs.stat(path.join(DATA_DIR, e));
        if (stat.isDirectory()) sites.push(e);
      }
      return sites;
    } catch {
      return [];
    }
  }

  // ── Config ──

  static async saveConfig(config: SiteConfig): Promise<void> {
    await this.init(config.slug);
    const file = path.join(DATA_DIR, config.slug, 'config.json');
    await fs.writeFile(file, JSON.stringify(config, null, 2));
  }

  static async loadConfig(siteSlug: string): Promise<SiteConfig> {
    const file = path.join(DATA_DIR, siteSlug, 'config.json');
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as SiteConfig;
  }

  // ── Agent output files ──

  static async saveAgentOutput(
    siteSlug: string,
    filename: string,
    data: unknown
  ): Promise<void> {
    await this.init(siteSlug);
    const file = path.join(DATA_DIR, siteSlug, filename);
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  }

  static async loadAgentOutput<T>(siteSlug: string, filename: string): Promise<T> {
    const file = path.join(DATA_DIR, siteSlug, filename);
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as T;
  }

  // ── Task state ──

  static async saveTask(task: AgentTask): Promise<void> {
    await fs.mkdir(STATE_DIR, { recursive: true });
    const file = path.join(STATE_DIR, `task-${task.id}.json`);
    await fs.writeFile(file, JSON.stringify(task, null, 2));
  }

  static async loadTask(taskId: string): Promise<AgentTask> {
    const file = path.join(STATE_DIR, `task-${taskId}.json`);
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as AgentTask;
  }

  static async loadAllTasks(): Promise<AgentTask[]> {
    try {
      const files = (await fs.readdir(STATE_DIR)).filter(f =>
        f.startsWith('task-')
      );
      const tasks: AgentTask[] = [];
      for (const f of files) {
        const raw = await fs.readFile(path.join(STATE_DIR, f), 'utf-8');
        tasks.push(JSON.parse(raw));
      }
      return tasks.sort(
        (a, b) =>
          (a.startedAt || '').localeCompare(b.startedAt || '')
      );
    } catch {
      return [];
    }
  }
}
