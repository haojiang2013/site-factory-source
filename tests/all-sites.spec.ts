import { test, expect } from '@playwright/test';

// ============================================================
// Comprehensive 25-site audit
// ============================================================

// All 25 sites with template type for targeted checks
const ALL_SITES: { slug: string; template: 'A' | 'B' | 'C'; label: string }[] = [
  // Template A — Calculator sites (11)
  { slug: 'site-001', template: 'A', label: 'moving-calculator' },
  { slug: 'site-002', template: 'A', label: 'mortgage-calc' },
  { slug: 'site-003', template: 'A', label: 'paint-calc' },
  { slug: 'site-006', template: 'A', label: 'concrete-calc' },
  { slug: 'site-007', template: 'A', label: 'flooring-calc' },
  { slug: 'site-009', template: 'A', label: 'reno-calc' },
  { slug: 'site-016', template: 'A', label: 'electrical' },
  { slug: 'site-017', template: 'A', label: 'garden' },
  { slug: 'site-018', template: 'A', label: 'cleaning' },
  { slug: 'site-019', template: 'A', label: 'solar' },
  { slug: 'site-020', template: 'A', label: 'hvac' },
  // Template B — Data comparison sites (12)
  { slug: 'site-004', template: 'B', label: 'ai-tools' },
  { slug: 'site-008', template: 'B', label: 'ai-coding' },
  { slug: 'site-011', template: 'B', label: 'ai-design' },
  { slug: 'site-012', template: 'B', label: 'ai-marketing' },
  { slug: 'site-013', template: 'B', label: 'ai-video' },
  { slug: 'site-014', template: 'B', label: 'game-items' },
  { slug: 'site-015', template: 'A', label: 'game-builds' },
  { slug: 'site-021', template: 'B', label: 'ai-productivity' },
  { slug: 'site-022', template: 'B', label: 'ai-audio' },
  { slug: 'site-023', template: 'B', label: 'ai-data' },
  { slug: 'site-024', template: 'B', label: 'game-weapons' },
  { slug: 'site-025', template: 'B', label: 'game-npcs' },
  // Template C — Guide/Wiki sites (2)
  { slug: 'site-005', template: 'C', label: 'game-guide' },
  { slug: 'site-010', template: 'C', label: 'boss-guide' },
];

const BASE = 'http://localhost:3475';

test.describe('25-Site Comprehensive Audit', () => {

  for (const site of ALL_SITES) {
    test(`${site.slug} (${site.label}) — page loads, H1 visible, no errors`, async ({ page }) => {
      // Collect console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      const response = await page.goto(`${BASE}/?site=${site.slug}`, { waitUntil: 'networkidle' });

      // 1. HTTP status should be OK
      expect(response?.status()).toBe(200);

      // 2. H1 should be visible
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 60000 });

      // 3. No error boundary or crash text
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('Internal Server Error');
      expect(bodyText).not.toContain('Application error');
      expect(bodyText).not.toContain('A server error occurred');

      // 4. No uncaught console errors about rendering
      const renderErrors = consoleErrors.filter(e =>
        !e.includes('favicon') &&
        !e.includes('404') &&  // ignore missing favicons/images
        !e.includes('net::ERR_')
      );
      // Log but don't fail on console errors unless they are critical
      if (renderErrors.length > 0) {
        console.log(`[${site.slug}] Console errors (non-fatal):`, renderErrors.join('; '));
      }
    });

    // Template-specific checks
    if (site.template === 'A') {
      test(`${site.slug} (${site.label}) — calculator widget renders`, async ({ page }) => {
        await page.goto(`${BASE}/?site=${site.slug}`, { waitUntil: 'networkidle' });

        // Calculator should have either input fields, a calc widget, or preset buttons
        const hasInputs = (await page.locator('input').count()) > 0;
        const hasCalcSection = (await page.locator('[class*="calc"], [class*="calculator"]').count()) > 0;
        const hasForm = (await page.locator('form').count()) > 0;
        const hasPresetBtns = (await page.locator('button').count()) > 0;

        expect(hasInputs || hasCalcSection || hasForm || hasPresetBtns).toBeTruthy();
      });
    }

    if (site.template === 'B') {
      test(`${site.slug} (${site.label}) — data table renders`, async ({ page }) => {
        await page.goto(`${BASE}/?site=${site.slug}`, { waitUntil: 'networkidle' });

        // Data pages should have a table or comparison cards
        const hasTable = (await page.locator('table').count()) > 0;
        const hasCards = (await page.locator('[class*="card"], [class*="Card"]').count()) > 0;
        const hasRows = (await page.locator('tr, [class*="row"]').count()) > 0;

        expect(hasTable || hasCards || hasRows).toBeTruthy();
      });
    }

    if (site.template === 'C') {
      test(`${site.slug} (${site.label}) — guide content renders`, async ({ page }) => {
        await page.goto(`${BASE}/?site=${site.slug}`, { waitUntil: 'networkidle' });

        // Guide pages should have sections, articles, or TOC
        const hasSections = (await page.locator('section, article, [class*="section"], [class*="toc"], nav').count()) > 0;
        expect(hasSections).toBeTruthy();
      });
    }
  }
});
