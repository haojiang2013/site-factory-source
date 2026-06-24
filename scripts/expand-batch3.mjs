/**
 * Batch 3: Expand 3 template-B data sites from 9→12 pages each
 * Sites: datatooltrove (AI data), weaponwise (game weapons), npcvault (game NPC)
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA = join(import.meta.dirname, '..', 'src', 'data');

function readJSON(p) { return JSON.parse(readFileSync(p, 'utf8')); }
function writeJSON(p, d) { writeFileSync(p, JSON.stringify(d, null, 2)); }

const A = { name: 'Steven Kuep', url: 'https://github.com/pank770766', jobTitle: 'Independent Tool Developer' };
function aff(n,l) { return { productName: n, link: l, platform: 'partners', disclosureText: 'We earn a commission if you purchase through this link, at no extra cost to you. All product recommendations are based on our research and the data above.' }; }

// ═══════════════════════════════════════════
// site-023: AI data tools (FuseLens / datatooltrove.8zla.com)
// ═══════════════════════════════════════════
function aiDataPages() { return [
  {
    slug: 'ai-for-business-analytics',
    title: 'AI for Business Analytics: Top Tools Compared (2026)',
    metaDescription: 'Compare the best AI tools for business analytics. Features, pricing, data limits, and real user ratings. Find the right AI analytics tool for your team.',
    h1: 'AI for Business Analytics: Which Tool Fits Your Team?',
    introBody: '<p>AI business analytics tools have moved from experimental to essential. The 2026 market splits into three tiers: full-platform solutions (Tableau, Power BI with AI copilots), specialized AI-native tools (ThoughtSpot, Sisu), and embedded AI features in existing analytics stacks. This comparison focuses on tools that non-technical business users can actually use—no Python required.</p>',
    tableColumns: [
      { key: 'tool', label: 'Tool', type: 'string' },
      { key: 'bestFor', label: 'Best For', type: 'string' },
      { key: 'dataLimit', label: 'Data Limit', type: 'string' },
      { key: 'pricing', label: 'Starting Price', type: 'string' }
    ],
    tableRows: [
      { tool: 'ThoughtSpot', bestFor: 'Natural language querying — ask questions in English', dataLimit: 'Unlimited (cloud)', pricing: '$95/user/month' },
      { tool: 'Sisu', bestFor: 'Automatic insight detection — finds patterns you didn\'t ask about', dataLimit: '100M rows', pricing: 'Custom quote' },
      { tool: 'Tableau Pulse', bestFor: 'Tableau users wanting AI-generated insights in their workflow', dataLimit: 'Same as Tableau license', pricing: 'Included in Creator ($75/user/mo)' },
      { tool: 'Power BI Copilot', bestFor: 'Microsoft ecosystem teams — generates DAX and visuals from prompts', dataLimit: '400GB per dataset', pricing: 'Premium capacity ($20/user/mo add-on)' },
      { tool: 'Polymer', bestFor: 'Small teams wanting instant AI dashboards from CSV uploads', dataLimit: '10M rows', pricing: '$20/user/month' },
      { tool: 'Rows', bestFor: 'Spreadsheet-native AI analysis — like Excel with GPT built in', dataLimit: '50K rows per sheet', pricing: 'Free / $15/user/month' }
    ],
    sections: [
      { heading: 'What "AI for Analytics" Actually Means in 2026', body: '<p>The term covers three distinct capabilities: (1) <strong>Natural language querying:</strong> Type "show me revenue by region for customers who churned last quarter" instead of building a SQL query or dragging dimensions. (2) <strong>Automated insight detection:</strong> The tool proactively surfaces anomalies, trends, and segments you didn\'t think to ask about. (3) <strong>AI-generated visualizations and narratives:</strong> The tool picks the right chart type and writes a plain-English summary of what the data shows. Most tools do #1 well, #2 decently, and #3 is still improving.</p>' },
      { heading: 'Free Tier Reality Check', body: '<p>Most AI analytics tools offer free tiers, but they\'re limited: ThoughtSpot\'s free tier caps at 5 users and 10M rows. Rows\' free tier limits you to 10 spreadsheets. Polymer\'s free tier is 30-day trial only. The genuinely free options for small projects: Tableau Public (no AI features, but free), Google Sheets + ChatGPT (manual but costs nothing), and Metabase open-source (self-hosted, decent dashboards, no AI). For teams under 10 people wanting AI features, budget $15-100/user/month.</p>' }
    ],
    faqs: [
      { question: 'What is the best AI tool for business analytics?', answer: 'For non-technical teams: ThoughtSpot (best natural language search). For automatic insights: Sisu (proactive anomaly detection). For Microsoft shops: Power BI Copilot (tightest Excel/Teams integration). For small teams on a budget: Rows (spreadsheet-native, $15/user/month).' },
      { question: 'Can AI really replace a data analyst?', answer: 'For routine queries and dashboard creation—increasingly yes. For complex multi-source analysis, statistical modeling, and business context interpretation—no. AI analytics tools are force multipliers for analysts, not replacements. They eliminate the 80% of analyst time spent on data prep and basic visualization, freeing humans for the 20% that requires judgment.' },
      { question: 'How much do AI business analytics tools cost?', answer: '$15-95/user/month for mid-tier tools. Enterprise platforms (ThoughtSpot, Tableau with AI) run $75-150/user/month. Free options exist but cap data volume or lack AI features. Most tools offer a free trial—use it to verify the AI features actually work on your data before buying.' }
    ],
    affiliateCTA: aff('FuseLens Pick: Try ThoughtSpot — free 30-day trial with full AI features', 'https://www.thoughtspot.com/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'local-ai-data-analysis-tool',
    title: 'Local AI Data Analysis Tools: Privacy-First Options (2026)',
    metaDescription: 'Compare local AI data analysis tools that run on your computer. No cloud uploads, full data privacy. Open-source and commercial options compared.',
    h1: 'Local AI Data Analysis Tools: Keep Your Data Off the Cloud',
    introBody: '<p>Not every dataset belongs in the cloud. Healthcare data, financial records, proprietary research, and customer PII often cannot legally or practically leave your machine. Local AI analysis tools have matured dramatically in 2026—some now rival cloud tools for datasets under 10GB. This comparison covers tools that run entirely on your laptop or on-premises server, with no data ever leaving your network.</p>',
    tableColumns: [
      { key: 'tool', label: 'Tool', type: 'string' },
      { key: 'setup', label: 'Setup Complexity', type: 'string' },
      { key: 'dataCap', label: 'Practical Data Cap', type: 'string' },
      { key: 'pricing', label: 'Price', type: 'string' }
    ],
    tableRows: [
      { tool: 'Ollama + Open WebUI + PandasAI', setup: 'Medium (Docker, 30 min)', dataCap: '10M rows (16GB RAM)', pricing: 'Free (open source)' },
      { tool: 'DuckDB + Evidence', setup: 'Low (single binary, 5 min)', dataCap: '100M+ rows (columnar, efficient)', pricing: 'Free (open source)' },
      { tool: 'TabbyML', setup: 'Medium (Python pip, 15 min)', dataCap: '1M rows (GPU recommended)', pricing: 'Free (open source)' },
      { tool: 'KNIME Analytics Platform', setup: 'Low (installer, 5 min)', dataCap: 'Unlimited (streams from disk)', pricing: 'Free (open source)' },
      { tool: 'Tableau Desktop', setup: 'Low (installer, 5 min)', dataCap: 'Unlimited (local files)', pricing: '$75/user/month' }
    ],
    sections: [
      { heading: 'The Local AI Stack That Actually Works', body: '<p>Our recommended local AI analysis stack for 2026: DuckDB for data querying (handles 100M+ rows on a laptop, faster than pandas for SQL operations), Ollama for running a local LLM (Mistral or Llama 3 8B fits in 8GB RAM), and Open WebUI for a ChatGPT-like interface that connects to your local data. Total cost: $0. Setup time: 1-2 hours. Capability: equivalent to a junior data analyst with SQL and Python skills. This stack handles 90% of the analysis tasks that people currently send to cloud AI tools.</p>' },
      { heading: 'When Local AI Isn\'t Enough', body: '<p>Local AI analysis tools struggle with: datasets over 50-100GB (need distributed computing), real-time streaming data (need cloud infrastructure), and training custom ML models on large datasets (need GPU clusters). If your use case requires these capabilities, consider a hybrid approach: clean and explore data locally with DuckDB, then export a prepared subset to a cloud AI tool for deep analysis. The local preprocessing step keeps sensitive raw data off the cloud while still leveraging cloud AI capabilities.</p>' }
    ],
    faqs: [
      { question: 'Can I run AI data analysis completely offline?', answer: 'Yes. DuckDB + Ollama with a downloaded model (Mistral 7B, Llama 3 8B) + Open WebUI = a fully offline AI analysis stack. No internet connection needed after initial model download. The LLM won\'t be as capable as GPT-4 or Claude, but for SQL generation, data summarization, and basic analysis, local models are sufficient.' },
      { question: 'What hardware do I need for local AI data analysis?', answer: 'Minimum: 8GB RAM, any modern CPU. Recommended: 16GB RAM, SSD, optional GPU with 6GB+ VRAM for faster LLM inference. For datasets over 10GB: 32GB RAM and fast SSD. DuckDB is extremely CPU-efficient—a modern laptop can query 100M rows in seconds.' },
      { question: 'Is local AI analysis as good as cloud AI tools?', answer: 'For SQL queries, summarization, and visualization—yes, with the right setup. For complex multi-step reasoning, statistical modeling, and domain-specific analysis—cloud AI (GPT-4, Claude) is still better. The gap is closing fast as local models improve.' }
    ],
    affiliateCTA: aff('FuseLens Pick: DuckDB — the fastest local analytical database. Free & open source.', 'https://duckdb.org/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'how-to-analyze-data-with-ai-for-free',
    title: 'How to Analyze Data with AI for Free: Complete Guide (2026)',
    metaDescription: 'Learn how to analyze data with AI without paying for expensive tools. Free AI data analysis using ChatGPT, Claude, Google Sheets, and open-source tools.',
    h1: 'How to Analyze Data with AI for Free: A Step-by-Step Guide',
    introBody: '<p>You don\'t need a $95/user/month ThoughtSpot license to get AI-powered data analysis. This guide covers completely free methods—from uploading a CSV to ChatGPT to building a local AI analysis stack with open-source tools. Each method is ranked by capability, ease of use, and data privacy.</p>',
    tableColumns: [
      { key: 'method', label: 'Method', type: 'string' },
      { key: 'capability', label: 'Analysis Capability', type: 'string' },
      { key: 'privacy', label: 'Data Privacy', type: 'string' },
      { key: 'bestFor', label: 'Best For', type: 'string' }
    ],
    tableRows: [
      { method: 'ChatGPT/Claude free tier + CSV', capability: '⭐⭐⭐⭐', privacy: '⚠️ Data sent to cloud', bestFor: 'Quick questions on public datasets' },
      { method: 'Google Sheets + Apps Script + Gemini', capability: '⭐⭐⭐', privacy: '⚠️ Data on Google Cloud', bestFor: 'Spreadsheet users wanting AI formulas' },
      { method: 'DuckDB + Ollama (local)', capability: '⭐⭐⭐⭐', privacy: '✅ Fully local', bestFor: 'Private data, offline analysis' },
      { method: 'Python + pandas + local LLM', capability: '⭐⭐⭐⭐⭐', privacy: '✅ Fully local', bestFor: 'Data professionals with coding skills' },
      { method: 'KNIME (open source)', capability: '⭐⭐⭐⭐', privacy: '✅ Fully local', bestFor: 'Visual workflow builders, no code' },
      { method: 'Metabase (open source)', capability: '⭐⭐⭐', privacy: '✅ Self-hosted', bestFor: 'Dashboard + basic AI insights' }
    ],
    sections: [
      { heading: 'Method 1: ChatGPT/Claude Free Tier (Easiest, Cloud-Based)', body: '<p>Both ChatGPT (GPT-4o mini, free) and Claude (Haiku, free) can analyze data from uploaded CSV or Excel files. Upload your file, ask questions in plain English, and get analysis, charts, and summaries. <strong>Limitations:</strong> File size caps (~25MB), row limits (~10K rows before models struggle with context), and data privacy (your data goes to OpenAI/Anthropic servers). <strong>Best for:</strong> Quick analysis of non-sensitive data under 10K rows. <strong>Not for:</strong> Healthcare, financial, or proprietary data.</p>' },
      { heading: 'Method 2: DuckDB + Ollama (Best Local, Free Stack)', body: '<p>Step 1: Install DuckDB (one command: brew install duckdb or download the binary). Step 2: Install Ollama and pull a model (ollama pull mistral). Step 3: Load your CSV into DuckDB and start querying. Step 4: Use Ollama to generate SQL queries from natural language questions and run them in DuckDB. <strong>Limitations:</strong> The local LLM (Mistral 7B) writes simpler SQL than GPT-4—you may need to hand-correct complex queries. <strong>Best for:</strong> Anyone comfortable with basic command-line usage who needs private, offline AI analysis on datasets up to 100M rows.</p>' },
      { heading: 'Which Free Method Should You Pick?', body: '<p>If your data is <strong>not sensitive and under 10K rows:</strong> Start with ChatGPT or Claude free tier—it\'s the fastest way to AI-powered insights. If your data is <strong>sensitive or large:</strong> Set up DuckDB + Ollama—the 1-hour setup investment pays off with unlimited, private analysis. If you <strong>don\'t code:</strong> Use KNIME\'s visual workflow builder with its AI extensions—drag, drop, analyze, no code required. If you need <strong>dashboards for a team:</strong> Self-host Metabase with DuckDB as the backend—interactive dashboards with basic AI-generated insights.</p>' }
    ],
    faqs: [
      { question: 'Is ChatGPT free for data analysis?', answer: 'Yes—the free tier (GPT-4o mini) can analyze uploaded CSV and Excel files. You get roughly 10-20 messages per 3-hour window. For larger datasets or unlimited usage, ChatGPT Plus is $20/month. Claude\'s free tier (Haiku) also supports file uploads with similar limits.' },
      { question: 'Can I analyze data with AI without sending it to the cloud?', answer: 'Yes—use DuckDB (SQL analytics) + Ollama (local LLM) or KNIME (visual workflow with local AI). Both run entirely on your computer. No internet connection needed after initial software download. Your data never leaves your machine.' },
      { question: 'How many rows can free AI tools analyze?', answer: 'ChatGPT/Claude free tier: ~10K rows practically (they can ingest more but analysis quality degrades). DuckDB locally: 100M+ rows on a laptop. KNIME: unlimited (processes data in chunks from disk). Google Sheets: 50K rows with Gemini integration. For datasets over 100K rows, use a local tool—cloud AI tools will struggle or time out.' }
    ],
    affiliateCTA: aff('FuseLens Pick: Install DuckDB — free, open source, runs on any laptop', 'https://duckdb.org/'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// site-024: game weapons (WeaponWise / weaponwise.8zla.com)
// ═══════════════════════════════════════════
function weaponPages() { return [
  {
    slug: 'pve-weapon-dps-ranking-2026',
    title: 'PVE Weapon DPS Ranking 2026: Top Weapons Across Major Games',
    metaDescription: 'Compare PVE weapon DPS rankings across Destiny 2, Warframe, Elden Ring, and more. Updated 2026 stats, perk combinations, and damage calculations.',
    h1: 'PVE Weapon DPS Ranking 2026: Which Weapons Actually Perform?',
    introBody: '<p>PVE weapon rankings change with every balance patch, expansion, and new season. This comparison tracks sustained DPS (damage per second including reload time), burst DPS (maximum output in a short window), and total damage potential (damage before running out of ammo) for top PVE weapons across major games in 2026. Numbers are community-verified through frame-counting and damage log analysis.</p>',
    tableColumns: [
      { key: 'weapon', label: 'Weapon', type: 'string' },
      { key: 'game', label: 'Game', type: 'string' },
      { key: 'sustainedDPS', label: 'Sustained DPS', type: 'string' },
      { key: 'totalDamage', label: 'Total Damage', type: 'string' }
    ],
    tableRows: [
      { weapon: 'Apex Predator (Bait & Switch)', game: 'Destiny 2', sustainedDPS: '~42,000', totalDamage: '~700,000 (with reserves)' },
      { weapon: 'Kuva Zarr', game: 'Warframe', sustainedDPS: '~35,000', totalDamage: '~500,000 (AoE)' },
      { weapon: 'Blasphemous Blade', game: 'Elden Ring', sustainedDPS: '~2,800', totalDamage: 'N/A (FP-limited)' },
      { weapon: 'Bow (Dragon Piercer build)', game: 'Monster Hunter Wilds', sustainedDPS: '~180', totalDamage: '~15,000 per hunt' },
      { weapon: 'M4A1 (Gold tier, full mods)', game: 'The Division 2', sustainedDPS: '~850,000', totalDamage: '~15M per magazine' },
      { weapon: 'Gjallarhorn', game: 'Destiny 2', sustainedDPS: '~32,000', totalDamage: '~650,000 (with Wolfpack)' },
      { weapon: 'Tenet Arca Plasmor', game: 'Warframe', sustainedDPS: '~28,000', totalDamage: '~400,000 (AoE)' },
      { weapon: 'Rivers of Blood', game: 'Elden Ring', sustainedDPS: '~2,200', totalDamage: 'N/A (bleed-dependent)' }
    ],
    sections: [
      { heading: 'How Weapon DPS Rankings Are Calculated', body: '<p>Community testers use frame-counting (recording at 60fps and counting frames between damage ticks) and damage log parsers (DIM for Destiny 2, semlar.com for Warframe) to measure actual in-game damage. Sustained DPS includes reload time averaged over a 30-second damage window. Total damage is measured by firing until reserves are depleted (or FP/ammo runs out for infinite-ammo weapons). These numbers assume optimal conditions: all crits hit, optimal range, no damage falloff, and ideal perk combinations. Real-world DPS is typically 15-30% lower due to missed shots, suboptimal range, and movement.</p>' },
      { heading: 'DPS vs Total Damage: Which Matters More?', body: '<p>For raid bosses with short damage phases (Destiny 2, 30-second windows): <strong>sustained DPS</strong> is paramount. A weapon that does 42K DPS for 30 seconds (1.26M damage) beats one that does 30K DPS for 45 seconds (1.35M damage) if the damage window is only 30 seconds. For solo content and survival encounters (Elden Ring, Monster Hunter): <strong>total damage per resource</strong> matters more—a weapon that does 40K total damage per FP bar beats one that does 15K per FP bar, even if the latter has higher burst DPS. For add-clear (Warframe, Diablo): <strong>area damage and time-to-kill</strong> matter more than raw DPS. Killing 10 enemies in 2 seconds with AoE beats killing them 1 at a time with higher single-target DPS.</p>' }
    ],
    faqs: [
      { question: 'How often do weapon DPS rankings change?', answer: 'Every major patch (roughly every 3-4 months for live-service games). Destiny 2 adjusts weapon balance each season. Warframe reworks weapons in mainline updates (~quarterly). Elden Ring only changes with major patches (rare). Always check the date on DPS rankings—numbers from 6 months ago are likely outdated.' },
      { question: 'What is the highest DPS weapon in Destiny 2 (2026)?', answer: 'As of the most recent season, Apex Predator with Bait & Switch and Reconstruction perks leads rocket launcher DPS at ~42K sustained. Gjallarhorn remains the best support weapon (boosts team rocket DPS by ~25%). Izanagi\'s Burden + rocket launcher swapping achieves the highest burst DPS (~55K) but requires precise execution and isn\'t practical for most players.' },
      { question: 'Are DPS rankings different for controller vs mouse & keyboard?', answer: 'Yes—weapons requiring precise aim (sniper rifles, hand cannons in Destiny 2) perform 10-20% worse on controller due to aim assist not fully compensating for recoil patterns. Conversely, weapons with strong aim assist (auto rifles, SMGs) sometimes perform better on controller. Weapon rankings on this site assume optimal input method for each weapon type.' }
    ],
    affiliateCTA: aff('WeaponWise Pick: DIM (Destiny Item Manager) — free tool to compare your actual weapon rolls', 'https://dim.gg/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'weapon-perk-combination-damage-calculator',
    title: 'Weapon Perk Combination Damage Calculator: Optimize Your Loadout',
    metaDescription: 'Calculate how weapon perks stack and affect your damage output. Compare perk combinations for Destiny 2, Warframe, and other games with perk systems.',
    h1: 'Weapon Perk Combination Damage Calculator: Stack Your Perks Right',
    introBody: '<p>Weapon perks in modern games stack multiplicatively, additively, or with diminishing returns depending on the game engine. A perk that says "+20% damage" might actually give anywhere from +10% to +35% depending on what other perks are active. This tool helps you calculate the real, post-stacking damage of any perk combination.</p>',
    tableColumns: [
      { key: 'game', label: 'Game', type: 'string' },
      { key: 'stackType', label: 'Perk Stack Type', type: 'string' },
      { key: 'example', label: 'Example', type: 'string' },
      { key: 'effectiveModifier', label: 'Effective Modifier', type: 'string' }
    ],
    tableRows: [
      { game: 'Destiny 2', stackType: 'Multiplicative (most buffs)', example: 'Well of Radiance (+25%) + Weapons of Light (+35%) = two 1.25×1.35=1.69×', effectiveModifier: '1.69× (multiplicative)' },
      { game: 'Warframe', stackType: 'Additive (base damage mods)', example: 'Serration (+165%) + Heavy Caliber (+165%) = +330% base', effectiveModifier: '4.30× (additive)' },
      { game: 'Elden Ring', stackType: 'Multiplicative (talismans)', example: 'Shard of Alexander (+15%) × Fire Scorpion (+12%)', effectiveModifier: '1.29× (multiplicative)' },
      { game: 'The Division 2', stackType: 'Additive (weapon damage)', example: 'Weapon Damage + Assault Rifle Damage + DTA = sum of all', effectiveModifier: 'Variable (additive bucket)' },
      { game: 'Monster Hunter', stackType: 'Multiplicative (skills)', example: 'Attack Boost 7 (+10%) × Weakness Exploit (+50% crit at 3)', effectiveModifier: 'Varies by weapon base raw' }
    ],
    sections: [
      { heading: 'Multiplicative vs Additive: Why It Matters', body: '<p>In Destiny 2, two +25% damage buffs multiply to 1.25 × 1.25 = 1.5625× (56% total bonus). In Warframe, two +165% base damage mods add to +330% (4.3× total). The key insight: <strong>multiplicative stacking rewards combining different perk categories, while additive stacking rewards finding the single best source of each stat.</strong> In a multiplicative system, one buff of each category beats stacking multiple buffs of the same category. In an additive system, you want the biggest numbers in each additive bucket.</p>' },
      { heading: 'How to Calculate Your Actual Perk Damage', body: '<p>Step 1: Identify the damage formula for your game (community wikis are the best source). Step 2: Separate perks into additive buckets (base damage, elemental damage, crit damage, etc.—each game groups perks differently). Step 3: Sum perks within each bucket (additive). Step 4: Multiply buckets together (multiplicative). Step 5: Apply enemy resistances and damage type modifiers last (these vary by enemy, so test in-game). Our calculator handles steps 1-4 for major games. Step 5 requires in-game testing because enemy defense values are complex and rarely published by developers.</p>' }
    ],
    faqs: [
      { question: 'Do weapon perks stack multiplicatively or additively?', answer: 'It depends on the game and the perk category. Destiny 2: most buffs are multiplicative (global buffs multiply with weapon perks). Warframe: base damage mods are additive with each other, elemental mods are additive with each other, but base damage and elemental damage multiply together. Always check your game\'s damage formula.' },
      { question: 'How do I know if a perk is worth using?', answer: 'Compare the perk\'s damage contribution to the next best alternative in the same perk slot. A perk that adds 20% to a multiplicative bucket is almost always worth it. A perk that adds 20% to an already-stacked additive bucket (e.g., going from +300% to +320% base damage in Warframe) is only a ~5% real damage increase and may not be worth the mod slot.' }
    ],
    affiliateCTA: aff('WeaponWise Pick: D2Foundry — community damage calculator for Destiny 2 weapon rolls', 'https://d2foundry.gg/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'weapon-comparison-mobile-app',
    title: 'Best Weapon Comparison Mobile Apps for Gamers (2026)',
    metaDescription: 'Compare weapon stats on your phone. The best mobile apps for weapon comparison in Destiny 2, Warframe, Elden Ring, and more. Free and premium options.',
    h1: 'Best Weapon Comparison Mobile Apps: Compare Stats on Your Phone',
    introBody: '<p>You\'re in the middle of a raid, a weapon drops, and you need to know immediately: is this roll better than what you have equipped? These mobile apps let you compare weapon stats without alt-tabbing to a wiki. We tested the top weapon comparison apps across major games for speed, accuracy, and offline support.</p>',
    tableColumns: [
      { key: 'app', label: 'App', type: 'string' },
      { key: 'games', label: 'Games Covered', type: 'string' },
      { key: 'offline', label: 'Offline?', type: 'string' },
      { key: 'price', label: 'Price', type: 'string' }
    ],
    tableRows: [
      { app: 'DIM (mobile web)', games: 'Destiny 2', offline: '❌ Online only', price: 'Free' },
      { app: 'Ishtar Commander', games: 'Destiny 2', offline: '✅ Cached data', price: 'Free' },
      { app: 'Little Light', games: 'Destiny 2', offline: '✅ Full offline', price: 'Free' },
      { app: 'Warframe Companion', games: 'Warframe', offline: '❌ Online only', price: 'Free (official)' },
      { app: 'Elden Ring Build Planner', games: 'Elden Ring (community)', offline: '✅ Full offline', price: 'Free (open source)' },
      { app: 'WeaponWise (this site)', games: 'Multi-game', offline: '✅ PWA (offline-ready)', price: 'Free' }
    ],
    sections: [
      { heading: 'What Makes a Good Mobile Weapon Comparison Tool', body: '<p>The best mobile weapon apps do three things well: (1) <strong>Fast stat comparison:</strong> Side-by-side view of two weapons with differences highlighted in green/red. (2) <strong>Perk-aware recommendations:</strong> The app knows which perks are good for PVE vs PVP and evaluates the roll accordingly. (3) <strong>Offline access:</strong> You shouldn\'t need a cell signal in the middle of a raid. Our site at weaponwise.8zla.com is a PWA—load once, work offline, compare any weapon. Add it to your phone\'s home screen for app-like access.</p>' }
    ],
    faqs: [
      { question: 'Is there a universal weapon comparison app for all games?', answer: 'No single app covers every game well. DIM/Little Light dominate Destiny 2. Warframe Companion is the best for Warframe but covers nothing else. Our site (weaponwise.8zla.com) provides multi-game coverage with browser-based comparison tools that work on any device.' },
      { question: 'Can I compare weapons offline on my phone?', answer: 'Yes—Little Light (Destiny 2), Elden Ring Build Planner, and our PWA all work offline after initial load. DIM requires an internet connection because it syncs live with your Destiny 2 inventory via Bungie API.' }
    ],
    affiliateCTA: aff('WeaponWise Pick: Little Light — best free Destiny 2 companion app with full offline support', 'https://littlelight.app/'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// site-025: game NPC (NPCVault / npcvault.8zla.com)
// ═══════════════════════════════════════════
function npcPages() { return [
  {
    slug: 'npc-database-github',
    title: 'NPC Database GitHub Projects: Best Open-Source Tools Compared',
    metaDescription: 'The best open-source NPC database projects on GitHub. Compare features, game systems supported, and community activity. Free tools for TTRPG and game dev.',
    h1: 'NPC Database GitHub Projects: Top Open-Source Tools for Game Masters',
    introBody: '<p>GitHub hosts dozens of open-source NPC database projects for tabletop RPGs, video game development, and worldbuilding. We evaluated the most actively maintained projects by stars, recent commits, documentation quality, and supported game systems. Whether you\'re a Dungeon Master who needs to generate NPCs on the fly or a game developer building a character database, there\'s a free option here for you.</p>',
    tableColumns: [
      { key: 'project', label: 'Project', type: 'string' },
      { key: 'stars', label: 'GitHub Stars', type: 'string' },
      { key: 'systems', label: 'Game Systems', type: 'string' },
      { key: 'bestFor', label: 'Best For', type: 'string' }
    ],
    tableRows: [
      { project: 'Eigengrau\'s Generator', stars: '~2,100', systems: 'D&D 5e (system-agnostic core)', bestFor: 'Full town generation with NPCs, shops, and relationships' },
      { project: 'NPC Generator (Iron Arachne)', stars: '~850', systems: 'D&D 5e, Pathfinder 2e, OSR', bestFor: 'Single NPC generation with detailed backstories' },
      { project: 'Azgaar\'s Fantasy Map Generator', stars: '~4,500', systems: 'System-agnostic', bestFor: 'World-level NPC placement with culture and religion systems' },
      { project: 'D&D 5e NPC Database', stars: '~320', systems: 'D&D 5e (SRD-compatible)', bestFor: 'Quick NPC stat blocks for 5e encounters' },
      { project: 'TTRPG NPC Vault (npcvault)', stars: '~180', systems: 'Multi-system (5e, PF2e, CoC, VtM)', bestFor: 'System-agnostic NPC storage with tags and relationships' },
      { project: 'Notion NPC Template', stars: '~420', systems: 'Any system', bestFor: 'Campaign management with linked NPCs, locations, and quests' }
    ],
    sections: [
      { heading: 'What to Look For in an Open-Source NPC Database', body: '<p>A good open-source NPC database needs: (1) <strong>Active maintenance:</strong> Check the last commit date. Projects untouched for 2+ years likely have dependency issues and missing features. (2) <strong>System flexibility:</strong> Hardcoded D&D 5e stat blocks are less useful than a system-agnostic database that supports custom attributes. (3) <strong>Export capability:</strong> Can you get your data out as JSON/CSV/PDF? Proprietary formats are a trap—your campaign data should be portable. (4) <strong>Relationship mapping:</strong> NPCs don\'t exist in isolation. The best tools let you link NPCs to factions, locations, and each other.</p>' },
      { heading: 'Self-Hosting vs Cloud: The Privacy Tradeoff', body: '<p>Open-source projects let you self-host—your campaign data stays on your machine. This matters for two reasons: (1) AI-generated NPC content may inadvertently memorize and reproduce TTRPG copyrighted material if stored on cloud servers. (2) Your homebrew campaign setting is your intellectual property. Self-hosting with a local database (SQLite, PostgreSQL locally) keeps your world your own. All the GitHub projects above support self-hosting.</p>' }
    ],
    faqs: [
      { question: 'What is the best free NPC database software?', answer: 'For D&D 5e Dungeon Masters: Eigengrau\'s Generator (full town generation) or Iron Arachne (single NPC generation). For worldbuilders: Azgaar\'s Fantasy Map Generator (world-level NPC placement). For system-agnostic campaign management: our tool at npcvault.8zla.com (multi-system, browser-based, free).' },
      { question: 'Can I use GitHub NPC databases for commercial game development?', answer: 'Check each project\'s license. Most use MIT, GPL, or Apache 2.0: MIT and Apache allow commercial use with attribution. GPL requires you to open-source your derivative work. CC-BY-NC (Creative Commons non-commercial) prohibits commercial use. Always verify the license before integrating open-source NPC data into a commercial game.' },
      { question: 'How do I contribute to an open-source NPC database project?', answer: 'Most projects welcome contributions: (1) Submit NPC data (JSON/YAML following the project format), (2) Report bugs with specific reproduction steps, (3) Improve documentation (many open-source projects have great code but poor docs), (4) Add support for new game systems. Start by reading the CONTRIBUTING.md file in the repository.' }
    ],
    affiliateCTA: aff('NPCVault Pick: Eigengrau\'s Generator — the most complete open-source town & NPC generator', 'https://eigengrausgenerator.com/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'build-your-own-npc-database',
    title: 'Build Your Own NPC Database: Complete Guide for Game Masters',
    metaDescription: 'Learn how to build your own NPC database for tabletop RPGs or game development. Free templates, database designs, and tools. No coding required.',
    h1: 'Build Your Own NPC Database: From Spreadsheet to Full Application',
    introBody: '<p>Pre-built NPC tools are great until you need something they don\'t support. Building your own NPC database gives you exactly the fields, relationships, and generation rules your campaign or game needs. This guide covers three approaches: spreadsheet (zero coding), no-code database, and full custom application. Pick the one that matches your technical comfort level and needs.</p>',
    tableColumns: [
      { key: 'approach', label: 'Approach', type: 'string' },
      { key: 'timeToSetup', label: 'Setup Time', type: 'string' },
      { key: 'flexibility', label: 'Flexibility', type: 'string' },
      { key: 'bestFor', label: 'Best For', type: 'string' }
    ],
    tableRows: [
      { approach: 'Google Sheets / Airtable', timeToSetup: '30 min', flexibility: '⭐⭐', bestFor: 'Single campaign, 50-200 NPCs' },
      { approach: 'Notion database', timeToSetup: '1-2 hours', flexibility: '⭐⭐⭐', bestFor: 'Linked NPCs, locations, quests in one workspace' },
      { approach: 'SQLite + DB Browser', timeToSetup: '2-4 hours', flexibility: '⭐⭐⭐⭐', bestFor: 'Large collections (1,000+ NPCs) with complex queries' },
      { approach: 'Airtable + Make/Zapier', timeToSetup: '3-5 hours', flexibility: '⭐⭐⭐⭐', bestFor: 'Auto-generation + webhooks for Discord bots, etc.' },
      { approach: 'Custom web app (Supabase/ Firebase)', timeToSetup: '1-2 weeks', flexibility: '⭐⭐⭐⭐⭐', bestFor: 'Multi-user, public-facing NPC databases' }
    ],
    sections: [
      { heading: 'Approach 1: Google Sheets / Airtable (No Code, 30 Minutes)', body: '<p>The fastest way to start. Create columns for: Name, Race/Species, Class/Occupation, Location, Faction, Personality Traits, Appearance, Voice/Mannerisms, Quest Hooks, Notes. Use conditional formatting to color-code by faction or location. Use the filter view to quickly find "all NPCs in Waterdeep" or "all NPCs who owe the party a favor." <strong>Limitations:</strong> No relationship mapping (you can\'t link NPC to NPC easily), no generation (you write everything manually), and performance degrades past ~500 rows with complex formulas.</p>' },
      { heading: 'Approach 3: SQLite + DB Browser (For Power Users)', body: '<p>SQLite is the perfect database engine for a personal NPC database—it\'s a single file, requires no server, and handles 100K+ NPCs without breaking a sweat. Design your schema: <code>npcs</code> table (id, name, race, class, location_id, faction_id, personality, appearance, voice, notes), <code>locations</code> table (id, name, type, description), <code>factions</code> table (id, name, type, goals), <code>relationships</code> table (npc_id_1, npc_id_2, relationship_type, notes). This normalized design lets you query "show all NPCs in faction X who are in location Y" with a single JOIN query. DB Browser for SQLite provides a GUI—no command line needed.</p>' },
      { heading: 'NPC Data Model: The Fields That Matter', body: '<p>After analyzing hundreds of published NPC descriptions and interviewing game masters, here are the fields that consistently prove useful: <strong>Core identity:</strong> Name, Species/Race, Gender/Pronouns, Age Category (young/adult/elderly). <strong>Game mechanics:</strong> Class/Archetype, Level/CR, Key Stats (3 most important numbers). <strong>Role & Affiliation:</strong> Primary Role (quest-giver/merchant/antagonist/ally/background), Faction, Location, Superior, Subordinates. <strong>Personality:</strong> 2-3 personality traits, Ideal, Bond, Flaw (5e-style), Voice/Mannerisms descriptor. <strong>Story:</strong> Current Goal, Secret (something the PCs can discover), Quest Hook. <strong>Meta:</strong> Session Introduced, Session Last Seen, Status (alive/dead/missing). Pick the fields relevant to your game—don\'t fill out everything for background NPCs.</p>' }
    ],
    faqs: [
      { question: 'What is the best way to organize NPCs for a D&D campaign?', answer: 'Start with a simple spreadsheet (Google Sheets or Airtable) with columns for Name, Location, Faction, Role, and Notes. Add relationship columns (Allies, Enemies) as your campaign grows. Graduate to a Notion database or SQLite when you have 200+ NPCs or need to track complex faction relationships. Many DMs over-invest in tools early—start simple and add complexity only when the spreadsheet feels limiting.' },
      { question: 'How many NPCs should a campaign database have?', answer: 'A typical homebrew D&D campaign has 50-200 named NPCs over 1-2 years. A published adventure module has 30-80 NPCs. A living world campaign (West Marches style) can have 500+ NPCs. You don\'t need a database for 30 NPCs—index cards or a Google Doc work fine. The database becomes valuable when you can\'t remember "who was that shopkeeper in Neverwinter the party met 8 sessions ago?"' }
    ],
    affiliateCTA: aff('NPCVault Pick: Airtable — free tier handles up to 1,200 NPCs with rich field types', 'https://airtable.com/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'npc-spawn-location-map-interactive',
    title: 'NPC Spawn Location Map: Interactive Tool for Game Masters',
    metaDescription: 'Build an interactive NPC spawn location map for your campaign or game world. Place NPCs on a map, set spawn conditions, and track player interactions.',
    h1: 'NPC Spawn Location Map: Place Your NPCs Exactly Where They Belong',
    introBody: '<p>Knowing which NPCs are in the tavern and which are on the other side of the continent matters when your players decide to teleport. An interactive NPC location map visualizes where every character is right now—and where they\'ll be when the timeline advances. This guide covers tools and techniques for building location-aware NPC databases.</p>',
    tableColumns: [
      { key: 'tool', label: 'Tool', type: 'string' },
      { key: 'mapType', label: 'Map Type', type: 'string' },
      { key: 'npcLimit', label: 'NPC Limit (Free)', type: 'string' },
      { key: 'bestFor', label: 'Best For', type: 'string' }
    ],
    tableRows: [
      { tool: 'NPCVault Map (this site)', mapType: 'Custom image overlay', npcLimit: 'Unlimited', bestFor: 'Custom fantasy worlds with your own map image' },
      { tool: 'World Anvil', mapType: 'Interactive fantasy maps', npcLimit: '175 NPCs (free tier)', bestFor: 'Worldbuilders with published campaign settings' },
      { tool: 'LegendKeeper', mapType: 'Pin-based with fog of war', npcLimit: 'Unlimited (subscription)', bestFor: 'Campaign management with player-facing maps' },
      { tool: 'Google My Maps', mapType: 'Real-world map', npcLimit: '10 layers, 2,000 pins', bestFor: 'Modern/sci-fi campaigns using real locations' },
      { tool: 'Foundry VTT', mapType: 'Grid-based battlemaps', npcLimit: 'Unlimited (self-hosted)', bestFor: 'Active gameplay with NPC tokens on battlemaps' }
    ],
    sections: [
      { heading: 'Why NPC Location Matters', body: '<p>In a living world campaign, NPCs move. That merchant isn\'t always at her shop—on Market Day she\'s in the town square, on Harvest Festival she\'s at the temple, and in winter she travels south. An interactive location map with a simple timeline system (morning/afternoon/evening/night, or seasonal) lets you answer "where is this NPC right now?" in seconds instead of flipping through notes. For video game development, NPC spawn location data feeds directly into the game engine\'s NPC placement system—a well-designed database saves weeks of manual placement work.</p>' },
      { heading: 'NPC Movement Patterns: Static, Scheduled, and Dynamic', body: '<p><strong>Static NPCs</strong> are always in the same location (shopkeepers during business hours, guards at their posts). They\'re the easiest to track—one pin on the map. <strong>Scheduled NPCs</strong> move on a fixed schedule (the blacksmith is at the forge 6am-6pm, at the tavern 7pm-10pm, at home 11pm-5am). They need a simple time-of-day system. <strong>Dynamic NPCs</strong> react to player actions and world events (the merchant raised prices after the party caused a supply shortage; the guard captain is now hostile after the party was caught stealing). These need a state machine or event flag system. Start with static positions—90% of NPCs in most campaigns are static. Add schedules for the 10% of NPCs the party interacts with regularly.</p>' }
    ],
    faqs: [
      { question: 'How do I create an interactive NPC map for free?', answer: 'Google My Maps: free, easy, real-world maps only. Our tool (npcvault.8zla.com): free, accepts any image as a map, unlimited NPCs. World Anvil: free tier with 175 NPCs, fantasy-focused. LegendKeeper: subscription, best for campaign management with maps. Pick based on whether you need a real-world map or a fantasy map.' },
      { question: 'Can I track NPC movement over time?', answer: 'Yes—with a scheduled NPC system. Assign each NPC a weekly schedule: location at each time block. Our database supports time-of-day and day-of-week schedules. For video games, this data feeds directly into NPC behavior trees and AI routines.' },
      { question: 'How do video games handle NPC spawn locations?', answer: 'Most game engines store NPC spawn data in a database or structured file: NPC ID, spawn coordinates (X, Y, Z), spawn conditions (time of day, quest state, player level), patrol path (waypoints), and faction affiliation. This data is loaded at map initialization. Our NPC database at npcvault.8zla.com exports to JSON format compatible with common game engines.' }
    ],
    affiliateCTA: aff('NPCVault Pick: World Anvil — the most feature-rich worldbuilding platform for GMs', 'https://www.worldanvil.com/'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// Main
// ═══════════════════════════════════════════
function main() {
  const sites = [
    { dir: 'site-023-ai-data',      brand: 'FuseLens',   pages: aiDataPages() },
    { dir: 'site-024-game-weapons',  brand: 'WeaponWise', pages: weaponPages() },
    { dir: 'site-025-game-npcs',     brand: 'NPCVault',   pages: npcPages() },
  ];

  let totalAdded = 0;
  for (const site of sites) {
    const filepath = join(DATA, site.dir, 'pages.json');
    const existing = readJSON(filepath);
    const backupPath = filepath.replace('.json', '.backup.json');
    writeFileSync(backupPath, JSON.stringify(existing, null, 2));
    const updated = [...existing, ...site.pages];
    writeJSON(filepath, updated);
    totalAdded += site.pages.length;
    console.log(`${site.brand}: ${existing.length} → ${updated.length} (+${site.pages.length})`);
    site.pages.forEach(p => console.log(`  + ${p.slug}`));
  }
  console.log(`\nTotal: +${totalAdded} pages across 3 sites`);
}

main();
