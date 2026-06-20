import { headers } from 'next/headers';
import type { Metadata } from 'next';
import c1 from '@/data/site-001-moving-calculator/config.json'; import c2 from '@/data/site-002-mortgage-calc/config.json'; import c3 from '@/data/site-003-paint-calc/config.json';
import c6 from '@/data/site-006-concrete-calc/config.json'; import c7 from '@/data/site-007-flooring-calc/config.json'; import c9 from '@/data/site-009-reno-calc/config.json';
import c15 from '@/data/site-015-game-builds/config.json'; import c16 from '@/data/site-016-electrical/config.json'; import c17 from '@/data/site-017-garden/config.json';
import c18 from '@/data/site-018-cleaning/config.json'; import c19 from '@/data/site-019-solar/config.json'; import c20 from '@/data/site-020-hvac/config.json';

const CALC_SITES = [c1,c2,c3,c6,c7,c9,c15,c16,c17,c18,c19,c20];

interface MethodInfo { formula: string; sources: string; limitations: string; }

function getMethod(cfg: any): MethodInfo {
  const domain = cfg.domain;
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
    sources: 'Paint manufacturers\' published coverage data (Sherwin-Williams, Benjamin Moore); ASTM paint application standards.',
    limitations: 'Coverage varies by surface texture, paint type, and application method. Rough or porous surfaces may require 20-30% more paint. Primer coats calculated separately.',
  };
  if (domain.includes('pourtrue')) return {
    formula: 'Concrete volume = length × width × thickness (convert to yards³ or m³). Bag count = total cubic feet ÷ yield per bag (typically 0.45-0.6 ft³ per 80lb bag). Cost = volume × unit price + delivery + short-load fee.',
    sources: 'National Ready Mixed Concrete Association (NRMCA) pricing surveys; American Concrete Institute (ACI) standard mix ratios.',
    limitations: 'Assumes standard 4-inch slab thickness (adjustable). Delivery fees vary significantly by distance from batch plant. Short-load fees apply to orders under 5 yards³. Reinforcement and labor not included.',
  };
  if (domain.includes('floorfound')) return {
    formula: 'Total cost = (area in sq ft × material cost per sq ft) + (area × installation cost per sq ft) + waste factor (typically 7-10%). Underlayment and subfloor preparation calculated separately.',
    sources: 'National Floor Covering Association (NFCA) pricing data; Home Depot and Lowe\'s listed material prices.',
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

export async function generateMetadata(): Promise<Metadata> {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = CALC_SITES.find(c => c.domain === host);
  if (!cfg) return { title: 'Methodology' };
  return { title: `How We Calculate — ${cfg.designConfig.brandName}` };
}

export default async function MethodologyPage() {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = CALC_SITES.find(c => c.domain === host) || CALC_SITES[0];
  const m = getMethod(cfg);
  const brand = cfg.designConfig.brandName;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', lineHeight: 1.8, color: '#334155' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>How {brand} Calculates Results</h1>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>Transparency about our methodology, data sources, and limitations.</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>📐 Formula</h2>
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
        <p style={{ color: '#64748b', fontSize: 13 }}>This tool provides estimates for informational purposes only. Results are not financial, legal, or professional advice. Always consult qualified professionals and obtain multiple quotes before making decisions based on these estimates.</p>
      </section>
    </div>
  );
}
