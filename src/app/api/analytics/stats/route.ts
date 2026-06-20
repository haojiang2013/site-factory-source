/**
 * Analytics stats — GET endpoint
 * Returns aggregated metrics from in-memory event store.
 * GET /api/analytics/stats?secret=CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsEvent } from '../collect/route';

declare global { var __analytics: AnalyticsEvent[]; }

export async function GET(req: NextRequest) {
  // Read-only aggregated stats — no secret needed
  // Individual events with PII are never exposed

  const events = globalThis.__analytics || [];
  const now = Date.now();

  // Time windows
  const last24h = events.filter(e => now - new Date(e.ts).getTime() < 86400000);
  const last7d = events.filter(e => now - new Date(e.ts).getTime() < 604800000);

  // Domain breakdown
  const byDomain: Record<string, number> = {};
  events.forEach(e => { const d = e.host || 'unknown'; byDomain[d] = (byDomain[d] || 0) + 1; });

  // Country breakdown
  const byCountry: Record<string, number> = {};
  events.forEach(e => { const c = e.country || 'unknown'; byCountry[c] = (byCountry[c] || 0) + 1; });

  // Tool usage rate
  const toolEvents = events.filter(e => e.toolUsed).length;

  // Average dwell time
  const avgDwell = events.length > 0 ? Math.round(events.reduce((s, e) => s + (e.dwell || 0), 0) / events.length) : 0;

  // Scroll depth average
  const avgScroll = events.length > 0 ? Math.round(events.reduce((s, e) => s + (e.scroll || 0), 0) / events.length) : 0;

  // Top pages
  const pageCounts: Record<string, number> = {};
  events.forEach(e => { pageCounts[e.path] = (pageCounts[e.path] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);

  // Referrer breakdown
  const byRef: Record<string, number> = {};
  events.forEach(e => {
    let ref = 'direct';
    try { ref = new URL(e.referrer).hostname || 'direct'; } catch { ref = e.referrer || 'direct'; }
    byRef[ref] = (byRef[ref] || 0) + 1;
  });

  return NextResponse.json({
    total: events.length,
    last24h: last24h.length,
    last7d: last7d.length,
    avgDwellSec: avgDwell,
    avgScrollPct: avgScroll,
    toolUseRate: events.length > 0 ? Math.round(toolEvents / events.length * 100) : 0,
    byDomain: Object.entries(byDomain).sort((a, b) => b[1] - a[1]).slice(0, 30),
    byCountry: Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 20),
    byRef: Object.entries(byRef).sort((a, b) => b[1] - a[1]).slice(0, 10),
    topPages,
  });
}
