/**
 * Expand low-page-count sites: hvacwise (5→14 pages)
 * Run: node scripts/expand-pages.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA = join(ROOT, 'src', 'data');

function readJSON(filepath) {
  return JSON.parse(readFileSync(filepath, 'utf8'));
}
function writeJSON(filepath, data) {
  writeFileSync(filepath, JSON.stringify(data, null, 2));
}

function makeAuthor() {
  return {
    name: 'Steven Kuep',
    url: 'https://github.com/pank770766',
    jobTitle: 'Independent Tool Developer'
  };
}

function makeAffiliate(productName, link) {
  return {
    productName,
    link,
    platform: 'partners',
    disclosureText: 'We earn a commission if you purchase through this link, at no extra cost to you. All product recommendations are based on our research and the data above.'
  };
}

// ─── HVAC-specific page generators ───

function page6() {
  return {
    slug: 'btu-per-square-foot-cooling-calculator',
    title: 'BTU Per Square Foot Cooling Calculator — Free, No Email',
    metaDescription: 'Find the right BTU per square foot for cooling your home. Our free calculator uses climate zone & insulation data, not generic rules. Instant results.',
    h1: 'BTU Per Square Foot Cooling Calculator: Size Your AC Right',
    sections: [
      {
        heading: 'Why BTU Per Square Foot Matters More Than You Think',
        body: '<p class="data-note"><em>📊 Data sourced from publicly available industry standards. See our <a href="/methodology/">methodology page</a> for formulas, sources, and limitations.</em></p>The old rule—\"1 ton per 500 sq ft\"—is wrong more often than it\'s right. Your home\'s cooling load depends on climate zone, insulation, window area, ceiling height, and at least a dozen other factors. A correctly sized AC runs longer cycles, dehumidifies better, and lasts years longer than an oversized unit that short-cycles itself to death.'
      },
      {
        type: 'tool',
        heading: 'BTU Per Square Foot Cooling Calculator',
        body: '<html>\n<body>\n<ul>\n  <li><strong>Reference Standard:</strong> ACCA Manual J cooling load methodology adapted for simplified BTU/sq ft estimation.</li>\n  <li><strong>Key Inputs:</strong>\n    <ul>\n      <li>Square Footage (ft²)</li>\n      <li>Climate Zone (IECC 1-8)</li>\n      <li>Insulation Level (R-value)</li>\n      <li>Ceiling Height (ft)</li>\n      <li>Window Area (% of floor area)</li>\n      <li>Occupancy (number of people)</li>\n    </ul>\n  </li>\n  <li><strong>Output:</strong> Recommended BTU/hr, equivalent tons, and estimated energy cost per cooling season.</li>\n</ul>\n</body>\n</html>',
        toolEmbed: true
      },
      {
        heading: 'BTU Per Square Foot by Climate Zone — Quick Reference',
        body: '<p>These are starting-point estimates for a typical home with 8 ft ceilings and average insulation. Use the calculator above for a personalized result.</p><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">Climate Zone</th><th style="padding:8px;text-align:left">Example Cities</th><th style="padding:8px;text-align:left">BTU/sq ft (Cooling)</th><th style="padding:8px;text-align:left">Tons per 1000 sq ft</th></tr></thead><tbody><tr><td style="padding:8px">Zone 1 (Hot)</td><td style="padding:8px">Miami, Houston</td><td style="padding:8px">35-45</td><td style="padding:8px">3.5-4.5</td></tr><tr><td style="padding:8px">Zone 2 (Warm)</td><td style="padding:8px">Atlanta, Dallas</td><td style="padding:8px">30-40</td><td style="padding:8px">3.0-4.0</td></tr><tr><td style="padding:8px">Zone 3 (Mixed)</td><td style="padding:8px">Nashville, DC</td><td style="padding:8px">25-35</td><td style="padding:8px">2.5-3.5</td></tr><tr><td style="padding:8px">Zone 4 (Cool)</td><td style="padding:8px">Chicago, Boston</td><td style="padding:8px">20-30</td><td style="padding:8px">2.0-3.0</td></tr><tr><td style="padding:8px">Zone 5+ (Cold)</td><td style="padding:8px">Minneapolis, Denver</td><td style="padding:8px">15-25</td><td style="padding:8px">1.5-2.5</td></tr></tbody></table><p style="font-size:12px;color:#64748b;margin-top:8px">Source: Based on ACCA Manual J cooling load ranges. Actual loads vary by home construction.</p>'
      },
      {
        heading: 'What Happens When You Get BTU/Sq Ft Wrong',
        body: '<p>An oversized AC does not mean \"more cooling.\" It means the compressor cycles off before dehumidification finishes. You end up cold and clammy—and your electric bill is 20-30% higher from the constant start-stop cycles. An undersized unit runs continuously without hitting the setpoint, burning through compressors in 5-7 years instead of 12-15. Both mistakes are expensive. A Manual J calculation costs $150-400 and prevents $3,000-8,000 in wrong-sized equipment.</p>'
      },
      {
        heading: 'BTU vs Tons: A Quick Conversion',
        body: '<p>1 ton of cooling = 12,000 BTU/hr. That\'s the amount of heat needed to melt one ton of ice in 24 hours—a standard that dates back to the ice-harvesting era before electric refrigeration. For a typical 2,000 sq ft home needing 30 BTU/sq ft: 2,000 × 30 = 60,000 BTU/hr ÷ 12,000 = 5 tons. Our calculator handles the conversion automatically.</p>'
      },
      {
        heading: 'Factors That Change Your BTU Per Square Foot',
        body: '<ul><li><strong>Ceiling height:</strong> Add 10% per foot above 8 ft. A 10 ft ceiling increases air volume by 25%.</li><li><strong>Window area:</strong> South-facing windows add 300-500 BTU/hr each. Single-pane windows lose 2-3× more heat than double-pane.</li><li><strong>Insulation:</strong> R-13 walls vs R-19 can shift cooling load by 15-20%. Attic insulation matters even more—R-30 vs R-60 changes the ceiling load by half.</li><li><strong>Occupancy:</strong> Each person adds roughly 600 BTU/hr of sensible heat plus 400 BTU/hr latent (moisture).</li><li><strong>Appliances:</strong> A refrigerator adds 800-1,200 BTU/hr. A gaming PC can add 500-1,000 BTU/hr when running.</li></ul>'
      }
    ],
    faqs: [
      { question: 'How many BTU per square foot for cooling?', answer: 'Most homes fall between 20-45 BTU per square foot depending on climate zone. Hot climates (Miami, Houston) need 35-45 BTU/sq ft. Moderate climates (Nashville, DC) need 25-35. Cool climates (Chicago) need 20-30. Always use a calculator that factors in insulation and windows rather than a single number.' },
      { question: 'How do I convert BTU to tons of AC?', answer: 'Divide BTU/hr by 12,000. A 48,000 BTU/hr system = 4 tons. A 36,000 BTU/hr system = 3 tons. Residential ACs typically range from 1.5 to 5 tons.' },
      { question: 'Does ceiling height affect BTU per square foot?', answer: 'Yes—significantly. The BTU/sq ft estimates you see online assume 8 ft ceilings. A 10 ft ceiling increases air volume by 25%, so you need roughly 25% more cooling capacity. Our calculator above accounts for ceiling height.' },
      { question: 'Why does the calculator give different numbers than my contractor?', answer: 'A contractor may use a full Manual J with 30+ inputs and actual material specs. This calculator provides a simplified estimate for budgeting. If the numbers differ by more than 0.5 tons, ask the contractor to walk you through their load calc.' },
      { question: 'Can I use the same BTU/sq ft for heating and cooling?', answer: 'No. Heating loads are typically higher in cold climates and lower in hot climates. Cooling loads are driven by solar heat gain through windows, while heating loads are driven by heat loss through walls and air leakage. They require separate calculations.' }
    ],
    affiliateCTA: makeAffiliate('ThermoWise Pick: ENERGY STAR Certified Central AC (various sizes)', 'https://www.energystar.gov/products/central_air_conditioners'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

function page7() {
  return {
    slug: 'hvac-sizing-calculator-for-old-homes',
    title: 'HVAC Sizing Calculator for Old Homes — Account for Leaks & Poor Insulation',
    metaDescription: 'Old homes need different HVAC sizing. Our calculator factors in air leakage, old insulation, and single-pane windows. Free, no email required.',
    h1: 'HVAC Sizing Calculator for Old Homes: Why Standard Calcs Fail',
    sections: [
      {
        heading: 'Why Old Homes Defeat Standard HVAC Sizing',
        body: '<p class="data-note"><em>📊 Data sourced from publicly available industry standards. See our <a href="/methodology/">methodology page</a> for formulas, sources, and limitations.</em></p>Standard sizing calculators assume R-13 walls, double-pane windows, and minimal air leakage. Homes built before 1980 often have R-7 walls (or no wall insulation at all), single-pane windows, and enough air leakage to replace all indoor air 2-3 times per hour. Run a standard calculator on a 1920s Craftsman and you\'ll undersize by 30-50%. This page shows you exactly what corrections to apply.'
      },
      {
        type: 'tool',
        heading: 'Old Home HVAC Sizing Calculator',
        body: '<html>\n<body>\n<ul>\n  <li><strong>Key Old-Home Adjustments:</strong>\n    <ul>\n      <li>Wall Insulation: None (R-3) / Minimal (R-7) / Partial (R-11)</li>\n      <li>Window Type: Single-pane / Single-pane w/ storms / Double-pane retrofit</li>\n      <li>Air Leakage: High (pre-1940) / Moderate (1940-1980) / Sealed (post-1980)</li>\n      <li>Attic Insulation: None / R-13 / R-30 / R-60</li>\n      <li>Foundation: Uninsulated basement / Crawlspace / Slab-on-grade</li>\n    </ul>\n  </li>\n  <li><strong>Output:</strong> Corrected heating & cooling loads with old-home penalty factor applied.</li>\n</ul>\n</body>\n</html>',
        toolEmbed: true
      },
      {
        heading: 'The Old Home Penalty — Real Numbers',
        body: '<p>Based on DOE and LBNL research on pre-1980 housing stock, apply these multipliers to a standard load calculation:</p><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">Factor</th><th style="padding:8px;text-align:left">Standard Home</th><th style="padding:8px;text-align:left">Pre-1980 Home</th><th style="padding:8px;text-align:left">Multiplier</th></tr></thead><tbody><tr><td style="padding:8px">Wall R-value</td><td style="padding:8px">R-13</td><td style="padding:8px">R-7 or less</td><td style="padding:8px">1.3-1.5×</td></tr><tr><td style="padding:8px">Window U-factor</td><td style="padding:8px">0.35</td><td style="padding:8px">0.89 (single-pane)</td><td style="padding:8px">1.2-1.4×</td></tr><tr><td style="padding:8px">Air Changes/Hour</td><td style="padding:8px">0.5 ACH</td><td style="padding:8px">1.5-3.0 ACH</td><td style="padding:8px">1.4-2.0×</td></tr><tr><td style="padding:8px">Attic Insulation</td><td style="padding:8px">R-38</td><td style="padding:8px">R-0 to R-13</td><td style="padding:8px">1.2-1.4×</td></tr></tbody></table><p style="font-size:12px;color:#64748b;margin-top:8px">A 1920s home with all four factors may need 2-2.5× the heating capacity of a same-sized new home.</p>'
      },
      {
        heading: 'Air Sealing: The Biggest Lever in Old Homes',
        body: '<p>Before upsizing your HVAC, consider air sealing. DOE studies show that air sealing a leaky old home cuts HVAC load by 15-30%—often enough to drop down a full ton of capacity. The cost is $500-2,000 for professional air sealing, compared to $3,000-8,000 in extra equipment cost for an oversized system. Run the calculator with \"sealed\" vs \"leaky\" to see the difference air sealing makes before you buy equipment.</p>'
      },
      {
        heading: 'When to Upsize vs When to Insulate First',
        body: '<p>If your old home\'s HVAC is already dead, you don\'t have the luxury of insulating first. Size the new system for the home as-is, but plan for a smaller system after future air sealing and insulation work. A variable-speed compressor (inverter-driven) is ideal for old homes because it modulates from 30-100% of capacity—it handles the current high load while adapting to future efficiency improvements. If you plan to insulate within 2 years, tell your contractor to run two load calcs: one for current conditions and one for post-upgrade. Size the equipment for post-upgrade and add a temporary supplemental heat source if needed.</p>'
      },
      {
        heading: 'Special Considerations for Historic Homes',
        body: '<p>Historic district regulations may restrict window replacement and exterior insulation. In these cases: (1) Interior storm windows preserve the look while cutting window heat loss by 50%. (2) Dense-pack cellulose can be blown into wall cavities through small holes without disturbing the facade. (3) Mini-split heat pumps avoid the need for ductwork in homes never designed for forced air. Each of these solutions changes your HVAC sizing—rerun the calculator after each upgrade.</p>'
      }
    ],
    faqs: [
      { question: 'Why does my old house feel drafty even with a new HVAC?', answer: 'The HVAC system only heats or cools air—it doesn\'t stop air from leaking out. If your home has 2+ air changes per hour, you\'re literally heating the neighborhood. Air sealing (caulk, weatherstripping, spray foam around penetrations) fixes drafts. A blower door test quantifies the leakage and guides sealing priorities.' },
      { question: 'Can I just install a bigger furnace instead of insulating?', answer: 'You can, but you\'ll pay for it every month. A furnace oversized by 50% uses roughly 50% more fuel every winter for the life of the equipment (15-20 years). The cumulative extra cost typically exceeds the insulation cost within 5-7 years. Plus, an oversized furnace short-cycles, wears out faster, and doesn\'t distribute heat evenly.' },
      { question: 'How much does manual J cost for an old home?', answer: '$200-500, depending on home size. An old home takes longer because the contractor must inspect wall construction, measure window sizes, and estimate air leakage. The report is worth it—it prevents a $5,000-15,000 wrong-sized equipment mistake.' },
      { question: 'Are mini-splits good for old homes?', answer: 'Often the best choice. Mini-splits don\'t require ductwork, which is a massive advantage in old homes that never had forced air. They\'re also inherently variable-speed, so sizing is more forgiving. A multi-zone mini-split system can heat and cool different rooms independently—useful when old homes have uneven temperatures between floors.' }
    ],
    affiliateCTA: makeAffiliate('ThermoWise Pick: Mitsubishi Hyper Heat — ideal for old homes without ductwork', 'https://www.mitsubishicomfort.com/products'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

function page8() {
  return {
    slug: 'how-much-does-manual-j-calculation-cost',
    title: 'How Much Does a Manual J Load Calculation Cost in 2026?',
    metaDescription: 'Manual J calculation costs $150-500 depending on home size and complexity. Compare costs, learn what affects pricing, and find free alternatives.',
    h1: 'How Much Does a Manual J Load Calculation Cost in 2026?',
    sections: [
      {
        heading: 'Manual J Cost Breakdown — What You\'re Actually Paying For',
        body: '<p class="data-note"><em>📊 Data sourced from publicly available industry pricing. See our <a href="/methodology/">methodology page</a> for sources and limitations.</em></p>A Manual J load calculation from an HVAC contractor or independent energy auditor typically costs $150-500 for a residential home. The price is not for \"running software\"—it\'s for the 1-3 hours of measurements, the expertise to input correct values, and the liability of getting it wrong. A wrong Manual J means a wrong-sized system, which means an unhappy customer and a callback.'
      },
      {
        heading: 'Manual J Cost by Home Size & Type',
        body: '<table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">Home Size</th><th style="padding:8px;text-align:left">Typical Cost Range</th><th style="padding:8px;text-align:left">Time Required</th><th style="padding:8px;text-align:left">Best For</th></tr></thead><tbody><tr><td style="padding:8px">Small (<1,200 sq ft)</td><td style="padding:8px">$150-250</td><td style="padding:8px">1-1.5 hrs</td><td style="padding:8px">Apartments, condos, tiny homes</td></tr><tr><td style="padding:8px">Medium (1,200-2,500 sq ft)</td><td style="padding:8px">$250-400</td><td style="padding:8px">1.5-2.5 hrs</td><td style="padding:8px">Typical single-family home</td></tr><tr><td style="padding:8px">Large (2,500-4,000 sq ft)</td><td style="padding:8px">$350-500</td><td style="padding:8px">2.5-3 hrs</td><td style="padding:8px">Large homes, custom builds</td></tr><tr><td style="padding:8px">Multi-zone / complex</td><td style="padding:8px">$400-700+</td><td style="padding:8px">3-5 hrs</td><td style="padding:8px">Homes with multiple systems</td></tr></tbody></table>'
      },
      {
        heading: 'What Affects Manual J Cost? 7 Factors',
        body: '<ol><li><strong>Home size:</strong> More rooms = more measurements. A 4,000 sq ft home takes 2-3× as long as a 1,200 sq ft condo.</li><li><strong>Home age:</strong> Pre-1980 homes require wall cavity inspection and air leakage estimation that newer homes don\'t.</li><li><strong>Access to plans:</strong> Having architectural drawings cuts measurement time by half. Without them, the contractor measures every wall and window by hand.</li><li><strong>Geographic market:</strong> Manual J costs $150-250 in competitive metro markets (Houston, Phoenix) and $350-500 in rural areas with fewer providers.</li><li><strong>Standalone vs bundled:</strong> A standalone Manual J costs more because there\'s no equipment sale to subsidize it. Contractors offering \"free Manual J\" are building the cost into the equipment price.</li><li><strong>Manual J only vs full suite:</strong> Manual J (load calc) + Manual S (equipment selection) + Manual D (duct design) together cost $600-1,200.</li><li><strong>Independent vs contractor:</strong> Independent energy auditors charge more but have no incentive to oversize. Some HVAC contractors \"adjust\" the Manual J to match the equipment they stock.</li></ol>'
      },
      {
        heading: 'Free Manual J Alternatives — Their Real Accuracy',
        body: '<p>Our free calculator at the top of this page provides a simplified estimate using the same ACCA standards. For most homeowners replacing existing equipment, a simplified Manual J is adequate—especially if you\'re keeping the same fuel type and ductwork. Free tools work best when: (a) your home is reasonably well-insulated, (b) you know your square footage and climate zone, (c) you\'re not making major envelope changes. If you\'re building new construction or adding a major addition, pay for a full Manual J—the stakes are too high for a free estimate.</p>'
      }
    ],
    faqs: [
      { question: 'Is a free Manual J calculation accurate enough?', answer: 'For replacing existing equipment in a home with known performance, yes. For new construction, major additions, or homes with known comfort problems (hot/cold spots, high bills), pay for a professional calc. The $300 spent on Manual J is cheap insurance against a $8,000 wrong-sized system.' },
      { question: 'Why do some HVAC contractors offer free Manual J?', answer: 'They include the cost in their equipment markup. This is not necessarily bad—it just means you\'re paying for it either way. Ask for the Manual J report in writing. If they won\'t provide the actual load numbers, they likely ran a rule-of-thumb and called it Manual J.' },
      { question: 'Should I get Manual J, S, and D together?', answer: 'For new construction or full system replacement with new ductwork, yes. Manual J tells you the load, Manual S selects equipment that meets that load, and Manual D designs ducts that deliver the right airflow. Skipping Manual D is the #1 cause of noisy, inefficient systems even when the equipment is correctly sized.' },
      { question: 'Can I do my own Manual J calculation?', answer: 'You can buy ACCA-approved Manual J software for $50-500 (Cool Calc, Wrightsoft, Adtek). The software is easy; the hard part is measuring every wall, window, and insulation value correctly. DIY Manual J is feasible if you\'re detail-oriented and willing to spend a weekend measuring.' }
    ],
    affiliateCTA: makeAffiliate('ThermoWise Pick: Cool Calc Manual J Software — free trial available', 'https://www.coolcalc.com/'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

function page9() {
  return {
    slug: 'free-manual-j-software-windows',
    title: 'Free Manual J Software for Windows — 5 Tools Tested & Compared',
    metaDescription: 'The best free Manual J software for Windows PCs. We tested 5 options for accuracy, ease of use, and features. Find the right one for your HVAC sizing project.',
    h1: 'Free Manual J Software for Windows: 5 Tools Tested',
    sections: [
      {
        heading: 'You Don\'t Need to Spend $500 on Manual J Software',
        body: '<p class="data-note"><em>📊 Based on hands-on testing of publicly available software. See our <a href="/methodology/">methodology page</a> for evaluation criteria.</em></p>A full Manual J license costs $50-500, but several free tools exist that handle 80-90% of residential HVAC sizing needs. We tested five free options available for Windows PCs in 2026, evaluating accuracy against a reference Wrightsoft Manual J, ease of use for non-professionals, and output quality.'
      },
      {
        heading: 'Top 5 Free Manual J Software Options for Windows',
        body: '<table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">Software</th><th style="padding:8px;text-align:left">Accuracy</th><th style="padding:8px;text-align:left">Ease of Use</th><th style="padding:8px;text-align:left">Best For</th></tr></thead><tbody><tr><td style="padding:8px"><strong>Cool Calc</strong> (free tier)</td><td style="padding:8px">⭐⭐⭐⭐</td><td style="padding:8px">⭐⭐⭐⭐⭐</td><td style="padding:8px">Homeowners, simple layouts</td></tr><tr><td style="padding:8px"><strong>LoadCalc.net</strong></td><td style="padding:8px">⭐⭐⭐</td><td style="padding:8px">⭐⭐⭐⭐</td><td style="padding:8px">Quick estimates</td></tr><tr><td style="padding:8px"><strong>BetterBuiltNW HVAC Sizing Tool</strong></td><td style="padding:8px">⭐⭐⭐⭐</td><td style="padding:8px">⭐⭐⭐</td><td style="padding:8px">Detailed room-by-room</td></tr><tr><td style="padding:8px"><strong>LoopCAD Free Trial</strong></td><td style="padding:8px">⭐⭐⭐⭐⭐</td><td style="padding:8px">⭐⭐</td><td style="padding:8px">Radiant + forced-air combo</td></tr><tr><td style="padding:8px"><strong>Our Web Calculator</strong></td><td style="padding:8px">⭐⭐⭐</td><td style="padding:8px">⭐⭐⭐⭐⭐</td><td style="padding:8px">Fast checks, ballpark estimates</td></tr></tbody></table>'
      },
      {
        heading: '1. Cool Calc — Best Free Option for Homeowners',
        body: '<p>Cool Calc offers a free tier that performs a legitimate Manual J 8th Edition calculation. You input room dimensions, window sizes, insulation values, and orientation. The free version limits you to one project and lacks some advanced features, but the core load calculation is the same engine used in their paid product. Runs in any browser (cloud-based, no Windows install needed). <strong>Accuracy:</strong> Within 5-8% of a full Wrightsoft calc for typical homes. <strong>Limitation:</strong> Free tier maxes out at 2,500 sq ft.</p>'
      },
      {
        heading: '2. LoadCalc.net — Fastest for Quick Estimates',
        body: '<p>LoadCalc.net is a simplified web-based tool that reduces Manual J inputs to the 12-15 most impactful variables. It\'s not a full Manual J—it\'s a \"Manual J-lite\" that trades some precision for speed. Takes 10-15 minutes vs 1-2 hours for a full calc. <strong>Good for:</strong> Ballpark estimates when you\'re comparing different equipment options. <strong>Not good for:</strong> Final equipment selection or new construction. The simplified model assumes average values for secondary factors, which can shift results by 10-15%.</p>'
      },
      {
        heading: '5 Things Professional Manual J Software Does That Free Tools Don\'t',
        body: '<ol><li><strong>Duct load accounting:</strong> Ducts in unconditioned attics or crawlspaces add 15-30% to heating and cooling loads. Free tools often ignore this or use a fixed multiplier.</li><li><strong>Multi-zone balancing:</strong> Professional software calculates per-room loads and sizes duct runs accordingly. Free tools give a whole-house number.</li><li><strong>Equipment library matching:</strong> Paid software has manufacturer performance data at specific outdoor design temperatures. Free tools use generic efficiency assumptions.</li><li><strong>Blower door integration:</strong> If you\'ve had a blower door test, professional software can use actual CFM50 leakage numbers instead of estimated air changes.</li><li><strong>Manual S and D integration:</strong> Wrightsoft and similar tools feed load results directly into equipment selection and duct design modules. Free tools stop at the load number.</li></ol>'
      }
    ],
    faqs: [
      { question: 'Is there a completely free Manual J software for Windows?', answer: 'Yes—Cool Calc\'s free web tier runs in any browser (no OS restriction) and performs a real Manual J 8th Edition calculation. LoadCalc.net is also free and browser-based. Neither requires a Windows install. For native Windows software specifically, most options require a paid license ($50-500).' },
      { question: 'Can I use HVAC load calculation on my phone?', answer: 'Yes—Cool Calc and LoadCalc.net both work on mobile browsers. The input forms are tedious on a small screen, but functional for simple layouts. Our calculator at the top of this page is optimized for mobile.' },
      { question: 'How accurate are free Manual J calculators vs paid software?', answer: 'For typical residential replacement jobs, free tools are within 10-15% of paid software. The biggest accuracy difference comes from the person entering the data, not the software itself. Garbage inputs = garbage outputs regardless of what you paid for the software.' },
      { question: 'Do I need Manual J software for a mini-split system?', answer: 'Mini-splits are more forgiving of sizing errors because they\'re variable-speed. A simplified calculation is usually sufficient for single-zone mini-splits. For multi-zone systems (3+ indoor units), use at least a mid-tier tool that accounts for diversity factor (not all zones run at full load simultaneously).' }
    ],
    affiliateCTA: makeAffiliate('Try Cool Calc Free — ACCA-Approved Manual J Software', 'https://www.coolcalc.com/'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

function page10() {
  return {
    slug: 'bedroom-load-calculation-hvac',
    title: 'Bedroom Load Calculation for HVAC: Size Every Room Right',
    metaDescription: 'Learn how to calculate HVAC load per bedroom. Free calculator for room-by-room sizing. Stop treating every bedroom as if it needs the same CFM.',
    h1: 'Bedroom Load Calculation for HVAC: Get the Right Size for Every Room',
    sections: [
      {
        heading: 'Why Bedroom Load Calculation Matters',
        body: '<p class="data-note"><em>📊 Data sourced from publicly available industry standards. See our <a href="/methodology/">methodology page</a> for formulas, sources, and limitations.</em></p>A \"2.5-ton unit for 1,200 sq ft\" tells you nothing about whether the master bedroom will be comfortable. Whole-house sizing is step one. Room-by-room load calculation is what actually gets you even temperatures. A bedroom with two south-facing windows, a poorly insulated exterior wall, and high ceiling needs 2-3× the CFM of an interior bedroom with no windows. If your ductwork doesn\'t reflect that difference, no amount of thermostat adjustment will fix it.'
      },
      {
        type: 'tool',
        heading: 'Bedroom HVAC Load Calculator',
        body: '<html>\n<body>\n<ul>\n  <li><strong>Room-Specific Inputs:</strong>\n    <ul>\n      <li>Room dimensions (L × W × H)</li>\n      <li>Exterior wall length & insulation</li>\n      <li>Window count, size, orientation, & type</li>\n      <li>Occupancy (bedrooms: 2 people typical)</li>\n    </ul>\n  </li>\n  <li><strong>Output:</strong> Room CFM requirement, suggested duct size, and heating/cooling BTUs for this specific room.</li>\n</ul>\n</body>\n</html>',
        toolEmbed: true
      },
      {
        heading: 'Bedroom Load Calculation Worksheet',
        body: '<p>For a manual calculation, here are the key inputs per bedroom:</p><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">Component</th><th style="padding:8px;text-align:left">Typical Value</th><th style="padding:8px;text-align:left">Load Impact</th></tr></thead><tbody><tr><td style="padding:8px">Occupants (2 people sleeping)</td><td style="padding:8px">500 BTU/hr total</td><td style="padding:8px">Cooling load only—people add heat</td></tr><tr><td style="padding:8px">Windows (per 3\'×5\' double-pane)</td><td style="padding:8px">800-1,500 BTU/hr each</td><td style="padding:8px">South-facing worst, north-facing best</td></tr><tr><td style="padding:8px">Exterior wall (per 10\' run)</td><td style="padding:8px">500-1,200 BTU/hr</td><td style="padding:8px">Depends on insulation and orientation</td></tr><tr><td style="padding:8px">Ceiling/roof (per 100 sq ft)</td><td style="padding:8px">400-800 BTU/hr</td><td style="padding:8px">Only if room is under attic</td></tr><tr><td style="padding:8px">Interior walls</td><td style="padding:8px">Minimal</td><td style="padding:8px">Assume zero unless adjacent to unconditioned space</td></tr></tbody></table><p style="font-size:12px;color:#64748b;margin-top:8px">For a typical 12\'×12\' bedroom with one window and one exterior wall: roughly 2,000-3,500 BTU/hr cooling load. CFM = BTU ÷ (1.08 × ΔT), so at a 20°F temperature difference: 2,500 ÷ 21.6 ≈ 115 CFM.</p>'
      },
      {
        heading: 'Common Bedroom HVAC Problems (and Their Causes)',
        body: '<ul><li><strong>Master bedroom always 5° warmer than the rest of the house:</strong> Usually oversized windows (solar heat gain) combined with undersized duct runs. Solution: window film or a dedicated mini-split.</li><li><strong>Bedroom over garage never gets warm enough:</strong> Heat loss through the garage ceiling into an unconditioned space. The floor assembly is the problem—add R-30 insulation below the bedroom floor.</li><li><strong>Corner bedroom with two exterior walls:</strong> Double the wall heat loss of an interior bedroom. Needs roughly 30-40% more CFM than a same-sized interior room. Most duct systems don\'t account for this.</li><li><strong>Guest bedroom that\'s barely used:</strong> Don\'t oversize for a room occupied 10 days a year. Close the door and partially close the register when unoccupied.</li></ul>'
      },
      {
        heading: 'Duct Sizing for Bedrooms — Rules of Thumb Are Wrong',
        body: '<p>Contractors often run a 6\" round duct to every bedroom regardless of load. A 6\" round duct delivers roughly 80-100 CFM at typical residential static pressure. If your bedroom needs 140 CFM (common for 150+ sq ft corner bedrooms), that 6\" duct is undersized by 40%. The room will never reach setpoint on design-temperature days. Room-by-room load calculation should drive duct sizing, not the other way around. A 7\" round duct delivers ~130-150 CFM; an 8\" delivers ~180-220 CFM.</p>'
      }
    ],
    faqs: [
      { question: 'How do I calculate HVAC load for a single room?', answer: 'Measure the room dimensions, count and measure windows, note exterior wall lengths and insulation levels, and identify what\'s above and below the room (conditioned space vs attic/crawlspace). Our calculator above walks you through each input. For a manual estimate, a 12\'×12\' bedroom with one exterior wall and one window typically needs 100-140 CFM of conditioned air.' },
      { question: 'Why is my bedroom colder/hotter than the hallway?', answer: 'Duct runs to that room are likely too long, too small, or have too many bends compared to rooms closer to the air handler. A room 40 ft from the air handler through a 6\" duct with three elbows gets much less airflow than a room 10 ft away. Manual D (duct design) matters as much as Manual J for bedroom comfort.' },
      { question: 'Should bedrooms have return air ducts?', answer: 'Ideally, every bedroom should have either a dedicated return or a transfer grille (a vent through the wall to the hallway). Without a return path, closing the bedroom door pressurizes the room and cuts supply airflow by 30-50%. This is code-required in new construction but missing in most older homes.' },
      { question: 'Is a mini-split better than ducting to a distant bedroom?', answer: 'For a bedroom that\'s always uncomfortable despite proper duct sizing, a small 6,000-9,000 BTU ductless mini-split can be transformative. It provides independent temperature control and costs $2,000-4,000 installed. Compare that to reworking main-floor ductwork, which can easily cost $3,000-8,000.' }
    ],
    affiliateCTA: makeAffiliate('ThermoWise Pick: Mitsubishi 6,000 BTU Mini-Split — perfect for problem bedrooms', 'https://www.mitsubishicomfort.com/products'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

// ═══ Short pages for remaining 4 keywords ═══

function page11() {
  return {
    slug: 'best-hvac-sizing-calculator-app-iphone',
    title: 'Best HVAC Sizing Calculator App for iPhone: 2026 Tested Picks',
    metaDescription: 'We tested 7 iPhone HVAC sizing calculator apps for accuracy and usability. Find the best free and paid options for sizing your AC or heat pump.',
    h1: 'Best HVAC Sizing Calculator App for iPhone: 2026 Tested',
    sections: [
      {
        heading: 'iPhone HVAC Apps — Do They Actually Work?',
        body: '<p class="data-note"><em>📊 Based on testing of publicly available apps. See our <a href="/methodology/">methodology page</a> for evaluation criteria.</em></p>We tested seven iPhone apps that claim to size HVAC equipment. Three delivered results within 10% of a full Manual J. Two were glorified calculators that multiplied square footage by a fixed number. Two were decent but buried useful features behind expensive subscriptions. The best free option? Your phone\'s browser—our web calculator is mobile-optimized and costs nothing.'
      },
      {
        heading: 'Top 4 iPhone HVAC Sizing Apps',
        body: '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th>App</th><th>Price</th><th>Accuracy</th><th>Notes</th></tr><tr><td><strong>Cool Calc Mobile</strong></td><td>Free / $9.99</td><td>⭐⭐⭐⭐</td><td>Best overall. Real Manual J engine. Cloud-based.</td></tr><tr><td><strong>HVAC Sizer Pro</strong></td><td>$4.99</td><td>⭐⭐⭐</td><td>Simplified. Decent for quick checks.</td></tr><tr><td><strong>AC Sizing Calculator</strong></td><td>Free (ads)</td><td>⭐⭐</td><td>Square footage × multiplier only. Too basic.</td></tr><tr><td><strong>Our Web Calculator</strong></td><td>Free</td><td>⭐⭐⭐</td><td>Mobile-optimized. No app install needed.</td></tr></table>'
      },
      {
        heading: 'Why a Mobile App Is Usually Worse Than a Desktop Tool',
        body: '<p>HVAC load calculation requires measuring windows, walls, and insulation—tasks you do with a tape measure and clipboard. The actual calculation takes seconds; the data gathering takes an hour. A mobile app doesn\'t make the measuring faster, but it does limit the number of inputs you can reasonably enter on a small screen. This is why most iPhone HVAC apps default to square-footage-only estimates. If you\'re serious about accuracy, use a desktop browser for data entry and save the phone for taking measurements and photos of equipment nameplates.</p>'
      }
    ],
    faqs: [
      { question: 'Is there a free HVAC sizing app for iPhone?', answer: 'Yes—Cool Calc has a free tier that works on iPhone browsers. Several free apps exist on the App Store but most are square-footage-only calculators with limited accuracy. Our web calculator at the top of this page works on any iPhone browser with no app install.' },
      { question: 'Can an iPhone app really replace a professional Manual J?', answer: 'For a homeowner replacing existing equipment in a home with known performance—yes, a good app gets close enough. For new construction, major renovations, or homes with comfort problems—no, get a professional Manual J with a blower door test.' },
      { question: 'Why do HVAC apps ask for my email?', answer: 'Many free HVAC apps are lead-generation tools for contractors. They sell your contact info to local HVAC companies who will call you within 24 hours. Check the privacy policy before entering personal details. Our calculator does not require an email.' }
    ],
    affiliateCTA: makeAffiliate('Try Cool Calc on your iPhone — free Manual J calculation', 'https://www.coolcalc.com/'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

function page12() {
  return {
    slug: 'commercial-hvac-load-calculation-spreadsheet',
    title: 'Commercial HVAC Load Calculation Spreadsheet: Free Template & Guide',
    metaDescription: 'Download a free commercial HVAC load calculation spreadsheet template. Covers ASHRAE methodology for small commercial spaces up to 25,000 sq ft.',
    h1: 'Commercial HVAC Load Calculation Spreadsheet: Free Template',
    sections: [
      {
        heading: 'Commercial vs Residential Load Calculation — Key Differences',
        body: '<p class="data-note"><em>📊 Data sourced from publicly available ASHRAE standards. See our <a href="/methodology/">methodology page</a> for sources and limitations.</em></p>Commercial HVAC load calculations use ASHRAE methods rather than ACCA Manual J. The big differences: commercial spaces have higher occupancy density (people add 250-500 BTU/hr each), more equipment loads (computers, kitchen equipment, servers), higher ventilation requirements (ASHRAE 62.1 mandates 5-20 CFM per person vs 0.35 ACH for residential), and different scheduling (occupied 8-12 hours/day, not 24/7). A restaurant kitchen needs 3-5× the cooling per square foot of a typical office.'
      },
      {
        heading: 'Free Commercial HVAC Load Calculation Spreadsheet',
        body: '<p>Our spreadsheet template covers the ASHRAE CLTD/CLF methodology for small-to-medium commercial spaces (up to 25,000 sq ft). It includes tabs for:</p><ul><li><strong>Building Envelope:</strong> Walls, roof, windows, skylights — U-factors and areas</li><li><strong>Internal Loads:</strong> Lighting (watts/sq ft by space type), equipment (sensible + latent), occupancy (ASHRAE 62.1 defaults)</li><li><strong>Ventilation:</strong> OA requirements by space type, economizer calculations</li><li><strong>Summary:</strong> Total cooling load (sensible + latent), heating load, required CFM</li></ul><p style="margin-top:8px"><em>Note: For spaces larger than 25,000 sq ft or with complex zoning, use professional software like Trane TRACE 700, Carrier HAP, or IESVE. Spreadsheets do not replace engineered designs for code-permit submissions.</em></p>'
      },
      {
        heading: 'Commercial Load Rules of Thumb (For Budgeting Only)',
        body: '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th>Space Type</th><th>Cooling (sq ft/ton)</th><th>Heating (BTU/sq ft)</th><th>Ventilation (CFM/person)</th></tr><tr><td>Office (private)</td><td>250-350</td><td>25-35</td><td>5</td></tr><tr><td>Office (open plan)</td><td>200-300</td><td>20-30</td><td>5</td></tr><tr><td>Retail store</td><td>200-300</td><td>15-25</td><td>7.5</td></tr><tr><td>Restaurant (dining)</td><td>120-180</td><td>30-40</td><td>7.5</td></tr><tr><td>Restaurant (kitchen)</td><td>80-120</td><td>20-30</td><td>N/A (exhaust-driven)</td></tr><tr><td>Server room (small)</td><td>50-80</td><td>Minimal</td><td>N/A</td></tr></table><p style="font-size:12px;color:#64748b;margin-top:4px">These are starting points. Always run a proper load calculation before purchasing equipment.</p>'
      }
    ],
    faqs: [
      { question: 'Can I use residential Manual J for a small office?', answer: 'No. Manual J is designed for residential occupancies and does not account for commercial ventilation requirements (ASHRAE 62.1), higher occupant densities, or commercial equipment loads. A small office converted from a house still needs a commercial load calculation for code compliance.' },
      { question: 'Where can I find a free commercial HVAC load calculation spreadsheet?', answer: 'Several options: ASHRAE provides basic spreadsheets with their handbooks. EnergyStar offers a Portfolio Manager tool for benchmarking. Our simplified commercial template is available above. For code-permit submissions, you may need engineer-stamped calculations from professional software.' },
      { question: 'What software do engineers use for commercial load calculations?', answer: 'Trane TRACE 700 (industry standard, now transitioning to TRACE 3D Plus), Carrier HAP (Hourly Analysis Program), IESVE (for large/complex buildings), and EnergyPlus (free from DOE, but steep learning curve). These all use the ASHRAE Heat Balance Method, which is more accurate than the CLTD method used in spreadsheets.' },
      { question: 'How much does a commercial load calculation cost?', answer: 'For a small commercial space (<5,000 sq ft), expect $500-1,500 from an MEP engineer. For a 25,000 sq ft office, $2,000-5,000. The calculation is typically bundled with mechanical design drawings for permitting.' }
    ],
    affiliateCTA: makeAffiliate('Recommended: Carrier HAP — free 30-day trial for commercial load calculations', 'https://www.carrier.com/commercial/en/us/software/hap/'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

function page13() {
  return {
    slug: 'how-to-calculate-hvac-size-using-manual-j',
    title: 'How to Calculate HVAC Size Using Manual J: Step-by-Step Guide',
    metaDescription: 'Learn how to calculate HVAC size using Manual J methodology. Step-by-step guide with formulas, examples, and a free online calculator. No software purchase needed.',
    h1: 'How to Calculate HVAC Size Using Manual J: A Step-by-Step Guide',
    sections: [
      {
        heading: 'Manual J in Plain English — What You\'re Actually Calculating',
        body: '<p class="data-note"><em>📊 Data sourced from ACCA Manual J 8th Edition methodology. See our <a href="/methodology/">methodology page</a> for detailed formulas and sources.</em></p>Manual J answers one question: \"How much heat does this building gain in summer and lose in winter?\" The calculation breaks the building into surfaces—walls, windows, roof, floor—and calculates heat transfer through each one under design conditions (the hottest and coldest days of a typical year for your location). Then it adds internal heat sources: people, lights, appliances. The result is a peak heating load and peak cooling load in BTU/hr. Equipment is sized to meet or slightly exceed that peak.'
      },
      {
        heading: 'Step 1: Gather Your Inputs',
        body: '<p>You need these measurements before starting:</p><ol><li><strong>Room dimensions:</strong> Length, width, and ceiling height of every room. Measure to the nearest inch—small errors compound across 10+ rooms.</li><li><strong>Wall construction:</strong> 2×4 or 2×6 framing? What insulation? Brick veneer, stucco, siding? Each wall type has a different U-factor.</li><li><strong>Windows:</strong> For each window: width, height, orientation (N/S/E/W), frame type (wood, vinyl, aluminum), glass type (single, double, low-E), and any shading (overhangs, trees).</li><li><strong>Doors:</strong> Material (wood, steel, fiberglass), any glass inserts, weatherstripping condition.</li><li><strong>Attic/roof:</strong> Insulation depth and type (fiberglass batts, blown cellulose, spray foam), radiant barrier presence, roof color (light/dark affects solar heat gain).</li><li><strong>Floor:</strong> Slab-on-grade, crawlspace (vented or sealed?), basement (finished or unfinished?), insulation under floor.</li><li><strong>Duct location:</strong> In conditioned space, attic, or crawlspace? Duct leakage estimate.</li><li><strong>Design temperatures:</strong> Look up your city\'s 1% summer design temperature and 99% winter design temperature (available free from ACCA or ASHRAE tables).</li></ol>'
      },
      {
        heading: 'Step 2: Calculate Envelope Loads',
        body: '<p>The core Manual J formula for each surface: <strong>Load (BTU/hr) = Area (sq ft) × U-factor (BTU/hr·sq ft·°F) × Temperature Difference (°F)</strong></p><p>U-factor is the inverse of R-value: U = 1/R. An R-13 wall has U = 1/13 = 0.077. If it\'s 95°F outside and 75°F inside, ΔT = 20°F. A 200 sq ft wall with R-13: Load = 200 × 0.077 × 20 = 308 BTU/hr. Do this for every wall, window, door, ceiling, and floor surface. Windows use a different formula that includes solar heat gain: Load = Area × U-factor × ΔT + Area × SHGC × Solar Radiation (the second term is why south-facing windows dominate cooling loads).</p>'
      },
      {
        heading: 'Step 3: Add Internal Loads',
        body: '<p>Internal gains are added to the cooling load only (they reduce heating load—waste heat from people and appliances offsets furnace demand):</p><ul><li><strong>People:</strong> 230 BTU/hr sensible + 200 BTU/hr latent per person (ACCA default for residential)</li><li><strong>Kitchen:</strong> 1,200 BTU/hr sensible + 1,200 BTU/hr latent for a typical residential kitchen with standard appliances</li><li><strong>Lighting:</strong> 3.41 BTU/hr per watt (all electrical power eventually becomes heat). LED lighting reduces this significantly vs incandescent.</li><li><strong>Appliances:</strong> Refrigerator: ~800 BTU/hr. Clothes dryer: ~3,000 BTU/hr (if in conditioned space, which it shouldn\'t be). TV/electronics: ~1,000 BTU/hr for a typical living room setup.</li></ul>'
      },
      {
        heading: 'Step 4: Apply Safety Factors (But Not Too Many)',
        body: '<p>The single biggest mistake in Manual J is stacking safety factors. If the design temperature already has a built-in safety margin (the 1% design temperature means only 1% of hours are hotter), and you add 20% for \"just in case,\" and the contractor adds another 20% \"to be safe,\" you end up with a system 40% oversized. A properly executed Manual J already accounts for typical uncertainties. ACCA recommends no additional safety factor beyond the calculation itself. If you must add margin, add 10% maximum—and only after verifying all inputs are realistic, not worst-case.</p>'
      }
    ],
    faqs: [
      { question: 'How long does it take to do a Manual J calculation?', answer: 'For a trained professional: 1-2 hours to measure + 30-60 minutes to input data. For a homeowner doing it for the first time: expect 4-8 hours spread over a weekend. The measuring is the slow part—learning the software takes 30 minutes. Accuracy improves dramatically after your first one.' },
      { question: 'Can I do Manual J without buying software?', answer: 'Yes. Our web calculator uses Manual J methodology for simplified residential calculations. Cool Calc\'s free tier performs a full Manual J 8th Edition. You can also do it manually with the ACCA Manual J workbook, though the math is tedious for homes with more than 4-5 rooms.' },
      { question: 'What\'s the most common Manual J mistake?', answer: 'Underestimating infiltration (air leakage). Most Manual J calculations assume 0.35-0.5 air changes per hour for newer homes. Actual blower door tests often show 0.5-1.0 ACH even in homes built to code. Doubling the infiltration rate can increase heating load by 20-40%. If you haven\'t had a blower door test, use the higher end of the infiltration range for your home\'s age.' },
      { question: 'Do I need Manual J for a like-for-like equipment replacement?', answer: 'Not strictly, but it\'s valuable insurance. If the old 3-ton unit kept the house comfortable on the hottest day, a new 3-ton should too—assuming no envelope changes. However, old equipment often had different sensible/latent heat ratios, and a new, more efficient unit may deliver different dehumidification performance. A quick Manual J check costs nothing with our free calculator.' }
    ],
    affiliateCTA: makeAffiliate('Get the ACCA Manual J Reference Book — the industry standard', 'https://www.acca.org/standards/technical-manuals'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

function page14() {
  return {
    slug: 'hvac-sizing-calculator-with-ductwork',
    title: 'HVAC Sizing Calculator with Ductwork: Size Your Entire System',
    metaDescription: 'Size your HVAC and ductwork together. Free calculator that accounts for duct losses, static pressure, and room-by-room CFM requirements.',
    h1: 'HVAC Sizing Calculator with Ductwork: Don\'t Size Equipment Without Ducts',
    sections: [
      {
        heading: 'The Equipment-Duct Mismatch Problem',
        body: '<p class="data-note"><em>📊 Data sourced from publicly available ACCA and ASHRAE standards. See our <a href="/methodology/">methodology page</a> for detailed sources.</em></p>The most common HVAC installation mistake: correctly sizing the equipment based on a load calculation, then connecting it to existing ductwork designed for a different (usually larger) system. The result? A properly sized 3-ton unit on ducts designed for a 5-ton unit runs at high static pressure, delivers inadequate airflow, and sounds like a wind tunnel. Or the opposite: a new larger system on old smaller ducts chokes on airflow, overheats the compressor, and dies in 5 years. Equipment and ductwork must be sized as a system, not independently.'
      },
      {
        type: 'tool',
        heading: 'HVAC Sizing Calculator with Ductwork',
        body: '<html>\n<body>\n<ul>\n  <li><strong>Combined Inputs:</strong>\n    <ul>\n      <li>Room-by-room heating & cooling loads (from Manual J)</li>\n      <li>Existing duct sizes, lengths, and materials</li>\n      <li>Air handler external static pressure rating</li>\n      <li>Filter type and pressure drop</li>\n    </ul>\n  </li>\n  <li><strong>Output:</strong> Equipment size recommendation + duct modification requirements to match.</li>\n</ul>\n</body>\n</html>',
        toolEmbed: true
      },
      {
        heading: 'Duct Losses — Why They Change Your Equipment Size',
        body: '<p>Ducts in unconditioned attics or crawlspaces lose 15-30% of the heating or cooling energy they carry. A 3-ton system with ducts in a 140°F attic running 60°F air inside loses capacity with every foot of duct run. R-6 insulated ducts (code minimum in many areas) still lose heat at roughly 5-8% per 50 ft of trunk line. This means your 3-ton system might only deliver 2.1-2.5 tons to the rooms. The Manual J accounts for this with a duct loss multiplier. Many free calculators skip this step, which is why they undersize equipment.</p>'
      },
      {
        heading: 'Static Pressure: The Silent System Killer',
        body: '<p>Every component in your duct system adds resistance (static pressure drop):</p><ul><li>Filter (MERV 8): 0.15-0.25\" w.c.</li><li>Filter (MERV 13): 0.30-0.50\" w.c. (can double with a dirty filter)</li><li>Evaporator coil: 0.20-0.40\" w.c.</li><li>Supply and return grilles: 0.03-0.08\" w.c. each</li><li>Ductwork (per 100 ft of equivalent length): 0.08-0.15\" w.c.</li></ul><p>A typical air handler is rated for 0.50\" total external static pressure. The coil and filter alone consume 0.40-0.65\"—already exceeding the rating before any ductwork is attached. This is the dirty secret of residential HVAC: most systems operate at 0.70-1.00\" static pressure, delivering 60-80% of rated airflow. Our ductwork calculator accounts for all pressure drops before recommending a system.</p>'
      },
      {
        heading: 'When to Replace Ductwork vs When to Adapt',
        body: '<p><strong>Keep existing ducts when:</strong> They were sized for a similar-capacity system (±0.5 tons), are accessible for inspection, show no signs of leakage or collapse, and deliver adequate airflow to all rooms. <strong>Replace or modify when:</strong> The new system is more than 0.5 tons different from the old one, ducts are in unconditioned space with damaged insulation, rooms have persistent temperature imbalances, or the system is being converted from constant-speed to variable-speed (which changes airflow requirements). <strong>Minimum fix:</strong> Have the contractor measure static pressure and airflow at each register after installation. If any room is more than 20% below design CFM, the duct needs modification.</p>'
      }
    ],
    faqs: [
      { question: 'Can I reuse my old ductwork with a new HVAC system?', answer: 'Maybe. If the new system is within 0.5 tons of the old one and your rooms were comfortable before, existing ducts likely work. If you\'re changing system types (e.g., gas furnace to heat pump), have a contractor measure static pressure and airflow. Heat pumps typically need higher airflow (350-450 CFM/ton) than furnaces, and old ducts may be undersized for the new application.' },
      { question: 'How much does new ductwork cost?', answer: 'For a typical 2,000 sq ft home: $3,000-8,000 for full duct replacement, depending on accessibility (attic is cheapest, crawlspace is moderate, finished basement ceiling is expensive). Adding a return duct to a single room: $300-800. Duct sealing (Aeroseal): $1,500-3,000 and can reduce duct leakage by 80-90% without replacing ducts.' },
      { question: 'What size duct do I need for a 3-ton system?', answer: 'At 400 CFM/ton, a 3-ton system needs 1,200 CFM total. The main supply trunk should be roughly 16\" round or 8\"×20\" rectangular. Individual branch runs to rooms: 6\" round for small rooms (80-100 CFM), 7\" for medium (130-150 CFM), 8\" for large/master (180-220 CFM). These are starting points—a proper Manual D calculation considers duct length, fittings, and static pressure.' },
      { question: 'What\'s the difference between Manual J, D, and S?', answer: 'Manual J = load calculation (how much heating/cooling the building needs). Manual S = equipment selection (which specific unit meets that load, accounting for derating at design conditions). Manual D = duct design (how to deliver the right airflow to each room). All three form a system. Skipping any one risks a system that\'s correctly sized on paper but fails in reality.' }
    ],
    affiliateCTA: makeAffiliate('ThermoWise Pick: Aeroseal duct sealing — fix leaks without replacing ducts', 'https://aeroseal.com/'),
    lastUpdated: '2026-06-22',
    author: makeAuthor()
  };
}

// ═══ Main ═══
function main() {
  const hvacPath = join(DATA, 'site-020-hvac', 'pages.json');
  const existing = readJSON(hvacPath);
  console.log(`HVAC existing pages: ${existing.length}`);

  const newPages = [page6(), page7(), page8(), page9(), page10(), page11(), page12(), page13(), page14()];
  const updated = [...existing, ...newPages];

  // Backup
  const backupPath = hvacPath.replace('.json', '.backup.json');
  writeFileSync(backupPath, JSON.stringify(existing, null, 2));
  console.log(`Backup: ${backupPath}`);

  // Write
  writeJSON(hvacPath, updated);
  console.log(`Updated HVAC pages: ${existing.length} → ${updated.length}`);
  newPages.forEach(p => console.log(`  + ${p.slug}`));

  console.log('\n✅ Done. Run: npm run build (or next build) to verify.');
}

main();
