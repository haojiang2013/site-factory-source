require('dotenv').config({path:'.env'});
const fs = require('fs');
const { SupervisorAgent } = require('./src/agents/supervisor-agent');
const { CSAAgent } = require('./src/agents/csa-agent');
const { DeployAgent } = require('./src/agents/deploy-agent');
const { StateStore } = require('./src/lib/state-store');

const log = [];
function out(s) { log.push(s); }

(async () => {
  out('=== 1. Supervisor - Task Planning ===');
  const sup = new SupervisorAgent();
  const tasks = await sup.planTasks('Build 3 tool sites in seed stage', ['site-001-moving-calculator']);
  out('Tasks planned: ' + tasks.length);
  tasks.slice(0, 3).forEach(function(t) { out('  -> ' + t.assignTo + ' | ' + t.priority); });

  out('');
  out('=== 2. Supervisor - Agent Health ===');
  const health = await sup.checkAgentHealth();
  out('Active: ' + health.activeTasks + ' | Done: ' + health.completedToday);
  out('Health: ' + JSON.stringify(health.agentHealth));

  out('');
  out('=== 3. CSA - Weekly Report ===');
  const csa = new CSAAgent();
  const weekly = await csa.weeklyReport({
    'site-001': { niche: 'moving', pv: 45, revenue: 0.12, stage: 'seed', trend: 'up' }
  });
  out('Summary: ' + weekly.executiveSummary);
  out('Decisions needed: ' + weekly.decisionsNeeded.length);

  out('');
  out('=== 4. CSA - Niche Discovery ===');
  const opps = await csa.discoverNiches(['moving calculator']);
  out('Found ' + opps.opportunities.length + ' opportunities');
  opps.opportunities.slice(0, 3).forEach(function(o) { out('  -> ' + o.niche + ' (' + o.potential + ')'); });

  out('');
  out('=== 5. Deploy - Pre-check ===');
  const deploy = new DeployAgent();
  const result = await deploy.execute({ siteSlug: 'site-001-moving-calculator', stage: 'seed' });
  out('Status: ' + result.deploymentStatus + ' | Pages: ' + result.deployedPages);
  if (result.issues.length) out('Issues: ' + result.issues.join('; '));

  out('');
  out('ALL 5 VERIFICATIONS COMPLETE');
  fs.writeFileSync('verify-result.txt', log.join('\n'));
  console.log('Done. Results: verify-result.txt');
})().catch(function(e) {
  fs.writeFileSync('verify-result.txt', 'ERROR: ' + e.message + '\n' + (e.stack || ''));
  console.error('Failed:', e.message);
});
