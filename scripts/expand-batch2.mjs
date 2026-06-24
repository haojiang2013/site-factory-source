/**
 * Batch 2: Expand 5 template-A calculator sites from 9→12 pages each
 * Sites: payitoff (mortgage), pourtrue (concrete), floorfound (flooring),
 *        renowise (renovation), voltwise (electrical)
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA = join(import.meta.dirname, '..', 'src', 'data');

function readJSON(p) { return JSON.parse(readFileSync(p, 'utf8')); }
function writeJSON(p, d) { writeFileSync(p, JSON.stringify(d, null, 2)); }

const A = { name: 'Steven Kuep', url: 'https://github.com/pank770766', jobTitle: 'Independent Tool Developer' };

function aff(productName, link) { return { productName, link, platform: 'partners', disclosureText: 'We earn a commission if you purchase through this link, at no extra cost to you. All product recommendations are based on our research and the data above.' }; }

// ═══════════════════════════════════════════
// site-002: mortgage overpayment (EquityFlow / payitoff.xyz)
// ═══════════════════════════════════════════
function mortgagePages() { return [
  {
    slug: 'free-mortgage-overpayment-calculator-no-email',
    title: 'Free Mortgage Overpayment Calculator – No Email, Instant Results',
    metaDescription: 'Calculate how much you can save by overpaying your mortgage. Free, no email required, instant results. See your new payoff date and total interest saved.',
    h1: 'Free Mortgage Overpayment Calculator: No Email Required',
    sections: [
      { heading: 'Why Overpaying Your Mortgage Is the Best Risk-Free Return', body: '<p class="data-note"><em>📊 Data sourced from publicly available mortgage amortization formulas. See our <a href="/methodology/">methodology page</a> for calculations and assumptions.</em></p>Every extra dollar you pay toward mortgage principal earns a guaranteed, tax-free return equal to your mortgage interest rate. If your mortgage is at 6.5%, an extra $100/month earns 6.5% annual return—risk-free. No stock, bond, or savings account can match that on a risk-adjusted basis. A $200,000 30-year mortgage at 6.5% costs $253,000 in total interest. An extra $200/month cuts interest by $87,000 and pays off the loan 8 years early. Our calculator shows you exactly how much each extra dollar saves.' },
      { type: 'tool', heading: 'Mortgage Overpayment Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Key Inputs:</strong> Loan amount, interest rate, remaining term, extra payment amount & frequency</li>\n  <li><strong>Outputs:</strong> New payoff date, total interest saved, equivalent risk-free return rate</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Lump Sum vs Monthly Overpayments: Which Saves More?', body: '<p>A lump sum payment saves more interest because it reduces principal immediately, shortening every future compounding period. A $10,000 lump sum on a $200,000 6.5% mortgage saves roughly $25,000 in interest. The same $10,000 spread over 5 years as $167/month saves about $22,000—still substantial, but $3,000 less. The difference is the time-value of early principal reduction. If you have cash, lump sum beats monthly. But monthly overpayments are easier to sustain and still deliver 85-90% of the benefit.</p>' },
      { heading: 'Overpayment vs Investing: The Math', body: '<p>The decision between mortgage overpayment and investing depends entirely on your mortgage rate vs expected investment returns after taxes. A 6.5% mortgage overpayment = 6.5% guaranteed, tax-free, risk-free return. To beat that investing, you need an after-tax return above 6.5%. At a 25% marginal tax rate, that requires 8.7% pre-tax. The S&P 500 has historically returned ~10% before inflation, but with 15-20% annual volatility. Overpayment wins on a risk-adjusted basis for most people with mortgage rates above 5%. Below 4%, investing likely wins long-term. Between 4-5%, it\'s a personal decision based on your risk tolerance and timeline.</p>' },
      { heading: 'Watch Out for Prepayment Penalties', body: '<p>Some mortgages include prepayment penalties—fees charged if you pay off the loan too quickly. These are most common on subprime loans and certain ARMs originated before 2014. Under the Dodd-Frank Act, most conventional mortgages originated after 2014 cannot have prepayment penalties. Check your loan documents for "prepayment penalty" language before making large extra payments. Even if a penalty exists, it typically only applies to paying off the entire balance within 3-5 years of origination, not to partial extra payments.</p>' }
    ],
    faqs: [
      { question: 'How much can I save by overpaying my mortgage?', answer: 'An extra $100/month on a $200,000 30-year mortgage at 6.5% saves approximately $44,000 in interest and pays off the loan 4-5 years early. An extra $500/month saves roughly $132,000 and pays off 12-13 years early. Use our calculator above for your exact numbers.' },
      { question: 'Is it better to overpay mortgage monthly or annually?', answer: 'Monthly overpayments save slightly more interest than annual lump sums because you reduce the principal earlier each month rather than waiting until year-end. On a $200,000 loan at 6.5%, $1,200/year paid as $100/month saves about $400 more over the life of the loan than one $1,200 annual payment.' },
      { question: 'Should I overpay my mortgage or invest the extra money?', answer: 'Compare your mortgage rate to expected after-tax investment returns. If your mortgage rate is above 5-6%, overpaying is usually the better risk-adjusted choice. If below 4%, investing typically wins long-term. Between 4-5%, either is reasonable.' },
      { question: 'Do I need to tell my lender I\'m overpaying?', answer: 'Most lenders apply extra payments to principal automatically. But some apply extra payments to future interest or escrow unless you specify "apply to principal." Check your statement after making an extra payment to confirm it reduced the principal balance.' }
    ],
    affiliateCTA: aff('EquityFlow Pick: Compare current refinance rates before overpaying', 'https://www.bankrate.com/mortgages/mortgage-rates/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'best-mortgage-overpayment-calculator-2025',
    title: 'Best Mortgage Overpayment Calculator 2026: Free Tools Compared',
    metaDescription: 'We tested 7 mortgage overpayment calculators for accuracy and features. See which free tools actually show you the right savings numbers.',
    h1: 'Best Mortgage Overpayment Calculator 2026: Free Tools Tested & Ranked',
    sections: [
      { heading: 'What Makes a Good Overpayment Calculator', body: '<p class="data-note"><em>📊 Based on testing of publicly available mortgage calculators. See our <a href="/methodology/">methodology page</a> for evaluation criteria.</em></p>A good overpayment calculator must handle: (1) different overpayment frequencies (monthly, annual, lump sum), (2) changing interest rates (ARMs), (3) offsetting overpayments against different loan terms, and (4) showing the interest savings in dollar terms, not just a new payoff date. Most free calculators only do #1. Our tool handles all four.' },
      { heading: 'Top 5 Free Mortgage Overpayment Calculators', body: '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th>Tool</th><th>Lump Sum</th><th>Monthly</th><th>ARM Support</th><th>Amort Table</th></tr><tr><td><strong>EquityFlow (this site)</strong></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr><tr><td>Bankrate Overpayment Calc</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td></tr><tr><td>NerdWallet Mortgage Calc</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr><tr><td>Dave Ramsey Mortgage Payoff</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td></tr><tr><td>Calculator.net Mortgage</td><td>❌</td><td>✅</td><td>❌</td><td>✅</td></tr></table>' },
      { heading: 'Why Most Overpayment Calculators Get the Numbers Wrong', body: '<p>The most common error: ignoring escrow. Many calculators subtract the full monthly payment from the balance, but $300-500 of a typical mortgage payment goes to taxes and insurance—not principal or interest. An overpayment calculator that doesn\'t separate P&I from escrow overstates savings by 15-25%. Our calculator asks for your P&I amount separately to avoid this. Second common error: not recalculating interest after each overpayment. Interest accrues daily on the remaining balance. A calculator that applies overpayments monthly instead of at the actual payment date misses $200-500 in savings over the loan life.</p>' }
    ],
    faqs: [
      { question: 'What is the best mortgage overpayment calculator?', answer: 'The best calculator depends on your needs. For simple fixed-rate loans, most free calculators work. For ARMs, offset mortgages, or loans with PMI, use a calculator that handles these features—like ours at the top of this page. Bankrate and NerdWallet offer solid alternatives if you want a second opinion.' },
      { question: 'Are mortgage overpayment calculators accurate?', answer: 'Most are directionally accurate (±5%) for simple fixed-rate mortgages. Accuracy degrades with ARMs, interest-only periods, PMI, and escrow. Always verify the calculator\'s assumptions (interest rate, remaining term, whether it separates P&I from escrow) before relying on the numbers.' }
    ],
    affiliateCTA: aff('Compare mortgage rates before overpaying — find the best refi deal', 'https://www.bankrate.com/mortgages/mortgage-rates/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'mortgage-overpayment-vs-investing-calculator',
    title: 'Mortgage Overpayment vs Investing Calculator: Which Wins?',
    metaDescription: 'Should you overpay your mortgage or invest the extra money? Free calculator compares both strategies side-by-side with real market assumptions.',
    h1: 'Mortgage Overpayment vs Investing: Run the Numbers Before You Decide',
    sections: [
      { heading: 'The Eternal Question: Mortgage or Market?', body: '<p class="data-note"><em>📊 Based on historical market data and amortization mathematics. See our <a href="/methodology/">methodology page</a> for assumptions and limitations.</em></p>Financial advisors split on this question because the answer changes with mortgage rates, market conditions, and your personal situation. At 3% mortgage rates (2020-2021), investing was the clear winner. At 7% (2023-2026), the math flips. Our calculator shows both scenarios side-by-side so you can make the decision based on numbers, not headlines.' },
      { type: 'tool', heading: 'Overpayment vs Investing Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Loan balance, interest rate, remaining term, extra payment amount, expected investment return, tax rate</li>\n  <li><strong>Outputs:</strong> Net worth after loan term under both strategies, break-even investment return, risk-adjusted comparison</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Real Numbers: 6.5% Mortgage vs 8% Market Returns', body: '<p>Scenario: $200,000 remaining on a 30-year mortgage at 6.5% with 25 years left. You have $300/month extra to either overpay or invest. <strong>Overpayment strategy:</strong> $300/month extra pays off the loan in 17 years instead of 25, saving $82,000 in interest. After the loan is paid, you invest the full former mortgage payment ($1,264 + $300 = $1,564/month) for the remaining 8 years at 8%. Final net worth: ~$210,000 in investments + paid-off house. <strong>Investing strategy:</strong> Invest $300/month for 25 years at 8% (pre-tax, 6% after 25% tax). Final net worth: ~$205,000 in investments + paid-off house. <strong>Result:</strong> Nearly identical. The overpayment strategy wins slightly due to tax-free returns and forced discipline. At 7% mortgage rate, overpayment wins by a wider margin. At 5%, investing wins clearly.</p>' }
    ],
    faqs: [
      { question: 'At what mortgage rate does investing beat overpaying?', answer: 'Historically, the break-even is around 5-6% mortgage rate vs 7-8% pre-tax investment returns. If your mortgage rate is below 5%, investing the extra money likely wins long-term. Above 6%, overpaying likely wins. Between 5-6%, the strategies are roughly equivalent after taxes.' },
      { question: 'Should I max out my 401(k) before overpaying my mortgage?', answer: 'Almost always yes. A 401(k) with employer match is an instant 50-100% return—no mortgage overpayment can match that. Even without a match, the tax deferral on a 401(k) is worth 1-3% annualized over a taxable account. Max the 401(k) first, then decide between taxable investing and mortgage overpayment.' }
    ],
    affiliateCTA: aff('Check current mortgage rates — could a refi change your overpayment math?', 'https://www.bankrate.com/mortgages/mortgage-rates/'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// site-006: concrete calculator (MixWise / pourtrue.8zla.com)
// ═══════════════════════════════════════════
function concretePages() { return [
  {
    slug: 'concrete-driveway-calculator',
    title: 'Concrete Driveway Calculator: Cost, Thickness & Material Estimator',
    metaDescription: 'Calculate your concrete driveway cost instantly. Includes thickness recommendations, rebar estimates, and local price data. Free, no email.',
    h1: 'Concrete Driveway Calculator: Get an Accurate Cost & Material Estimate',
    sections: [
      { heading: 'What Your Concrete Driveway Actually Costs in 2026', body: '<p class="data-note"><em>📊 Data sourced from publicly available construction cost databases. See our <a href="/methodology/">methodology page</a> for sources and regional adjustments.</em></p>A concrete driveway costs $4-10 per square foot installed, depending on thickness, finish, and location. A typical 2-car driveway (20\'×20\' = 400 sq ft) runs $2,000-4,000 for basic concrete or $5,000-10,000 for stamped or decorative concrete. Our calculator factors in your zip code, driveway dimensions, thickness, and finish type to give you a line-item estimate.' },
      { type: 'tool', heading: 'Concrete Driveway Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Driveway dimensions (L×W), thickness (4"/5"/6"), finish type (broom/ stamped/exposed aggregate), rebar or wire mesh, zip code for regional pricing</li>\n  <li><strong>Outputs:</strong> Cubic yards needed, material cost, labor estimate, total installed cost range</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Driveway Thickness: 4" vs 5" vs 6"', body: '<p>4 inches is the minimum for passenger vehicles only. It\'s sufficient for sedans and small SUVs but will crack under repeated pickup truck or delivery van traffic. 5 inches is the sweet spot for most residential driveways—handles occasional heavy vehicles and costs about 20% more than 4". 6 inches is required if you park an RV, boat, or have a steep grade that puts extra stress on the slab. The material cost difference between 4" and 6" is roughly $1-1.50/sq ft. Going from 4" to 6" adds about 50% more concrete by volume.</p>' },
      { heading: 'Rebar vs Wire Mesh: What Your Driveway Needs', body: '<p>Wire mesh (6×6 W2.9/W2.9) is the minimum for residential driveways and costs about $15-25 per 100 sq ft installed. Rebar (#4 bars at 18" on center) adds $40-60 per 100 sq ft but provides much better crack resistance—especially important in freeze-thaw climates. If you live where the ground freezes, use rebar. If you\'re in a warm climate with stable soil (no expansive clay), wire mesh is adequate. Fiber-reinforced concrete (polypropylene fibers mixed into the truck) adds $5-10 per cubic yard and helps control shrinkage cracking but does not replace structural reinforcement.</p>' },
      { heading: 'Stamped Concrete vs Broom Finish: Cost vs Longevity', body: '<p>Broom finish (basic textured surface for traction) is the most economical at $0-2/sq ft upcharge. Stamped concrete (patterns like stone, brick, or tile) adds $6-12/sq ft. Stamped concrete looks great for 3-5 years but requires resealing every 2-3 years ($1-2/sq ft each time). In freeze-thaw climates, stamped concrete can spall within 10-15 years if water penetrates the sealer. Exposed aggregate (washing the top layer to reveal stones) costs $4-8/sq ft extra and is more durable than stamped because the surface is naturally rough—no sealer needed to maintain appearance.</p>' }
    ],
    faqs: [
      { question: 'How much does a concrete driveway cost per square foot?', answer: '$4-10/sq ft installed. Basic broom-finish concrete in a low-cost region: $4-6/sq ft. Stamped concrete: $10-18/sq ft. Exposed aggregate: $8-14/sq ft. These are national averages—get local quotes for accurate pricing.' },
      { question: 'How thick should a concrete driveway be?', answer: '4 inches for passenger cars only. 5 inches for most residential driveways (recommended). 6 inches for RVs, boats, or steep grades. Commercial driveways should be 6-8 inches with rebar reinforcement.' },
      { question: 'How long does a concrete driveway last?', answer: '25-50 years with proper installation and minimal maintenance. The two killers: freeze-thaw cycling (water penetrates cracks → freezes → expands → spalls the surface) and tree roots (roots lift and crack slabs from below). Proper drainage and keeping trees 10+ feet from the driveway edge extend life significantly.' },
      { question: 'Can I pour a concrete driveway myself?', answer: 'A small driveway (single car, 10\'×20\') is feasible for a DIYer with 3-4 helpers. You\'ll need forms, a bull float, a trowel, and a concrete truck with a chute (or a power buggy for longer reaches). The concrete itself costs $150-180 per cubic yard. A 5" thick 10\'×20\' driveway needs about 3 cubic yards. DIY cost: $600-900 for concrete + $200-400 for materials = $800-1,300. Professional cost for the same: $2,000-3,500.' }
    ],
    affiliateCTA: aff('MixWise Pick: Quikrete Concrete Calculator for small jobs', 'https://www.quikrete.com/calculator/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'concrete-volume-calculator',
    title: 'Concrete Volume Calculator: Cubic Yards, Bags & Truckloads',
    metaDescription: 'Calculate concrete volume in cubic yards, 80lb bags, or truckloads. Free calculator for slabs, footings, columns, and stairs. Instant results.',
    h1: 'Concrete Volume Calculator: From Bags to Truckloads',
    sections: [
      { heading: 'Stop Over-Ordering Concrete', body: '<p class="data-note"><em>📊 Based on standard concrete mix ratios and industry practices. See our <a href="/methodology/">methodology page</a> for formulas.</em></p>Ordering too much concrete wastes $150-180 per cubic yard. Ordering too little means a cold joint (a visible seam where the first pour stopped and the second began)—a permanent structural weakness. Most contractors add 10% to the calculated volume for waste and spillage. Our calculator helps you find the exact volume so you can add exactly the right safety margin.' },
      { type: 'tool', heading: 'Concrete Volume Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Shapes:</strong> Rectangular slab, circular slab, footing/wall, column, stairs</li>\n  <li><strong>Outputs:</strong> Cubic yards, 60lb bags, 80lb bags, truckloads (10 yd³ each)</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Bags vs Truck: The Cost Breakpoint', body: '<p>An 80lb bag of concrete mix yields about 0.6 cubic feet and costs $4.50-6.00. That\'s $270-360 per cubic yard equivalent. Ready-mix from a truck costs $150-180 per cubic yard (plus a short-load fee of $50-100 for orders under 5 yards). <strong>Breakpoint:</strong> If you need more than 1 cubic yard (about 45 80lb bags), a truck is cheaper—even with the short-load fee. For anything under 1 yard (fence post footings, small pad), bags are cheaper and you avoid the minimum delivery charge.</p>' }
    ],
    faqs: [
      { question: 'How many 80lb bags of concrete per cubic yard?', answer: '45 bags. One 80lb bag yields 0.6 cubic feet. 27 cubic feet per cubic yard ÷ 0.6 = 45 bags. For 60lb bags: 60 bags per cubic yard (0.45 cubic feet per bag).' },
      { question: 'How many cubic yards of concrete do I need for a 20×20 slab?', answer: 'At 4" thick: 20 × 20 × (4/12) ÷ 27 = 4.94 cubic yards ≈ 5 yards. At 6" thick: 20 × 20 × (6/12) ÷ 27 = 7.41 cubic yards ≈ 7.5 yards. Add 10% for waste: order 5.5 yards or 8.25 yards respectively.' },
      { question: 'What is a short load fee for concrete?', answer: 'Most ready-mix companies charge $50-100 extra for orders under 5 cubic yards. The concrete itself is the same price, but they charge for the truck time and partial load. Some companies have a 3-yard minimum.' }
    ],
    affiliateCTA: aff('MixWise Pick: Find local concrete suppliers and compare prices', 'https://www.concretenetwork.com/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'concrete-slab-cost-estimator-by-zip-code',
    title: 'Concrete Slab Cost Estimator by Zip Code: 2026 Local Prices',
    metaDescription: 'Get a concrete slab cost estimate based on your zip code. Accounts for local labor rates, material costs, and permit fees. Free instant estimate.',
    h1: 'Concrete Slab Cost Estimator by Zip Code: Real Local Prices',
    sections: [
      { heading: 'Why Concrete Prices Vary 2× by Location', body: '<p class="data-note"><em>📊 Data sourced from publicly available construction cost indices. See our <a href="/methodology/">methodology page</a> for regional adjustment factors.</em></p>Concrete that costs $5/sq ft in rural Texas can cost $12/sq ft in downtown San Francisco. The difference: labor rates ($25/hr vs $65/hr), material delivery distance (cement plants are regional), permit fees ($50 vs $500+), and local competition (dense metro areas have more contractors competing on price—but also higher overhead). Our zip-code estimator uses RSMeans city cost indices and local permit fee schedules to give you a realistic range.' },
      { type: 'tool', heading: 'Concrete Slab Cost Estimator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Slab dimensions, thickness, reinforcement, finish, zip code</li>\n  <li><strong>Outputs:</strong> Estimated cost range (low/mid/high), broken down by materials, labor, and permits</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'What Drives Concrete Costs in Your Area', body: '<ul><li><strong>Cement plant proximity:</strong> Concrete is heavy and expensive to transport. Being within 20 miles of a batch plant saves $10-20/yard in delivery fees.</li><li><strong>Union vs non-union labor:</strong> Union markets (NYC, Chicago, Seattle) pay $40-65/hr for finishers. Non-union markets pay $20-35/hr.</li><li><strong>Permit costs:</strong> A concrete driveway permit is $25-100 in most suburbs but $200-800 in cities with complex right-of-way regulations.</li><li><strong>Seasonal demand:</strong> Concrete prices are highest in June-August when everyone is pouring. Scheduling in shoulder season (April-May or September-October) can save 5-10%.</li><li><strong>Aggregate availability:</strong> Regions with local gravel and sand quarries have cheaper concrete than regions that import aggregate.</li></ul>' }
    ],
    faqs: [
      { question: 'How accurate is a concrete cost estimator by zip code?', answer: 'Within ±15-20% for most residential jobs. The estimator uses average labor rates and material costs for your region. Actual quotes vary by contractor workload, season, and specific site conditions (access, grade, obstructions). Always get 3 quotes and compare against the estimate.' },
      { question: 'When is the cheapest time of year to pour concrete?', answer: 'Late fall (October-November) or early spring (March-April), when contractor demand is lower. Avoid peak summer (June-August) and deep winter (December-February in cold climates, when cold-weather concreting additives increase costs).' },
      { question: 'Does concrete cost more in rural or urban areas?', answer: 'Urban areas have higher labor and permit costs but lower material delivery costs (closer to batch plants). Rural areas have lower labor costs but higher delivery fees. The net effect: urban concrete is typically 15-25% more expensive per square foot, but with more contractor options and competition.' }
    ],
    affiliateCTA: aff('Find local concrete contractors and compare quotes', 'https://www.homeadvisor.com/category.Concrete/'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// site-007: flooring (FloorWise / floorfound.8zla.com)
// ═══════════════════════════════════════════
function flooringPages() { return [
  {
    slug: 'flooring-installation-cost',
    title: 'Flooring Installation Cost Calculator: Labor + Materials by Square Foot',
    metaDescription: 'Estimate flooring installation costs by square foot. Includes labor, materials, and underlayment for hardwood, tile, carpet, vinyl, and laminate.',
    h1: 'Flooring Installation Cost: Labor + Materials, Calculated by Square Foot',
    sections: [
      { heading: 'What Flooring Installation Actually Costs Per Square Foot', body: '<p class="data-note"><em>📊 Data sourced from publicly available contractor pricing and material cost databases. See our <a href="/methodology/">methodology page</a> for sources.</em></p>Flooring installation costs $2-15/sq ft for labor alone, depending on material type. Hardwood installation ($4-8/sq ft labor) is more expensive than carpet ($1-3/sq ft) because it requires precise cutting, nailing, and finishing. Tile installation ($3-10/sq ft labor) varies widely based on tile size (large-format tiles are harder to lay flat) and pattern complexity. Our calculator separates labor and materials so you can price both accurately.' },
      { type: 'tool', heading: 'Flooring Installation Cost Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Room dimensions, flooring type (hardwood/tile/carpet/vinyl/laminate), underlayment, removal of old flooring, zip code</li>\n  <li><strong>Outputs:</strong> Material cost, labor cost, total installed cost per sq ft and total</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Labor Cost by Flooring Type', body: '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th>Flooring Type</th><th>Labor ($/sq ft)</th><th>Materials ($/sq ft)</th><th>Total Installed ($/sq ft)</th></tr><tr><td>Carpet</td><td>$1-3</td><td>$2-7</td><td>$3-10</td></tr><tr><td>Laminate</td><td>$2-4</td><td>$2-5</td><td>$4-9</td></tr><tr><td>Luxury Vinyl Plank</td><td>$2-5</td><td>$3-8</td><td>$5-13</td></tr><tr><td>Engineered Hardwood</td><td>$3-6</td><td>$5-12</td><td>$8-18</td></tr><tr><td>Solid Hardwood</td><td>$4-8</td><td>$6-15</td><td>$10-23</td></tr><tr><td>Ceramic/Porcelain Tile</td><td>$3-10</td><td>$3-10</td><td>$6-20</td></tr><tr><td>Natural Stone Tile</td><td>$8-15</td><td>$10-30</td><td>$18-45</td></tr></table>' },
      { heading: 'Hidden Costs Most Estimates Miss', body: '<ul><li><strong>Old flooring removal:</strong> $1-3/sq ft for carpet, $2-5 for tile (tile demolition is heavy, dusty work).</li><li><strong>Subfloor repair:</strong> $30-100 per damaged sheet of plywood/subfloor. Old homes with water damage may need extensive subfloor work.</li><li><strong>Underlayment:</strong> $0.50-3/sq ft depending on type (foam for laminate, cement board for tile, acoustic underlayment for condos).</li><li><strong>Baseboard removal and reinstallation:</strong> $1-3 per linear foot. New flooring is often thicker or thinner than old flooring, requiring baseboard adjustment.</li><li><strong>Door trimming:</strong> $10-25 per door. If the new floor is thicker than the old, doors may need to be trimmed to swing freely.</li><li><strong>Furniture moving:</strong> $100-400 for a whole house. Most flooring contractors don\'t move furniture—you handle it or pay extra.</li></ul>' }
    ],
    faqs: [
      { question: 'How much does flooring installation cost per square foot?', answer: '$3-23/sq ft total (labor + materials), depending on flooring type. Carpet is cheapest at $3-10/sq ft. Solid hardwood is most expensive at $10-23/sq ft. Most mid-range flooring (LVP, engineered wood, tile) falls in the $6-18/sq ft range installed.' },
      { question: 'Can I install flooring myself to save money?', answer: 'Laminate, LVP (click-lock), and carpet tile are DIY-friendly—most homeowners can do 200-400 sq ft in a weekend. Hardwood, tile, and sheet vinyl require skill and specialized tools. DIY savings: $2-8/sq ft in labor costs. But a bad DIY floor is visible forever.' },
      { question: 'Should I remove old flooring before installing new?', answer: 'Generally yes—installing new flooring over old creates height transitions at doorways and can trap moisture. Exceptions: some LVP can float over existing vinyl or tile if the surface is flat and stable. Never install new flooring over carpet or damaged/uneven surfaces.' },
      { question: 'How much extra flooring should I buy for waste?', answer: 'Add 10% for straight-lay patterns and 15-20% for diagonal or herringbone patterns. Rooms with many angles, closets, or obstructions need more waste allowance. Buying extra is cheaper than running short mid-installation and finding your batch is discontinued.' }
    ],
    affiliateCTA: aff('FloorWise Pick: Compare flooring installation quotes from local pros', 'https://www.homeadvisor.com/c.Flooring/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'flooring-square-footage-calculator',
    title: 'Flooring Square Footage Calculator: Measure Any Room Shape',
    metaDescription: 'Calculate flooring square footage for rooms of any shape. Handles L-shapes, closets, and irregular layouts. Free instant calculator.',
    h1: 'Flooring Square Footage Calculator: Don\'t Guess Your Floor Area',
    sections: [
      { heading: 'Why "Length × Width" Fails for Most Rooms', body: '<p class="data-note"><em>📊 Based on standard area calculation methodology. See our <a href="/methodology/">methodology page</a> for formulas.</em></p>A simple L×W works for a perfect rectangle. Real rooms have closets, alcoves, bay windows, and odd angles. Our calculator breaks complex rooms into rectangles and triangles, calculates each separately, adds them up, and applies the correct waste factor for your flooring type and pattern.' },
      { type: 'tool', heading: 'Flooring Square Footage Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Room shapes:</strong> Rectangle, L-shape, T-shape, add multiple sections</li>\n  <li><strong>Outputs:</strong> Net square footage, waste-adjusted total, boxes/ cartons needed</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Square Footage Formulas for Common Room Shapes', body: '<ul><li><strong>Rectangle:</strong> Length × Width</li><li><strong>L-shape:</strong> Divide into two rectangles, calculate each, add together</li><li><strong>Triangle (bay window):</strong> (Base × Height) ÷ 2</li><li><strong>Circle (round room):</strong> π × Radius² ÷ 144 (convert sq inches to sq ft)</li><li><strong>Trapezoid (angled wall):</strong> (Base1 + Base2) ÷ 2 × Height</li></ul><p>Measure in inches for precision, then divide by 144 to get square feet. Round up to the nearest whole square foot.</p>' }
    ],
    faqs: [
      { question: 'How do I measure square footage for flooring?', answer: 'Measure the longest length and widest width of each room section in inches. Multiply length × width, divide by 144 to get square feet. For irregular rooms, divide into rectangles and triangles, measure each separately, and add them together. Always measure twice—a 2-inch error in a 20-foot wall is a 3.3 sq ft error by the time you buy materials.' },
      { question: 'How much extra flooring do I need for waste?', answer: 'Add 10% for standard straight installation. Add 15-20% for diagonal patterns, herringbone, or rooms with many angles and obstructions. The waste factor accounts for cuts that can\'t be used, damaged pieces, and future repairs.' },
      { question: 'Should I measure in feet or inches for flooring?', answer: 'Measure in inches for accuracy, then convert to square feet (divide square inches by 144). A measurement of 12\'6" × 15\'4" is easier to calculate as 150" × 184" = 27,600 sq inches ÷ 144 = 191.7 sq ft.' }
    ],
    affiliateCTA: aff('FloorWise Pick: Find top-rated flooring installers in your area', 'https://www.thumbtack.com/k/flooring-installation/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'flooring-budget-calculator',
    title: 'Flooring Budget Calculator: Plan Your Entire Flooring Project',
    metaDescription: 'Budget your flooring project from start to finish. Includes materials, labor, underlayment, removal, trim, and contingency. Free calculator.',
    h1: 'Flooring Budget Calculator: The All-In Cost, Not Just Materials',
    sections: [
      { heading: 'Why Most Flooring Budgets Go 30% Over', body: '<p class="data-note"><em>📊 Based on common residential flooring project costs. See our <a href="/methodology/">methodology page</a> for data sources.</em></p>The sticker price of flooring ($3-8/sq ft for materials) represents only 40-50% of the total project cost. Labor, underlayment, trim, removal, and unexpected subfloor repairs eat the rest. Our budget calculator includes every line item so you\'re not surprised when the contractor hands you the final invoice.' },
      { type: 'tool', heading: 'Flooring Budget Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Room dimensions, flooring type, underlayment, trim type, removal needed, zip code</li>\n  <li><strong>Outputs:</strong> Itemized budget: materials, labor, underlayment, floor prep, trim, removal, delivery, contingency</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Sample Budget: 500 sq ft Living Room with Hardwood', body: '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th>Line Item</th><th>Estimated Cost</th></tr><tr><td>Hardwood flooring (500 sq ft × $8)</td><td>$4,000</td></tr><tr><td>Underlayment</td><td>$400</td></tr><tr><td>Labor (500 sq ft × $5)</td><td>$2,500</td></tr><tr><td>Baseboard removal & reinstall</td><td>$300</td></tr><tr><td>Old carpet removal & disposal</td><td>$400</td></tr><tr><td>Delivery fee</td><td>$100</td></tr><tr><td>15% contingency</td><td>$1,155</td></tr><tr style="font-weight:700"><td>TOTAL</td><td>$8,855 ($17.71/sq ft)</td></tr></table>' }
    ],
    faqs: [
      { question: 'How much should I budget for flooring installation?', answer: 'Budget $8-20/sq ft all-in (materials + labor + extras) for mid-range flooring. The material cost is only 40-60% of the total. Add a 15% contingency for unexpected subfloor issues, especially in homes older than 20 years.' },
      { question: 'What is the cheapest flooring to install?', answer: 'Sheet vinyl ($2-4/sq ft total installed) and carpet ($3-6/sq ft) are the cheapest installed options. Luxury vinyl plank ($5-9/sq ft) offers the best balance of affordability, durability, and appearance for most homes.' }
    ],
    affiliateCTA: aff('FloorWise Pick: Get free flooring estimates from 3 local pros', 'https://www.homeadvisor.com/c.Flooring/'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// site-009: renovation (BuildCost / renowise.8zla.com)
// ═══════════════════════════════════════════
function renoPages() { return [
  {
    slug: 'diy-vs-contractor-renovation-cost-comparison',
    title: 'DIY vs Contractor Renovation Cost: 2026 Comparison Calculator',
    metaDescription: 'Compare DIY costs vs hiring a contractor for your renovation. See labor costs, tool rental, permit requirements, and the real savings of doing it yourself.',
    h1: 'DIY vs Contractor Renovation: Calculate the Real Cost Difference',
    sections: [
      { heading: 'The DIY Savings Most People Get Wrong', body: '<p class="data-note"><em>📊 Based on national average contractor pricing and tool/material costs. See our <a href="/methodology/">methodology page</a> for sources.</em></p>DIY renovation saves 30-60% on labor—but that\'s only half the story. DIY takes 2-4× longer, requires tool purchases or rentals, and risks costly mistakes that a pro wouldn\'t make. A $5,000 contractor bathroom tile job might cost $1,500 in materials DIY—but a botched waterproofing job that leads to a $3,000 subfloor replacement erases every dollar saved. Our calculator shows you the true total cost of both paths, including tools, permits, and your time.' },
      { type: 'tool', heading: 'DIY vs Contractor Cost Comparison', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Project type (kitchen/bath/basement/etc), project size, material grade, your skill level, zip code</li>\n  <li><strong>Outputs:</strong> Contractor estimate, DIY estimate (materials + tools + permits), savings, risk-adjusted comparison</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'When DIY Wins — And When It Doesn\'t', body: '<p><strong>Good DIY projects:</strong> Painting ($2-4/sq ft savings), flooring (laminate/LVP: $2-5/sq ft savings), trim/baseboard ($3-7/linear ft savings), demolition ($500-2,000 savings for a whole room). <strong>Bad DIY projects:</strong> Electrical work beyond replacing fixtures (fire risk + code violations), plumbing beyond replacing fixtures (flood risk), structural changes (load-bearing wall removal), and anything requiring a permit you don\'t know how to pull. <strong>The rule:</strong> If a mistake would cost more to fix than hiring a pro would have cost originally, hire the pro.</p>' }
    ],
    faqs: [
      { question: 'How much can I save doing renovation work myself?', answer: 'Typically 30-60% of the total project cost. Labor is 40-70% of most renovation budgets. But factor in: tool purchases/rentals ($100-1,000+), your time (valued at your hourly rate), and the risk of mistakes requiring professional correction.' },
      { question: 'What renovation work requires a permit?', answer: 'Structural changes (walls, beams, foundations), electrical (beyond fixture replacement), plumbing (beyond fixture replacement), HVAC modifications, window/door replacements that change the opening size, and additions. Permit requirements vary by municipality—always check with your local building department.' },
      { question: 'Should I hire a general contractor or individual trades?', answer: 'General contractor (GC) adds 15-25% to the total but handles scheduling, permits, and coordination. For projects involving 3+ trades (kitchen, major bath, addition), a GC is worth it. For single-trade projects (flooring only, painting only), hire the trade directly.' }
    ],
    affiliateCTA: aff('BuildCost Pick: Get free renovation quotes from licensed contractors', 'https://www.homeadvisor.com/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'basement-finishing-cost-estimator-2024',
    title: 'Basement Finishing Cost Estimator 2026: Per Square Foot Pricing',
    metaDescription: 'Estimate your basement finishing costs with our free calculator. Covers framing, drywall, flooring, electrical, plumbing, and egress requirements.',
    h1: 'Basement Finishing Cost Estimator 2026: Real Numbers Per Square Foot',
    sections: [
      { heading: 'What Finishing a Basement Costs in 2026', body: '<p class="data-note"><em>📊 Data sourced from publicly available contractor pricing databases. See our <a href="/methodology/">methodology page</a> for sources and regional adjustments.</em></p>A basic basement finish (drywall, flooring, ceiling, electrical) costs $40-70/sq ft. A mid-range finish with a bathroom adds $15-25/sq ft. A high-end finish with a wet bar, home theater, or gym can push $100-150/sq ft. The national average for a 1,000 sq ft basement is $50,000-75,000 for a complete finish with bathroom.' },
      { type: 'tool', heading: 'Basement Finishing Cost Estimator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Basement square footage, ceiling height, finish level (basic/mid/high), bathroom included?, egress window needed?, zip code</li>\n  <li><strong>Outputs:</strong> Total estimated cost, cost per sq ft, major line-item breakdown</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Egress Requirements: The Hidden $3,000-8,000 Cost', body: '<p>Building code requires every habitable basement room (bedroom, home office used daily) to have an egress window or door directly to the outside. A code-compliant egress window with a window well, ladder, and drainage costs $3,000-8,000 installed. Without it, you cannot legally call that basement room a bedroom when you sell. Many homeowners skip egress to save money, then find it flagged during a home inspection. If you\'re finishing a basement, install egress during construction—retrofitting later costs 2× as much.</p>' }
    ],
    faqs: [
      { question: 'How much does it cost to finish a 1,000 sq ft basement?', answer: '$40,000-75,000 for a complete finish with a bathroom, depending on your region and finish level. Basic finish (drywall + flooring + electrical): $30,000-50,000. High-end with wet bar and home theater: $80,000-150,000.' },
      { question: 'Does finishing a basement add home value?', answer: 'Yes—finished basements typically recoup 50-70% of their cost at resale, according to Remodeling Magazine\'s Cost vs Value report. In high-cost housing markets where above-ground space is limited, basement finishes can recoup 70-80%. The value is highest when the basement adds functional bedrooms and bathrooms, not just open rec space.' },
      { question: 'Do I need a permit to finish my basement?', answer: 'Almost always yes. Finishing a basement involves electrical, possibly plumbing, and changes the home\'s occupancy classification. Unpermitted basement work is flagged during home sales and can void homeowners insurance for claims related to the unpermitted space.' }
    ],
    affiliateCTA: aff('BuildCost Pick: Find basement finishing contractors with verified reviews', 'https://www.thumbtack.com/k/basement-finishing/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'renovation-roi-calculator',
    title: 'Renovation ROI Calculator: Which Upgrades Actually Pay Back',
    metaDescription: 'Calculate the return on investment for your renovation project. See which upgrades add the most resale value and which are just for you.',
    h1: 'Renovation ROI Calculator: Don\'t Spend $50K for a $25K Return',
    sections: [
      { heading: 'The Renovation ROI Reality', body: '<p class="data-note"><em>📊 Based on Remodeling Magazine Cost vs Value report and real estate market data. See our <a href="/methodology/">methodology page</a> for sources.</em></p>Very few renovations recoup 100% of their cost at resale. The highest-ROI projects in 2026: garage door replacement (95-102%), manufactured stone veneer (90-95%), minor kitchen remodel (85-90%), and HVAC replacement (85-90%). The lowest ROI: upscale master suite addition (40-50%), upscale bathroom addition (45-55%), and backyard patio (45-55%). Our calculator helps you separate "worth it for resale" from "worth it for you."</p>' },
      { type: 'tool', heading: 'Renovation ROI Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Project type, project cost, home value, planned years before selling</li>\n  <li><strong>Outputs:</strong> Estimated resale value added, ROI percentage, break-even timeline</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'ROI Rankings: Highest to Lowest', body: '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th>Project</th><th>Average Cost</th><th>Resale Value</th><th>ROI</th></tr><tr><td>Garage door replacement</td><td>$4,500</td><td>$4,300</td><td>95%</td></tr><tr><td>Minor kitchen remodel</td><td>$27,500</td><td>$23,500</td><td>85%</td></tr><tr><td>Wood deck addition</td><td>$18,000</td><td>$14,500</td><td>80%</td></tr><tr><td>Midrange bathroom remodel</td><td>$25,000</td><td>$18,000</td><td>72%</td></tr><tr><td>Major kitchen remodel</td><td>$80,000</td><td>$45,000</td><td>56%</td></tr><tr><td>Upscale master suite addition</td><td>$340,000</td><td>$155,000</td><td>45%</td></tr></table>' }
    ],
    faqs: [
      { question: 'Which home renovations have the best ROI?', answer: 'Garage door replacement (~95% ROI), manufactured stone veneer (90-95%), minor kitchen remodel (85-90%), HVAC replacement (85-90%), and entry door replacement (80-85%) consistently top the ROI rankings. These projects are relatively inexpensive and dramatically improve curb appeal or functionality.' },
      { question: 'Do any renovations add more value than they cost?', answer: 'Rarely. In most markets, even the best renovations return 80-95% of their cost. The exception: cosmetic updates (paint, landscaping, deep cleaning) in a dated home can return 200-500% because they cost little but dramatically change buyer perception. A $500 paint job can add $5,000 in perceived value.' },
      { question: 'Should I renovate before selling?', answer: 'Only if your home has specific deal-breaker issues (leaky roof, broken HVAC, severely dated kitchen in a high-end neighborhood). Most pre-sale renovations return 60-80% of their cost. You\'re usually better off pricing the home to reflect its current condition and letting the buyer renovate to their own taste.' }
    ],
    affiliateCTA: aff('BuildCost Pick: Compare renovation loan options for your project', 'https://www.nerdwallet.com/mortgages/renovation-loans'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// site-016: electrical (AmpFlow / voltwise.8zla.com)
// ═══════════════════════════════════════════
function electricalPages() { return [
  {
    slug: 'service-load-calculation-example-nec-2023',
    title: 'Service Load Calculation Example NEC 2023: Step-by-Step Guide',
    metaDescription: 'Complete residential service load calculation example following NEC 2023 Article 220. Includes all steps, formulas, and a free calculator.',
    h1: 'Service Load Calculation Example NEC 2023: A Complete Walkthrough',
    sections: [
      { heading: 'NEC Service Load Calculation — Why It Matters', body: '<p class="data-note"><em>📊 Based on NEC 2023 Article 220 and industry practice. See our <a href="/methodology/">methodology page</a> for detailed references.</em></p>A residential service load calculation determines the minimum electrical service size for a dwelling. Undersized service means breakers tripping and potential fire risk. Oversized service means wasted money on heavier-gauge wire, larger conduit, and a bigger panel than needed. The NEC standard method (Article 220 Part III) is what building departments require on permit applications. Our calculator runs the full NEC method so you can submit your permit with confidence.' },
      { type: 'tool', heading: 'NEC Service Load Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Inputs:</strong> Square footage, small appliance circuits, laundry circuit, major appliances (nameplate ratings), HVAC (MCA), electric vehicle charger, solar/PV system</li>\n  <li><strong>Outputs:</strong> Total calculated load (VA and Amps), minimum service size (100A/125A/150A/200A/400A)</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'NEC Standard Method: Step by Step', body: '<ol><li><strong>General lighting & receptacles:</strong> 3 VA per sq ft × total sq ft. First 3,000 VA at 100%, remainder at 35%. Example: 2,500 sq ft × 3 = 7,500 VA. 3,000 + (4,500 × 0.35) = 4,575 VA.</li><li><strong>Small appliance & laundry:</strong> 2 × 1,500 VA for kitchen small appliance circuits + 1 × 1,500 VA for laundry = 4,500 VA.</li><li><strong>Major appliances:</strong> Add nameplate ratings for: range/oven, cooktop, dishwasher, garbage disposal, water heater, dryer, microwave (if built-in). Use actual nameplate values.</li><li><strong>HVAC:</strong> Use the larger of heating or cooling load (not both—they don\'t run simultaneously). Use MCA (Minimum Circuit Ampacity) from the equipment nameplate.</li><li><strong>EV charger:</strong> Add at 100% of nameplate rating (NEC 220.57 for EVSE). A typical Level 2 charger is 7,200-11,500 VA (30-48A at 240V).</li><li><strong>Total VA ÷ 240V = Amps:</strong> Round up to the next standard service size: 100A, 125A, 150A, 200A, 400A.</li></ol>' },
      { heading: 'Example: 2,500 sq ft Home with EV Charger', body: '<p>General lighting: 2,500 × 3 = 7,500 VA → 3,000 + (4,500 × 0.35) = 4,575 VA. Small appliance + laundry: 4,500 VA. Range: 8,000 VA. Dryer: 5,000 VA. Water heater: 4,500 VA. Dishwasher: 1,200 VA. Disposal: 800 VA. HVAC: 6,000 VA (cooling, larger than heating at 4,500 VA). EV charger: 11,500 VA (48A Level 2). Total: 46,075 VA ÷ 240V = 192 Amps → requires 200A service minimum. Without the EV charger: 34,575 VA ÷ 240V = 144 Amps → 150A service. The EV charger alone adds 48 Amps of demand and often pushes homes from 150A to 200A service.</p>' }
    ],
    faqs: [
      { question: 'How do I calculate service load per NEC 2023?', answer: 'Use NEC Article 220 Part III (Standard Method): sum general lighting (3 VA/sq ft), small appliance circuits (4,500 VA), major appliances (nameplate), HVAC (larger of heat or cool, MCA value), and EV charger (nameplate at 100%). Divide total VA by 240V for service amperage. Round up to the next standard size.' },
      { question: 'What size electrical service do I need for a 2,500 sq ft house?', answer: 'Typically 150A-200A. Without EV charging: 125-150A. With one EV charger: 200A. With two EV chargers: 300-400A. Run the calculation with actual appliance nameplates—don\'t guess.' },
      { question: 'Can I use the optional method instead of the standard method?', answer: 'Yes—NEC 220.82 (Optional Method) is simpler and often yields a lower calculated load for homes over 1,500 sq ft. It applies a single demand factor to the total connected load rather than separate demand factors per category. The optional method is accepted by most building departments. Our calculator supports both methods.' }
    ],
    affiliateCTA: aff('AmpFlow Pick: NEC 2023 Code Book — essential reference', 'https://www.nfpa.org/codes-and-standards/70'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'dwelling-unit-load-calculation-online',
    title: 'Dwelling Unit Load Calculation Online: Free NEC-Compliant Tool',
    metaDescription: 'Free online dwelling unit load calculator per NEC 2023. Standard and optional methods. Instant results. No email or signup required.',
    h1: 'Dwelling Unit Load Calculation Online: NEC 2023 Compliant',
    sections: [
      { heading: 'Dwelling Unit Load Calculation — The Permit Requirement', body: '<p class="data-note"><em>📊 Based on NEC 2023 Articles 220.82 and 220.83. See our <a href="/methodology/">methodology page</a> for detailed references.</em></p>A dwelling unit load calculation is required whenever you: install a new electrical panel, add a major appliance (EV charger, hot tub, AC), add an addition, or upgrade from fuse box to breakers. Building departments reject permit applications without a load calculation. Our online tool generates a PDF-ready calculation you can attach to your permit application.' },
      { type: 'tool', heading: 'Dwelling Unit Load Calculator', body: '<html>\n<body>\n<ul>\n  <li><strong>Methods:</strong> NEC Standard (220 Part III) and Optional (220.82)</li>\n  <li><strong>Outputs:</strong> Total load in VA and Amps, recommended service size, printable calculation sheet</li>\n</ul>\n</body>\n</html>', toolEmbed: true },
      { heading: 'Standard vs Optional Method: Which to Use', body: '<p>The Optional Method (NEC 220.82) is simpler and accepted by most AHJs (Authorities Having Jurisdiction) for single-family dwellings. It applies a flat demand factor to the total connected load above 10 kVA rather than per-category demand factors. For homes below 1,500 sq ft, the standard method may yield a lower calculated load. For homes above 1,500 sq ft, the optional method usually gives a lower (more favorable) number. Our calculator runs both and lets you choose—some inspectors prefer one method over the other.</p>' }
    ],
    faqs: [
      { question: 'What is a dwelling unit load calculation?', answer: 'A calculation per NEC Article 220 that determines the minimum electrical service size for a residential dwelling. It accounts for square footage, required circuits, major appliances, and HVAC equipment. The result is expressed in Volt-Amperes (VA) and Amperes (A), which determines your panel size (100A, 150A, 200A, etc.).' },
      { question: 'Can I do my own load calculation for a permit?', answer: 'Most building departments accept homeowner-prepared load calculations if they follow NEC methodology and show all inputs and calculations clearly. Our tool generates a calculation sheet formatted for permit submission. Some jurisdictions require a licensed electrician\'s stamp for service upgrades—check with your local building department.' },
      { question: 'What happens if my calculated load exceeds my panel rating?', answer: 'You need a service upgrade (new, larger panel). A 100A panel with a 125A calculated load is overloaded and creates a fire risk. Options: upgrade to 150A or 200A service ($2,000-5,000), or reduce your electrical load (remove or downsize appliances). The panel rating must equal or exceed the calculated load per NEC.' }
    ],
    affiliateCTA: aff('AmpFlow Pick: Find a licensed electrician for your panel upgrade', 'https://www.homeadvisor.com/c.Electrical/'),
    lastUpdated: '2026-06-22', author: A
  },
  {
    slug: 'mobile-friendly-electrical-load-calculator',
    title: 'Mobile-Friendly Electrical Load Calculator: Calculate on Your Phone',
    metaDescription: 'Use our mobile-optimized electrical load calculator on any device. Perfect for electricians in the field. Free, NEC 2023 compliant, no app install.',
    h1: 'Mobile-Friendly Electrical Load Calculator: Panel Sizing on Your Phone',
    sections: [
      { heading: 'Load Calculations Where You Actually Need Them', body: '<p class="data-note"><em>📊 NEC 2023 compliant calculations optimized for mobile devices. See our <a href="/methodology/">methodology page</a> for methodology.</em></p>Electricians do load calculations standing in front of the existing panel, not sitting at a desk. Our calculator is built for one-handed phone use: large touch targets (48px minimum), number-pad input for numeric fields, scrollable appliance list, and instant recalculation as you enter data. No app install, no account, no email. Works offline once loaded.' },
      { heading: 'Mobile-Optimized Features', body: '<ul><li><strong>Touch-friendly inputs:</strong> Every input is at least 48px tall—meets WCAG touch target guidelines for gloved hands and shaky ladders</li><li><strong>Number-pad keyboard:</strong> Numeric fields trigger the phone\'s number pad (inputmode="decimal"), not the full keyboard</li><li><strong>Auto-save locally:</strong> Your inputs persist in browser storage. Close the page, come back, pick up where you left off.</li><li><strong>Works offline:</strong> Load once with an internet connection, continue using without one. The calculator runs entirely in the browser.</li><li><strong>One-thumb navigation:</strong> Inputs are stacked vertically—no side-scrolling or pinch-zooming needed.</li></ul>' },
      { heading: 'For Electricians: Faster Than a Spreadsheet', body: '<p>Most electricians use an Excel spreadsheet or a dedicated app for load calculations. Spreadsheets are hard to use on a phone. Dedicated apps cost $10-50. Our mobile calculator is free, runs in any browser, and uses the same NEC methodology. Bookmark it on your phone\'s home screen—it works like a native app (PWA). Generate a calculation, screenshot it, and attach it to your permit application.</p>' }
    ],
    faqs: [
      { question: 'Does the mobile load calculator work without internet?', answer: 'Yes—once the page loads initially, the calculator runs entirely in your browser\'s JavaScript engine. No server requests are made during calculation. Your inputs are saved to localStorage and persist across sessions.' },
      { question: 'Is the mobile calculator as accurate as NEC software?', answer: 'For residential calculations using the standard or optional method, yes—the formulas are the same. For complex commercial or industrial calculations with demand factors not covered by NEC 220 Part III, use professional engineering software.' }
    ],
    affiliateCTA: aff('AmpFlow Pick: Fluke multifunction tester — essential for panel work', 'https://www.fluke.com/en-us/products/electrical-testing'),
    lastUpdated: '2026-06-22', author: A
  }
];}

// ═══════════════════════════════════════════
// Main
// ═══════════════════════════════════════════
function main() {
  const sites = [
    { dir: 'site-002-mortgage-calc', brand: 'EquityFlow', pages: mortgagePages() },
    { dir: 'site-006-concrete-calc',  brand: 'MixWise',    pages: concretePages() },
    { dir: 'site-007-flooring-calc',  brand: 'FloorWise',  pages: flooringPages() },
    { dir: 'site-009-reno-calc',      brand: 'BuildCost',  pages: renoPages() },
    { dir: 'site-016-electrical',     brand: 'AmpFlow',    pages: electricalPages() },
  ];

  let totalAdded = 0;

  for (const site of sites) {
    const filepath = join(DATA, site.dir, 'pages.json');
    const existing = readJSON(filepath);
    const backupPath = filepath.replace('.json', '.backup.json');
    writeFileSync(backupPath, JSON.stringify(existing, null, 2));

    const updated = [...existing, ...site.pages];
    writeJSON(filepath, updated);
    const added = site.pages.length;
    totalAdded += added;
    console.log(`${site.brand}: ${existing.length} → ${updated.length} (+${added})`);
    site.pages.forEach(p => console.log(`  + ${p.slug}`));
  }

  console.log(`\nTotal: +${totalAdded} pages across 5 sites`);
  console.log('Backups saved as pages.backup.json in each site dir');
}

main();
