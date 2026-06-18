#!/usr/bin/env tsx
import 'dotenv/config';
import { CSAAgent } from '../agents/csa-agent';
import { SupervisorAgent } from '../agents/supervisor-agent';
import { StateStore } from '../lib/state-store';

async function main() {
  const cmd = process.argv[2] || 'daily';

  if (cmd === 'daily') {
    const csa = new CSAAgent();
    const sites = await StateStore.listSites();
    const metrics: Record<string, unknown> = {};
    for (const s of sites) {
      try {
        const c = await StateStore.loadConfig(s);
        metrics[s] = { niche: c.niche, brand: c.designConfig.brandName, domain: c.domain, stage: c.growthPlan[0]?.stage };
      } catch { metrics[s] = { error: 'config load failed' }; }
    }
    const brief = await csa.dailyBrief(metrics);
    console.log(`\n📅 CSA Daily Brief — ${brief.date}`);
    console.log(`Headline: ${brief.headline}`);
    console.log(`Sites: ${brief.metrics.activeSites} | PV: ${brief.metrics.totalPV} | Rev: $${brief.metrics.totalRevenue}`);
    console.log(`Verdict: ${brief.verdict}`);
    if (brief.redAlerts.length) console.log(`🔴 Alerts: ${brief.redAlerts.join('; ')}`);
    if (brief.needsAttention.length) console.log(`🟡 Attention: ${brief.needsAttention.join('; ')}`);
  }

  if (cmd === 'health') {
    const sup = new SupervisorAgent();
    const status = await sup.checkAgentHealth();
    console.log(`\n🏥 Agent Health Check`);
    console.log(`Active tasks: ${status.activeTasks} | Done today: ${status.completedToday}`);
    for (const [agent, state] of Object.entries(status.agentHealth)) {
      const icon = state === 'healthy' ? '✅' : state === 'warning' ? '⚠️' : '🔴';
      console.log(`  ${icon} ${agent}: ${state}`);
    }
    if (status.blockers.length) console.log(`Blockers: ${status.blockers.join('; ')}`);
  }

  if (cmd === 'weekly') {
    const csa = new CSAAgent();
    const report = await csa.weeklyReport({
      'site-001': { pv: 45, revenue: 0.12, trend: 'up', niche: 'moving calculator' },
      'site-002': { pv: 12, revenue: 0, trend: 'stable', niche: 'mortgage calculator' },
      'site-003': { pv: 30, revenue: 0.05, trend: 'up', niche: 'paint calculator' },
    });
    console.log(`\n📊 CSA Weekly Report — ${report.weekEnding}`);
    console.log(`Summary: ${report.executiveSummary}`);
    console.log(`Decisions needed: ${report.decisionsNeeded.length}`);
    report.decisionsNeeded.forEach(d => console.log(`  ❓ ${d}`));
    console.log(`Knowledge updates: ${report.knowledgeBaseUpdates.length}`);
    report.newOpportunities.slice(0, 3).forEach(o => console.log(`  🆕 ${o.niche} (${o.potential}) — ${o.rationale.slice(0,80)}`));
  }
}

main().catch(e => { console.error('Ops failed:', e.message); process.exit(1); });
