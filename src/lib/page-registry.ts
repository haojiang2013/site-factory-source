/**
 * Centralized page registry — maps domain+slug → page data
 * Used by both home page (/) and sub-pages (/[slug])
 */
import c1 from '@/data/site-001-moving-calculator/config.json'; import p1 from '@/data/site-001-moving-calculator/pages.json'; import t1 from '@/data/site-001-moving-calculator/tool-code.json';
import c2 from '@/data/site-002-mortgage-calc/config.json'; import p2 from '@/data/site-002-mortgage-calc/pages.json'; import t2 from '@/data/site-002-mortgage-calc/tool-code.json';
import c3 from '@/data/site-003-paint-calc/config.json'; import p3 from '@/data/site-003-paint-calc/pages.json'; import t3 from '@/data/site-003-paint-calc/tool-code.json';
import c4 from '@/data/site-004-ai-tools/config.json'; import p4 from '@/data/site-004-ai-tools/pages.json'; import t4 from '@/data/site-004-ai-tools/tool-code.json';
import c5 from '@/data/site-005-game-guide/config.json'; import p5 from '@/data/site-005-game-guide/pages.json'; import t5 from '@/data/site-005-game-guide/tool-code.json';
import c6 from '@/data/site-006-concrete-calc/config.json'; import p6 from '@/data/site-006-concrete-calc/pages.json'; import t6 from '@/data/site-006-concrete-calc/tool-code.json';
import c7 from '@/data/site-007-flooring-calc/config.json'; import p7 from '@/data/site-007-flooring-calc/pages.json'; import t7 from '@/data/site-007-flooring-calc/tool-code.json';
import c8 from '@/data/site-008-ai-coding/config.json'; import p8 from '@/data/site-008-ai-coding/pages.json'; import t8 from '@/data/site-008-ai-coding/tool-code.json';
import c9 from '@/data/site-009-reno-calc/config.json'; import p9 from '@/data/site-009-reno-calc/pages.json'; import t9 from '@/data/site-009-reno-calc/tool-code.json';
import c10 from '@/data/site-010-boss-guide/config.json'; import p10 from '@/data/site-010-boss-guide/pages.json'; import t10 from '@/data/site-010-boss-guide/tool-code.json';
import c11 from '@/data/site-011-ai-design/config.json'; import p11 from '@/data/site-011-ai-design/pages.json'; import t11 from '@/data/site-011-ai-design/tool-code.json';
import c12 from '@/data/site-012-ai-marketing/config.json'; import p12 from '@/data/site-012-ai-marketing/pages.json'; import t12 from '@/data/site-012-ai-marketing/tool-code.json';
import c13 from '@/data/site-013-ai-video/config.json'; import p13 from '@/data/site-013-ai-video/pages.json'; import t13 from '@/data/site-013-ai-video/tool-code.json';
import c14 from '@/data/site-014-game-items/config.json'; import p14 from '@/data/site-014-game-items/pages.json'; import t14 from '@/data/site-014-game-items/tool-code.json';
import c15 from '@/data/site-015-game-builds/config.json'; import p15 from '@/data/site-015-game-builds/pages.json'; import t15 from '@/data/site-015-game-builds/tool-code.json';
import c16 from '@/data/site-016-electrical/config.json'; import p16 from '@/data/site-016-electrical/pages.json'; import t16 from '@/data/site-016-electrical/tool-code.json';
import c17 from '@/data/site-017-garden/config.json'; import p17 from '@/data/site-017-garden/pages.json'; import t17 from '@/data/site-017-garden/tool-code.json';
import c18 from '@/data/site-018-cleaning/config.json'; import p18 from '@/data/site-018-cleaning/pages.json'; import t18 from '@/data/site-018-cleaning/tool-code.json';
import c19 from '@/data/site-019-solar/config.json'; import p19 from '@/data/site-019-solar/pages.json'; import t19 from '@/data/site-019-solar/tool-code.json';
import c20 from '@/data/site-020-hvac/config.json'; import p20 from '@/data/site-020-hvac/pages.json'; import t20 from '@/data/site-020-hvac/tool-code.json';
import c21 from '@/data/site-021-ai-productivity/config.json'; import p21 from '@/data/site-021-ai-productivity/pages.json'; import t21 from '@/data/site-021-ai-productivity/tool-code.json';
import c22 from '@/data/site-022-ai-audio/config.json'; import p22 from '@/data/site-022-ai-audio/pages.json'; import t22 from '@/data/site-022-ai-audio/tool-code.json';
import c23 from '@/data/site-023-ai-data/config.json'; import p23 from '@/data/site-023-ai-data/pages.json'; import t23 from '@/data/site-023-ai-data/tool-code.json';
import c24 from '@/data/site-024-game-weapons/config.json'; import p24 from '@/data/site-024-game-weapons/pages.json'; import t24 from '@/data/site-024-game-weapons/tool-code.json';
import c25 from '@/data/site-025-game-npcs/config.json'; import p25 from '@/data/site-025-game-npcs/pages.json'; import t25 from '@/data/site-025-game-npcs/tool-code.json';

