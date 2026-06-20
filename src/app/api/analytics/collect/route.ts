/**
 * Analytics event collector — POST endpoint
 * Receives page view / dwell time / tool usage events from client-side tracker.
 * Stores in-memory (persists across warm lambda invocations).
 */
import { NextRequest, NextResponse } from 'next/server';

// In-memory store (resets on cold start, persists across warm invocations)
declare global { var __analytics: AnalyticsEvent[]; }
if (!globalThis.__analytics) globalThis.__analytics = [];

export interface AnalyticsEvent {
  path: string;
  dwell: number;
  scroll: number;
  toolUsed: boolean;
  referrer: string;
  screen: string;
  ts: string;
  country?: string;
  host?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyticsEvent = await req.json();

    // Enrich with geo data from Vercel headers
    body.country = req.headers.get('x-vercel-ip-country') || 'unknown';
    body.host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'unknown';

    globalThis.__analytics.push(body);

    // Keep only last 10,000 events to prevent memory bloat
    if (globalThis.__analytics.length > 10000) {
      globalThis.__analytics = globalThis.__analytics.slice(-5000);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
