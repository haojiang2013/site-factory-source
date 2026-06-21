import { headers } from 'next/headers';
import type { Metadata } from 'next';
import c1 from '@/data/site-001-moving-calculator/config.json'; import c2 from '@/data/site-002-mortgage-calc/config.json'; import c3 from '@/data/site-003-paint-calc/config.json';
import c4 from '@/data/site-004-ai-tools/config.json'; import c5 from '@/data/site-005-game-guide/config.json';
import c6 from '@/data/site-006-concrete-calc/config.json'; import c7 from '@/data/site-007-flooring-calc/config.json';
import c8 from '@/data/site-008-ai-coding/config.json'; import c9 from '@/data/site-009-reno-calc/config.json';
import c10 from '@/data/site-010-boss-guide/config.json'; import c11 from '@/data/site-011-ai-design/config.json';
import c12 from '@/data/site-012-ai-marketing/config.json'; import c13 from '@/data/site-013-ai-video/config.json';
import c14 from '@/data/site-014-game-items/config.json'; import c15 from '@/data/site-015-game-builds/config.json';
import c16 from '@/data/site-016-electrical/config.json'; import c17 from '@/data/site-017-garden/config.json';
import c18 from '@/data/site-018-cleaning/config.json'; import c19 from '@/data/site-019-solar/config.json';
import c20 from '@/data/site-020-hvac/config.json'; import c21 from '@/data/site-021-ai-productivity/config.json';
import c22 from '@/data/site-022-ai-audio/config.json'; import c23 from '@/data/site-023-ai-data/config.json';
import c24 from '@/data/site-024-game-weapons/config.json'; import c25 from '@/data/site-025-game-npcs/config.json';

const ALL_SITES = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19,c20,c21,c22,c23,c24,c25];

interface MethodInfo { formula: string; sources: string; limitations: string; }

