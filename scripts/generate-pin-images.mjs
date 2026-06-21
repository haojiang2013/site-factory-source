/**
 * Pinterest Pin Image Generator
 * Reads pinterest-pins.json → generates 250 pin images (1000×1500) via Playwright
 * Output: public/pins/*.png
 *
 * Usage: node scripts/generate-pin-images.mjs
 *   or:  node scripts/generate-pin-images.mjs --batch 0   (pins 0-49, batch mode for 5 parallel runs)
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PINS_PATH = resolve(ROOT, 'src', 'data', 'pinterest-pins.json');
const OUT_DIR = resolve(ROOT, 'public', 'pins');
const MANIFEST_PATH = resolve(OUT_DIR, 'manifest.json');

// Parse batch argument: node generate-pin-images.mjs 0  (batch index 0-4, 50 pins each)
const batchIdx = process.argv[2] !== undefined ? parseInt(process.argv[2]) : -1;
const BATCH_SIZE = 50;
const TOTAL_BATCHES = 5; // 250 / 50

// ─── Brand Color Palette (unique gradient per brand) ───
const BRAND_PALETTES = [
  ['#6366f1', '#4f46e5'], // MoveWise - indigo
  ['#0891b2', '#0e7490'], // EquityFlow - cyan
  ['#059669', '#047857'], // CoverWise - emerald
  ['#7c3aed', '#6d28d9'], // WriteRank - violet
  ['#dc2626', '#b91c1c'], // LootCove - red
  ['#ea580c', '#c2410c'], // MixWise - orange
  ['#2563eb', '#1d4ed8'], // FloorWise - blue
  ['#4f46e5', '#4338ca'], // CodeBench - indigo dark
  ['#0d9488', '#0f766e'], // BuildCost - teal
  ['#be123c', '#9f1239'], // BossPlan - rose
  ['#9333ea', '#7e22ce'], // DesignBench - purple
  ['#0284c7', '#0369a1'], // MetricCraft - sky
  ['#b91c1c', '#991b1b'], // VidBench - red dark
  ['#c026d3', '#a21caf'], // StatForge - fuchsia
  ['#d97706', '#b45309'], // BuildForge - amber
  ['#15803d', '#166534'], // AmpFlow - green
  ['#65a30d', '#4d7c0f'], // EarthWise - lime
  ['#0891b2', '#0e7490'], // TidyCost - cyan
  ['#e11d48', '#be123c'], // RayCalc - rose
  ['#0ea5e9', '#0284c7'], // ThermoWise - sky blue
  ['#8b5cf6', '#7c3aed'], // MindForge - violet
  ['#f43f5e', '#e11d48'], // WaveCraft - rose
  ['#10b981', '#059669'], // FuseLens - emerald
  ['#f59e0b', '#d97706'], // WeaponWise - amber
  ['#06b6d4', '#0891b2'], // NPCVault - cyan
];

// Angle badge colors
const ANGLE_COLORS = {
  'pain-point':    { bg: '#fef2f2', text: '#dc2626', icon: '😤' },
  'how-to':        { bg: '#eff6ff', text: '#2563eb', icon: '📋' },
  'comparison':    { bg: '#fefce8', text: '#ca8a04', icon: '⚖️' },
  'tip':           { bg: '#f0fdf4', text: '#16a34a', icon: '💡' },
  'feature':       { bg: '#f5f3ff', text: '#7c3aed', icon: '⚡' },
  'numbers':       { bg: '#fff7ed', text: '#ea580c', icon: '📊' },
  'quiz':          { bg: '#fdf2f8', text: '#db2777', icon: '❓' },
  'before-after':  { bg: '#ecfeff', text: '#0891b2', icon: '🔄' },
  'checklist':     { bg: '#f0fdf4', text: '#15803d', icon: '✅' },
  'secret':        { bg: '#fefce8', text: '#b45309', icon: '🔑' },
};

function pinHTML(pin, index, palette) {
  const [grad1, grad2] = palette;
  const angleStyle = ANGLE_COLORS[pin.angle] || ANGLE_COLORS['tip'];
  // Truncate title for display
  const displayTitle = pin.title.length > 80 ? pin.title.substring(0, 77) + '...' : pin.title;
  // Remove hashtag symbols for display
  const tagsDisplay = pin.hashtags.map(t => t.replace('#', '')).slice(0, 4);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1000px; height: 1500px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: linear-gradient(160deg, ${grad1} 0%, ${grad2} 100%);
    display: flex; flex-direction: column; justify-content: space-between;
    overflow: hidden; position: relative;
  }
  /* Decorative circles */
  .deco-1 {
    position: absolute; top: -120px; right: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: rgba(255,255,255,0.06); pointer-events: none;
  }
  .deco-2 {
    position: absolute; bottom: -60px; left: -100px;
    width: 300px; height: 300px; border-radius: 50%;
    background: rgba(255,255,255,0.04); pointer-events: none;
  }
  /* Top section */
  .top { padding: 60px 70px 0; position: relative; z-index: 1; }
  .badge {
    display: inline-block; padding: 10px 22px; border-radius: 24px;
    font-size: 16px; font-weight: 600; letter-spacing: 0.3px;
    background: ${angleStyle.bg}; color: ${angleStyle.text};
    margin-bottom: 32px;
  }
  .title {
    font-size: 52px; font-weight: 800; color: #ffffff;
    line-height: 1.15; letter-spacing: -1px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.15);
  }
  /* Middle - description */
  .mid { padding: 0 70px; position: relative; z-index: 1; }
  .desc {
    font-size: 22px; color: rgba(255,255,255,0.85); line-height: 1.5;
    max-width: 700px;
  }
  /* Bottom section */
  .bottom { padding: 0 70px 60px; position: relative; z-index: 1; }
  .tags {
    display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px;
  }
  .tag {
    padding: 8px 18px; border-radius: 20px;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(4px);
    color: rgba(255,255,255,0.9); font-size: 15px; font-weight: 500;
  }
  .brand-row {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.15); padding-top: 24px;
  }
  .brand-name { font-size: 28px; font-weight: 700; color: #ffffff; }
  .domain { font-size: 18px; color: rgba(255,255,255,0.65); }
  /* Watermark stripe */
  .watermark {
    position: absolute; right: -30px; top: 45%;
    transform: rotate(-25deg) translateY(-50%);
    font-size: 130px; font-weight: 900; opacity: 0.04;
    color: #ffffff; white-space: nowrap; pointer-events: none;
    letter-spacing: 8px;
  }
</style>
</head>
<body>
  <div class="deco-1"></div>
  <div class="deco-2"></div>
  <div class="watermark">FREE TOOL</div>
  <div class="top">
    <div class="badge">${angleStyle.icon} ${pin.angle.replace('-', ' ').toUpperCase()}</div>
    <h1 class="title">${displayTitle}</h1>
  </div>
  <div class="mid">
    <p class="desc">${pin.description}</p>
  </div>
  <div class="bottom">
    <div class="tags">
      ${tagsDisplay.map(t => `<span class="tag">#${t}</span>`).join('')}
    </div>
    <div class="brand-row">
      <span class="brand-name">${pin.brand}</span>
      <span class="domain">${pin.domain}</span>
    </div>
  </div>
</body>
</html>`;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('📌 Pinterest Pin Image Generator\n');

  const allPins = JSON.parse(readFileSync(PINS_PATH, 'utf8'));
  console.log(`   Loaded ${allPins.length} pins from pinterest-pins.json`);

  // Determine batch range
  let pins;
  let startIdx;
  if (batchIdx >= 0 && batchIdx < TOTAL_BATCHES) {
    startIdx = batchIdx * BATCH_SIZE;
    pins = allPins.slice(startIdx, startIdx + BATCH_SIZE);
    console.log(`   Batch ${batchIdx + 1}/${TOTAL_BATCHES}: pins ${startIdx + 1}-${Math.min(startIdx + BATCH_SIZE, allPins.length)}`);
  } else {
    startIdx = 0;
    pins = allPins;
    console.log(`   Processing all ${pins.length} pins`);
  }

  // Ensure output directory
  mkdirSync(OUT_DIR, { recursive: true });

  // Launch browser
  console.log('   Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1000, height: 1500 } });

  let success = 0;
  let failed = 0;
  const manifest = [];
  const startTime = Date.now();

  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    const globalIdx = startIdx + i;
    const palette = BRAND_PALETTES[globalIdx % BRAND_PALETTES.length]; // rotate if needed

    // Map brand to palette consistently
    const brandIdx = allPins.findIndex(p => p.brand === pin.brand) % BRAND_PALETTES.length;
    const brandPalette = BRAND_PALETTES[brandIdx] || BRAND_PALETTES[0];

    const filename = `pin-${String(globalIdx + 1).padStart(3, '0')}.png`;
    const filepath = resolve(OUT_DIR, filename);

    try {
      const page = await context.newPage();
      const html = pinHTML(pin, globalIdx, brandPalette);
      await page.setContent(html, { waitUntil: 'networkidle' });
      await sleep(50); // let fonts settle

      await page.screenshot({ path: filepath, type: 'png' });
      await page.close();

      success++;
      manifest.push({ file: filename, brand: pin.brand, domain: pin.domain, title: pin.title, angle: pin.angle });

      if ((i + 1) % 10 === 0 || i === pins.length - 1) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = (success / (Date.now() - startTime) * 1000).toFixed(1);
        console.log(`   [${String(globalIdx + 1).padStart(3)}/${allPins.length}] ${success}/${i + 1} done · ${elapsed}s · ${rate} pins/s · ${pin.brand} ✓`);
      }
    } catch (e) {
      failed++;
      console.log(`   ✗ ${filename}: ${e.message}`);
    }
  }

  await browser.close();

  // Write manifest
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ ${success} images generated · ${failed} failed · ${totalSeconds}s`);
  console.log(`   Output: ${OUT_DIR}/`);
  console.log(`   Manifest: ${MANIFEST_PATH}`);

  if (batchIdx >= 0) {
    console.log(`\n💡 Run other batches: node scripts/generate-pin-images.mjs 1`);
    console.log(`   Batch 0 (pins   1- 50): node scripts/generate-pin-images.mjs 0`);
    console.log(`   Batch 1 (pins  51-100): node scripts/generate-pin-images.mjs 1`);
    console.log(`   Batch 2 (pins 101-150): node scripts/generate-pin-images.mjs 2`);
    console.log(`   Batch 3 (pins 151-200): node scripts/generate-pin-images.mjs 3`);
    console.log(`   Batch 4 (pins 201-250): node scripts/generate-pin-images.mjs 4`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
