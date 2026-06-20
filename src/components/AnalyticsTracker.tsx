'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom analytics tracker — records page views, dwell time, scroll depth.
 * Sends to /api/analytics/collect for aggregation.
 * Also pushes to Vercel Analytics (already in layout).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const start = Date.now();
    let maxScroll = 0;
    let toolUsed = false;

    const onScroll = () => {
      const pct = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
      if (pct > maxScroll) maxScroll = pct;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Detect tool usage (calculator button clicks, widget interactions)
    const onToolUse = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('button')?.textContent?.toLowerCase().includes('calculate') ||
          el.closest('[data-tool]') ||
          el.closest('select')?.closest('[data-widget]')) {
        toolUsed = true;
      }
    };
    document.addEventListener('click', onToolUse);

    // Track page view
    const send = () => {
      const dwell = Math.round((Date.now() - start) / 1000);
      const data = {
        path: pathname,
        dwell,
        scroll: maxScroll,
        toolUsed,
        referrer: document.referrer || 'direct',
        screen: `${window.innerWidth}x${window.innerHeight}`,
        ts: new Date().toISOString(),
      };

      // Fire-and-forget to collection endpoint
      try {
        fetch('/api/analytics/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    };

    // Send on page leave
    window.addEventListener('beforeunload', send);
    // Also send after 30s for long stays
    const interval = setInterval(() => {
      if (Date.now() - start > 30000) {
        send();
        clearInterval(interval);
      }
    }, 31000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onToolUse);
      window.removeEventListener('beforeunload', send);
      clearInterval(interval);
    };
  }, [pathname]);

  return null; // invisible
}