function getMethod(cfg: any): MethodInfo {
  const domain = cfg.domain;
  const template = cfg.template;

  // Template A: Calculator sites — full formula transparency
  if (template === 'A') {
    if (domain.includes('gomovecalc')) return {
      formula: 'Base cost = (distance × rate per mile) + (home size × weight factor) + packing service fee + piano surcharge + storage fee. Rates sourced from American Moving & Storage Association industry benchmarks.',
      sources: 'American Moving & Storage Association (AMSA) industry reports; moveBuddha user-reported cost data; US Census Bureau interstate commerce statistics.',
      limitations: 'Does not account for seasonal price surges (summer months typically 20-30% higher), elevator fees, long-carry charges, or last-minute booking premiums. For exact quotes, contact licensed moving companies directly.',
    };
    if (domain.includes('payitoff')) return {
      formula: 'Monthly savings = (extra payment × (1 + rate/12)^remaining_months - extra payment). Uses standard amortization: M = P × [r(1+r)^n]/[(1+r)^n-1] where r = annual rate / 12, n = months remaining.',
      sources: 'Federal Reserve statistical releases (current mortgage rates); Fannie Mae amortization standards; Consumer Financial Protection Bureau prepayment guidelines.',
      limitations: 'Assumes fixed-rate mortgage with no prepayment penalty. Does not reflect ARM adjustments, escrow changes, or tax implications. For financial advice, consult a licensed professional.',
    };
    if (domain.includes('paintwise')) return {
      formula: 'Paint gallons = (total wall area in sq ft - window/door area) ÷ coverage per gallon. One gallon typically covers 350-400 sq ft. Two coats recommended for most surfaces.',
      sources: "Paint manufacturers' published coverage data (Sherwin-Williams, Benjamin Moore); ASTM paint application standards.",
      limitations: 'Coverage varies by surface texture, paint type, and application method. Rough or porous surfaces may require 20-30% more paint. Primer coats calculated separately.',
    };
    if (domain.includes('pourtrue')) return {
      formula: 'Concrete volume = length × width × thickness (convert to yards³ or m³). Bag count = total cubic feet ÷ yield per bag (typically 0.45-0.6 ft³ per 80lb bag). Cost = volume × unit price + delivery + short-load fee.',
      sources: 'National Ready Mixed Concrete Association (NRMCA) pricing surveys; American Concrete Institute (ACI) standard mix ratios.',
      limitations: 'Assumes standard 4-inch slab thickness (adjustable). Delivery fees vary significantly by distance from batch plant. Short-load fees apply to orders under 5 yards³. Reinforcement and labor not included.',
    };
    if (domain.includes('floorfound')) return {
      formula: 'Total cost = (area in sq ft × material cost per sq ft) + (area × installation cost per sq ft) + waste factor (typically 7-10%). Underlayment and subfloor preparation calculated separately.',
      sources: "National Floor Covering Association (NFCA) pricing data; Home Depot and Lowe's listed material prices.",
      limitations: 'Labor rates vary by region. Material prices fluctuate with supply chain. Pattern layouts (herringbone, diagonal) increase waste to 15-20%. Does not include furniture removal or old flooring disposal.',
    };
    if (domain.includes('renowise')) return {
      formula: 'Estimate = (room area × cost per sq ft for that room type) + material grade multiplier. Kitchen and bathroom remodels use higher per-sq-ft rates than bedrooms or living areas.',
      sources: 'HomeAdvisor and Angi verified contractor pricing data; Remodeling Magazine Cost vs. Value annual report.',
      limitations: 'National averages — actual costs vary by ZIP code, contractor availability, and material grade. Structural repairs, permit fees, and unforeseen issues not included. Always get 3+ contractor quotes.',
    };
    if (domain.includes('buildcraft')) return {
      formula: 'Total DPS = (base weapon damage × attack speed × (1 + crit chance × crit multiplier)) × (1 - boss damage reduction). Time to kill = boss HP ÷ effective DPS.',
      sources: 'Community-tested game mechanics from official wikis and player data analysis; patch notes for balance changes.',
      limitations: 'Assumes optimal conditions — actual performance varies with player skill, latency, and specific encounter mechanics. Build synergies and party buffs not included. Updated when game patches change stats.',
    };
    if (domain.includes('voltwise')) return {
      formula: 'Total load (watts) = sum of all appliance wattages × demand factor. Required amperage = total watts ÷ voltage (typically 120V or 240V). Panel capacity should be at least 25% above calculated load per NEC guidelines.',
      sources: 'National Electrical Code (NEC) Article 220 load calculation standards; Department of Energy appliance energy usage data.',
      limitations: 'For estimation only. NEC requires licensed electrician calculations for permits. Motor startup surges, continuous load multipliers, and local code amendments may apply. Always consult a licensed electrician.',
    };
    if (domain.includes('soilwise')) return {
      formula: 'Soil volume (cubic yards) = (garden area in sq ft × desired depth in inches) ÷ 324. One cubic yard covers approximately 100 sq ft at 3 inches deep.',
      sources: 'USDA soil composition guidelines; university extension service planting depth recommendations.',
      limitations: 'Does not account for soil compaction (add 10-15% for settling). Soil type (topsoil, compost, garden mix) affects volume requirements. Delivery minimums may apply.',
    };
    if (domain.includes('cleancalc')) return {
      formula: 'Estimated cost = (home size in sq ft × rate per sq ft) + (number of bedrooms × surcharge) + (number of bathrooms × surcharge) + extra service fees (deep clean, windows, etc.).',
      sources: 'HomeAdvisor and Thumbtack verified cleaning service pricing; Bureau of Labor Statistics janitorial services wage data.',
      limitations: 'Rates vary by metro area (urban typically 30-50% higher). Frequency discounts for recurring service not included. Move-out cleans typically cost more than maintenance cleans.',
    };
    if (domain.includes('solarwise')) return {
      formula: 'Annual savings = (system size in kW × average daily sun hours × 365 × electricity rate) × panel efficiency factor. Payback period = total system cost ÷ annual savings. Federal tax credit (30%) applied to system cost.',
      sources: 'NREL (National Renewable Energy Laboratory) solar irradiance maps; EIA (Energy Information Administration) state electricity rates; DSIRE database for state/local incentives.',
      limitations: 'Assumes south-facing roof with standard tilt. Shading, roof age, and local permitting not factored. Electricity rates and net metering policies may change. Get multiple installer quotes for firm pricing.',
    };
    if (domain.includes('hvacwise')) return {
      formula: 'Required BTU = (home sq ft × climate zone factor × ceiling height factor × insulation factor) + (number of occupants × 600 BTU) + (kitchen × 1,200 BTU). Tonnage = BTU ÷ 12,000. Per ACCA Manual J simplified method.',
      sources: 'ACCA (Air Conditioning Contractors of America) Manual J load calculation standards; ENERGY STAR HVAC sizing guidelines.',
      limitations: 'Simplified model — accurate Manual J requires 30+ inputs including window orientation, insulation R-values, and duct leakage. Oversized units reduce efficiency and comfort. Always consult a licensed HVAC contractor.',
    };
    return { formula: 'Uses standard industry formulas with data from publicly available sources.', sources: 'Public industry data and published standards.', limitations: 'Results are estimates. Always get professional quotes for major decisions.' };
  }

  // Template B: Data comparison sites
  if (template === 'B') return {
    formula: 'Tools are ranked by a weighted score: User Rating (40%) + Feature Completeness (30%) + Pricing Value (20%) + Community Sentiment (10%). Each tool is re-evaluated quarterly against the latest version. Pricing reflects public tiers as of the last review date.',
    sources: 'Official product documentation and pricing pages; user reviews from G2, Capterra, and Reddit; community forums and developer discussions; GitHub activity and release notes for open-source tools.',
    limitations: 'Tool rankings are a snapshot in time. Features and pricing change frequently — check the official site for current details. User ratings are aggregated from multiple sources and may not reflect your specific use case. Free trials and enterprise tiers may not be reflected in listed pricing.',
  };

  // Template C: Game guide sites
  if (template === 'C') return {
    formula: 'Boss difficulty is calculated from: base HP × damage multiplier + mechanic count × difficulty factor + phase count × endurance factor. Loot drop rates are sourced from community data-mining and player-reported aggregation. Build effectiveness combines DPS potential, survivability, and synergy scoring.',
    sources: 'Community-maintained wikis and databases; official game patch notes and API data; player-reported statistics and community testing; data-mining from game files where publicly available.',
    limitations: 'Game data changes with every patch — we update within 48 hours of major patches. Drop rates are based on community-reported data (typically 10,000+ sample size) and may vary. Build effectiveness depends on player skill, latency, and specific encounter mechanics.',
  };

  return { formula: 'Uses standard methods with data from publicly available sources.', sources: 'Public data and published standards.', limitations: 'Results are estimates. Always verify with primary sources before making decisions.' };
}

