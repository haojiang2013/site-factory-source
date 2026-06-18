import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import { SupervisorAgent } from './src/agents/supervisor-agent';
import { CSAAgent } from './src/agents/csa-agent';
import { DeployAgent } from './src/agents/deploy-agent';
import { StateStore } from './src/lib/state-store';

const log: string[] = [];
function out(s: string) { log.push(s); }

(async () => {
  out('=== 1. Supervisor — 任务规划 ===');
  const sup = new SupervisorAgent();
  const tasks = await sup.planTasks('Build 3 moving-related tool sites in seed stage', ['site-001-moving-calculator']);
  out(`Tasks planned: ${tasks.length}`);
  tasks.slice(0, 3).forEach(t => out(`  → ${t.assignTo} | ${t.priority}`));

  out('\n=== 2. Supervisor — Agent 健康检查 ===');
  const health = await sup.checkAgentHealth();
  out(`Active tasks: ${health.activeTasks} | Done today: ${health.completedToday}`);
  out(`Agent health: ${JSON.stringify(health.agentHealth)}`);

  out('\n=== 3. CSA — 周报 ===');
  const csa = new CSAAgent();
  const weekly = await csa.weeklyReport({
    'site-001': { niche: 'moving', pv: 45, revenue: 0.12, stage: 'seed', trend: 'up' }
  });
  out(`Summary: ${weekly.executiveSummary}`);
  out(`Decisions: ${weekly.decisionsNeeded.length}`);

  out('\n=== 4. CSA — 机会发现 ===');
  const opps = await csa.discoverNiches(['moving calculator']);
  out(`Found ${opps.opportunities.length} opportunities`);
  opps.opportunities.slice(0, 3).forEach(o => out(`  → ${o.niche} (${o.potential})`));

  out('\n=== 5. Deploy — 预检 ===');
  const deploy = new DeployAgent();
  const result = await deploy.execute({ siteSlug: 'site-001-moving-calculator', stage: 'seed' });
  out(`Status: ${result.deploymentStatus} | Pages: ${result.deployedPages}`);
  if (result.issues.length) out(`Issues: ${result.issues.join('; ')}`);

  out('\n✅ All 5 verifications complete');
  fs.writeFileSync('verify-result.txt', log.join('\n'));
  console.log('Results written to verify-result.txt');
})().catch(e => {
  fs.writeFileSync('verify-result.txt', 'ERROR: ' + (e as Error).message);
  console.error('Failed:', (e as Error).message);
});
