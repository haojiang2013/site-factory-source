require('dotenv').config({path:'.env'});
var fs = require('fs');
var SupervisorAgent = require('./src/agents/supervisor-agent').SupervisorAgent;
var CSAAgent = require('./src/agents/csa-agent').CSAAgent;
var StateStore = require('./src/lib/state-store').StateStore;

(async () => {
  var results = [];

  // 1. CSA strategic decision: should we scale?
  console.log('=== CSA: Portfolio Review ===');
  var csa = new CSAAgent();
  var review = await csa.evaluateNiche({
    niche: 'moving cost calculator',
    totalSites: 1,
    totalPV: 45,
    totalRevenue: 0.12,
    trend: 'up',
    competitors: 'U-Haul, Moving.com (lead gen traps)'
  });
  results.push('CSA niche review: ' + JSON.stringify(review).slice(0,200));

  // 2. Supervisor: plan next batch of work
  console.log('\n=== Supervisor: Task Planning ===');
  var sup = new SupervisorAgent();
  var tasks = await sup.planTasks(
    'We have 3 sites in seed stage (moving, mortgage, paint). Plan optimization tasks: fix SEO issues, expand to sprout stage for the best performer, and prepare the next site (concrete calculator).',
    ['site-001-moving-calculator', 'site-002-mortgage-calc', 'site-003-paint-calc']
  );
  results.push('Tasks planned: ' + tasks.length);
  tasks.forEach(function(t) {
    results.push('  ' + t.assignTo + ' → ' + t.siteSlug + ' [' + t.priority + ']');
  });

  // 3. Supervisor: agent health check from actual task data
  console.log('\n=== Supervisor: Health Check ===');
  var health = await sup.checkAgentHealth();
  results.push('Active: ' + health.activeTasks + ' | Done: ' + health.completedToday);
  results.push('Blockers: ' + (health.blockers.length ? health.blockers.join('; ') : 'none'));
  results.push('Ready for deploy: ' + (health.readyForDeploy.length || 'none'));

  // 4. CSA: daily brief
  console.log('\n=== CSA: Daily Brief ===');
  var brief = await csa.dailyBrief({
    'site-001': { pv: 45, revenue: 0.12, status: 'seed' },
    'site-002': { pv: 0, revenue: 0, status: 'seed' },
    'site-003': { pv: 0, revenue: 0, status: 'seed' }
  });
  results.push('Headline: ' + brief.headline);
  results.push('Verdict: ' + brief.verdict);
  results.push('Alerts: ' + (brief.redAlerts.length || 'none'));

  fs.writeFileSync('supervisor-test.txt', results.join('\n'));
  console.log('\nDone. Results saved.');
})();