export async function generateMetadata(): Promise<Metadata> {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = ALL_SITES.find(c => c.domain === host);
  if (!cfg) return { title: 'Methodology' };
  const heading = cfg.template === 'A' ? 'How We Calculate' : cfg.template === 'B' ? 'How We Compare' : 'How We Source Data';
  return { title: `${heading} — ${cfg.designConfig.brandName}` };
}

export default async function MethodologyPage() {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = ALL_SITES.find(c => c.domain === host) || ALL_SITES[0];
  const m = getMethod(cfg);
  const brand = cfg.designConfig.brandName;
  const template = cfg.template;

  const heading = template === 'A' ? `How ${brand} Calculates Results` : template === 'B' ? `How ${brand} Compares Tools` : `How ${brand} Sources Data`;
  const subtitle = template === 'A' ? 'Transparency about our formulas, data sources, and limitations.' : template === 'B' ? 'Transparency about our ranking methodology, data sources, and review process.' : 'Transparency about our game data sources, update process, and methodology.';

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', lineHeight: 1.8, color: '#334155' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{heading}</h1>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>{subtitle}</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
          {template === 'A' ? '📐 Formula' : template === 'B' ? '📊 Ranking Method' : '🎮 Data Collection'}
        </h2>
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px', border: '1px solid #e2e8f0', fontSize: 14 }}>
          {m.formula}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>📊 Data Sources</h2>
        <p>{m.sources}</p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>⚠️ Limitations</h2>
        <p>{m.limitations}</p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>🕐 Last Reviewed</h2>
        <p>June 2026. Methodology is reviewed quarterly and updated when underlying data sources or industry standards change.</p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>🚫 Disclaimer</h2>
        <p style={{ color: '#64748b', fontSize: 13 }}>{template === 'C' ? 'Game data is sourced from publicly available community resources and may not reflect the latest patch. Always verify in-game before making build or strategy decisions.' : 'This tool provides estimates for informational purposes only. Results are not financial, legal, or professional advice. Always consult qualified professionals and obtain multiple quotes before making decisions based on these estimates.'}</p>
      </section>
    </div>
  );
}