const RAW: Array<{ config: any; pages: any[]; tool: any }> = [
  { config: c1, pages: p1, tool: t1 }, { config: c2, pages: p2, tool: t2 },
  { config: c3, pages: p3, tool: t3 }, { config: c4, pages: p4, tool: t4 },
  { config: c5, pages: p5, tool: t5 }, { config: c6, pages: p6, tool: t6 },
  { config: c7, pages: p7, tool: t7 }, { config: c8, pages: p8, tool: t8 },
  { config: c9, pages: p9, tool: t9 }, { config: c10, pages: p10, tool: t10 },
  { config: c11, pages: p11, tool: t11 }, { config: c12, pages: p12, tool: t12 },
  { config: c13, pages: p13, tool: t13 }, { config: c14, pages: p14, tool: t14 },
  { config: c15, pages: p15, tool: t15 }, { config: c16, pages: p16, tool: t16 },
  { config: c17, pages: p17, tool: t17 }, { config: c18, pages: p18, tool: t18 },
  { config: c19, pages: p19, tool: t19 }, { config: c20, pages: p20, tool: t20 },
  { config: c21, pages: p21, tool: t21 }, { config: c22, pages: p22, tool: t22 },
  { config: c23, pages: p23, tool: t23 }, { config: c24, pages: p24, tool: t24 },
  { config: c25, pages: p25, tool: t25 },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

export interface SiteEntry {
  config: any;
  page: any;       // the specific page content
  pageIndex: number;
  tool: any;
  domain: string;
  slug: string;
}

// domain → { slug → SiteEntry }
const byDomain = new Map<string, Map<string, SiteEntry>>();
// domain → home entry (page index 0)
const homeByDomain = new Map<string, SiteEntry>();

for (const site of RAW) {
  const domain = site.config.domain;
  const slugMap = new Map<string, SiteEntry>();

  for (let i = 0; i < site.pages.length; i++) {
    const page = site.pages[i];
    const slug = page.slug || (i === 0 ? slugify(page.h1) : slugify(page.h1 || `page-${i}`));
    const entry: SiteEntry = { config: site.config, page, pageIndex: i, tool: site.tool, domain, slug };
    slugMap.set(slug, entry);
    if (i === 0) homeByDomain.set(domain, entry);
  }

  byDomain.set(domain, slugMap);
}

export function getSiteByDomain(domain: string): SiteEntry | undefined {
  return homeByDomain.get(domain);
}

export function getPageByDomainAndSlug(domain: string, slug: string): SiteEntry | undefined {
  const slugMap = byDomain.get(domain);
  return slugMap?.get(slug);
}

export function getAllSlugsForDomain(domain: string): string[] {
  const slugMap = byDomain.get(domain);
  return slugMap ? Array.from(slugMap.keys()) : [];
}

export function getAllDomains(): string[] {
  return RAW.map(s => s.config.domain);
}

export function getAllEntries(): SiteEntry[] {
  const entries: SiteEntry[] = [];
  for (const [, slugMap] of byDomain) {
    for (const [, entry] of slugMap) {
      entries.push(entry);
    }
  }
  return entries;
}

export function getRelatedPagesForDomain(domain: string): Array<{ slug: string; h1: string }> {
  const slugMap = byDomain.get(domain);
  if (!slugMap) return [];
  return Array.from(slugMap.values()).map(e => ({ slug: e.slug, h1: e.page.h1 }));
}
