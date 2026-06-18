import { test, expect } from '@playwright/test';

// Test that calculators actually work before deploying
test.describe('Calculator E2E', () => {

  test('site-001 moving calculator — preset shows result', async ({ page }) => {
    await page.goto('http://localhost:3475/?site=site-001');

    // Click the "Studio·Local" preset button
    await page.click('button:has-text("Studio·Local")');

    // Wait for the result section — look for the total text "YOUR ESTIMATE" inside results, not the heading
    const resultSection = page.locator('div:has(> div:text("YOUR ESTIMATE"))');
    await expect(resultSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('site-003 paint calculator — auto-calc shows result', async ({ page }) => {
    await page.goto('http://localhost:3475/?site=site-003');

    // Fill in room dimensions
    await page.fill('input[placeholder="e.g. 12"]', '12');
    await page.fill('input[placeholder="e.g. 10"]', '10');

    // Wait for auto-calc to produce results
    const resultSection = page.locator('text=YOUR ESTIMATE');
    await expect(resultSection).toBeVisible({ timeout: 8000 });
  });

  test('site-002 mortgage calculator — form renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3475/?site=site-002');

    // Verify the form fields are dynamic (not moving preset buttons)
    await expect(page.locator('text=Studio·Local')).not.toBeVisible({ timeout: 3000 });

    // Verify dynamic form rendered — should have Loan Amount field
    await expect(page.locator('label:has-text("Loan")').first()).toBeVisible({ timeout: 3000 });
  });
});
