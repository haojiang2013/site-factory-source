/**
 * Pinterest Bulk Upload CSV Generator
 * Reads pinterest-pins.json → generates Pinterest-compatible CSV
 *
 * PREREQUISITE: Pin images must be generated first (scripts/generate-pin-images.mjs)
 *                AND deployed to Vercel so image URLs are publicly accessible.
 *
 * Usage: node scripts/generate-pinterest-csv.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PINS_PATH = resolve(ROOT, 'src', 'data', 'pinterest-pins.json');
const OUT_DIR = resolve(ROOT, 'pinterest-upload');
const IMAGE_BASE_URL = 'https://gomovecalc.xyz/pins'; // All images deployed here

// ─── Board assignment ───
// Each brand gets its own board. Store board names for user to create.
function boardName(brand, niche) {
  // Clean: "Free [Tool Type] — [Brand]"
  if (niche.includes('calculator') || niche.includes('Calculator') || niche.includes('calc')) {
    return `${brand} — Free Calculator`;
  }
  if (niche.includes('game') || niche.includes('boss') || niche.includes('loot') || niche.includes('weapon') || niche.includes('NPC')) {
    return `${brand} — Game Database`;
  }
  if (niche.includes('AI') || niche.includes('ai ')) {
    return `${brand} — AI Tools`;
  }
  return `${brand} — Free Tool`;
}

// Group by category for multi-board strategy
function categoryBoard(niche) {
  if (!niche) return 'Free Online Tools';
  const n = niche.toLowerCase();
  if (n.includes('moving')) return 'Moving & Relocation Tips';
  if (n.includes('mortgage')) return 'Mortgage & Home Buying';
  if (n.includes('paint')) return 'Painting & Home DIY';
  if (n.includes('concrete')) return 'Concrete & Construction';
  if (n.includes('flooring')) return 'Flooring & Home Renovation';
  if (n.includes('electrical')) return 'Electrical & Home Wiring';
  if (n.includes('garden') || n.includes('soil')) return 'Gardening & Landscaping';
  if (n.includes('cleaning')) return 'Cleaning & Home Tips';
  if (n.includes('solar')) return 'Solar Power & Energy';
  if (n.includes('hvac')) return 'HVAC & Home Comfort';
  if (n.includes('renovation')) return 'Home Renovation Costs';
  if (n.includes('ai writing')) return 'AI Writing Tools';
  if (n.includes('ai coding')) return 'AI Coding Tools';
  if (n.includes('ai design')) return 'AI Design Tools';
  if (n.includes('ai marketing')) return 'AI Marketing Tools';
  if (n.includes('ai video')) return 'AI Video Tools';
  if (n.includes('ai productivity')) return 'AI Productivity Tools';
  if (n.includes('ai audio')) return 'AI Audio Tools';
  if (n.includes('ai data')) return 'AI Data Tools';
  if (n.includes('ai ') && n.includes('tools')) return 'AI Tools Compared';
  if (n.includes('boss')) return 'Game Boss Strategies';
  if (n.includes('loot')) return 'Game Loot & Items';
  if (n.includes('character build')) return 'Game Character Builds';
  if (n.includes('item stats')) return 'Game Item Database';
  if (n.includes('weapon')) return 'Game Weapons';
  if (n.includes('npc')) return 'Game NPC Database';
  return 'Free Online Tools';
}

// ─── Publish date scheduling ───
// Spread across 21 days, ~12 pins/day (safe for new-ish accounts)
// User should start with 5/day for first week then ramp up.
function schedulePins(pins, startDate, pinsPerDay) {
  const scheduled = [];
  let dayOffset = 0;
  let dayCount = 0;

  for (let i = 0; i < pins.length; i++) {
    if (dayCount >= pinsPerDay) {
      dayOffset++;
      dayCount = 0;
    }

    const d = new Date(startDate);
    d.setDate(d.getDate() + dayOffset);
    // Distribute throughout the day: 9am-8pm spread
    const hour = 9 + Math.floor((dayCount / pinsPerDay) * 11);
    const minute = Math.floor(Math.random() * 45) + Math.floor(Math.random() * 2) * 30;
    d.setHours(hour, minute, 0, 0);

    scheduled.push({
      ...pins[i],
      publishDate: d.toISOString().replace('.000Z', '+00:00'),
    });
    dayCount++;
  }

  return scheduled;
}

// ─── CSV escape ───
function csvEscape(val) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// ─── Main ───
function main() {
  console.log('📌 Pinterest Bulk Upload CSV Generator\n');

  const allPins = JSON.parse(readFileSync(PINS_PATH, 'utf8'));
  console.log(`   Loaded ${allPins.length} pins`);

  mkdirSync(OUT_DIR, { recursive: true });

  // Load niche/domain from config.json (pin objects don't have .niche)
  const DATA = join(ROOT, 'src', 'data');
  const dirs = readdirSync(DATA).filter(d => d.startsWith('site-')).sort();
  const brandNiche = {};
  dirs.forEach(dir => {
    const cfg = JSON.parse(readFileSync(join(DATA, dir, 'config.json'), 'utf8'));
    brandNiche[cfg.designConfig.brandName] = cfg.niche;
  });

  // ── Strategy A: Category-based boards (fewer boards to create) ──
  const withBoards = allPins.map(pin => {
    const niche = brandNiche[pin.brand] || '';
    return {
      ...pin,
      niche,
      board: categoryBoard(niche),
      imageUrl: `${IMAGE_BASE_URL}/pin-${String(allPins.indexOf(pin) + 1).padStart(3, '0')}.png`,
    };
  });

  // Schedule: start tomorrow, 10 pins/day (safe for new account)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const scheduled = schedulePins(withBoards, tomorrow, 10);

  // Generate CSV with Pinterest-compatible columns
  const headers = ['Title', 'Media URL', 'Pinterest board', 'Description', 'Link', 'Publish date', 'Keywords'];
  const rows = scheduled.map(pin => [
    csvEscape(pin.title.substring(0, 100)),
    csvEscape(pin.imageUrl),
    csvEscape(pin.board),
    csvEscape(pin.description.substring(0, 500)),
    csvEscape(pin.link),
    csvEscape(pin.publishDate),
    csvEscape(pin.hashtags.join(', ')),
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');

  // Write full CSV
  const csvPath1 = resolve(OUT_DIR, 'pinterest-bulk-all-250.csv');
  writeFileSync(csvPath1, '﻿' + csv, 'utf8'); // BOM for Excel UTF-8
  console.log(`\n✅ Full CSV: ${csvPath1}`);
  console.log(`   250 pins · 10/day · ${Math.ceil(250 / 10)} days`);

  // ── Split into weekly batches (70 pins each, 10/day × 7 days) ──
  const weeks = [];
  for (let w = 0; w < 4; w++) {
    const start = w * 70;
    const weekPins = scheduled.slice(start, start + 70);
    if (weekPins.length === 0) break;

    const weekCsv = [headers.join(','), ...weekPins.map(pin => [
      csvEscape(pin.title.substring(0, 100)),
      csvEscape(pin.imageUrl),
      csvEscape(pin.board),
      csvEscape(pin.description.substring(0, 500)),
      csvEscape(pin.link),
      csvEscape(pin.publishDate),
      csvEscape(pin.hashtags.join(', ')),
    ].join(','))].join('\n');

    const weekPath = resolve(OUT_DIR, `pinterest-week-${w + 1}-${weekPins.length}pins.csv`);
    writeFileSync(weekPath, '﻿' + weekCsv, 'utf8');
    weeks.push({ file: weekPath, count: weekPins.length });
    console.log(`   Week ${w + 1}: ${weekPath} (${weekPins.length} pins)`);
  }

  // ── Board summary ──
  const boards = [...new Set(withBoards.map(p => p.board))].sort();
  const boardCounts = {};
  withBoards.forEach(p => { boardCounts[p.board] = (boardCounts[p.board] || 0) + 1; });

  console.log(`\n📋 Boards to create (${boards.length}):`);
  boards.forEach(b => console.log(`   • "${b}" — ${boardCounts[b]} pins`));

  // ── Info card ──
  const infoPath = resolve(OUT_DIR, 'README.txt');
  const infoContent = `PINTEREST BULK UPLOAD — INSTRUCTIONS
=====================================

PRE-REQUISITES:
  1. Pinterest Business Account (register at pinterest.com/business)
  2. Pin images deployed to Vercel (https://gomovecalc.xyz/pins/pin-XXX.png)
  3. Create the ${boards.length} boards listed below

BOARDS TO CREATE (${boards.length}):
${boards.map(b => `  • "${b}"`).join('\n')}

HOW TO UPLOAD:
  1. Go to Pinterest → Settings → Bulk create Pins
  2. Upload weekly CSV files in order (Week 1 first)
  3. Pinterest will schedule pins according to Publish date column
  4. Check pin status after 24 hours (Pinterest downloads images)

SAFETY (NEW ACCOUNT):
  • Week 1 CSV has 70 pins (10/day × 7 days) — FINE for new account
  • DO NOT upload all 250 at once — Pinterest may flag as spam
  • Wait 3-5 days between uploading each weekly CSV
  • Monitor account health after each batch

IF IMAGES DON'T LOAD:
  • Verify images are deployed: curl -I https://gomovecalc.xyz/pins/pin-001.png
  • Pinterest caches images — may take up to 24h to appear

FILES:
  • pinterest-bulk-all-250.csv — Full batch (use ONLY after account is warmed up)
  • pinterest-week-1-70pins.csv — Week 1 (start here)
  • pinterest-week-2-70pins.csv — Week 2
  • pinterest-week-3-70pins.csv — Week 3
  • pinterest-week-4-40pins.csv — Week 4
`;

  writeFileSync(infoPath, infoContent, 'utf8');
  console.log(`\n📖 Instructions: ${infoPath}`);
  console.log(`✅ Done.`);
}

main();
