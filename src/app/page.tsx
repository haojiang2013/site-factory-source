import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { CalculatorPage } from '@/templates/template-a-calculator/page-template';
import { DataPage } from '@/templates/template-b-data/DataPage';
import { GuidePage } from '@/templates/template-c-guide/GuidePage';
import { PageContent, DesignConfig } from '@/lib/site-config';
import { getRelatedPagesForDomain } from '@/lib/page-registry';
import c1 from '@/data/site-001-moving-calculator/config.json';
import p1 from '@/data/site-001-moving-calculator/pages.json';
import t1 from '@/data/site-001-moving-calculator/tool-code.json';
import c2 from '@/data/site-002-mortgage-calc/config.json';
import p2 from '@/data/site-002-mortgage-calc/pages.json';
import t2 from '@/data/site-002-mortgage-calc/tool-code.json';
import c3 from '@/data/site-003-paint-calc/config.json';
import p3 from '@/data/site-003-paint-calc/pages.json';
import t3 from '@/data/site-003-paint-calc/tool-code.json';
import c4 from '@/data/site-004-ai-tools/config.json';
import p4 from '@/data/site-004-ai-tools/pages.json';
import t4 from '@/data/site-004-ai-tools/tool-code.json';
import c5 from '@/data/site-005-game-guide/config.json';
import p5 from '@/data/site-005-game-guide/pages.json';
import t5 from '@/data/site-005-game-guide/tool-code.json';
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

export const dynamic = 'force-dynamic';

const SITES: Record<string, { config: any; pages: any; tool: any }> = Object.fromEntries([
  ['gomovecalc.xyz',{c:c1,p:p1,t:t1}],['payitoff.xyz',{c:c2,p:p2,t:t2}],['paintwise.xyz',{c:c3,p:p3,t:t3}],['aitoolshelf.xyz',{c:c4,p:p4,t:t4}],['lootcove.xyz',{c:c5,p:p5,t:t5}],
  ['pourtrue.8zla.com',{c:c6,p:p6,t:t6}],['floorfound.8zla.com',{c:c7,p:p7,t:t7}],['devtooltrove.8zla.com',{c:c8,p:p8,t:t8}],['renowise.8zla.com',{c:c9,p:p9,t:t9}],['bossbreak.8zla.com',{c:c10,p:p10,t:t10}],
  ['designtooltrove.8zla.com',{c:c11,p:p11,t:t11}],['markettooltrove.8zla.com',{c:c12,p:p12,t:t12}],['videotooltrove.8zla.com',{c:c13,p:p13,t:t13}],['itemarchive.8zla.com',{c:c14,p:p14,t:t14}],['buildcraft.8zla.com',{c:c15,p:p15,t:t15}],
  ['voltwise.8zla.com',{c:c16,p:p16,t:t16}],['soilwise.8zla.com',{c:c17,p:p17,t:t17}],['cleancalc.8zla.com',{c:c18,p:p18,t:t18}],['solarwise.8zla.com',{c:c19,p:p19,t:t19}],['hvacwise.8zla.com',{c:c20,p:p20,t:t20}],
  ['prodtooltrove.8zla.com',{c:c21,p:p21,t:t21}],['wavecraft.8zla.com',{c:c22,p:p22,t:t22}],['datatooltrove.8zla.com',{c:c23,p:p23,t:t23}],['weaponwise.8zla.com',{c:c24,p:p24,t:t24}],['npcvault.8zla.com',{c:c25,p:p25,t:t25}],
].map(([d,o])=>[d,{config:(o as any).c,pages:(o as any).p,tool:(o as any).t}]));

async function getHost() {
  const heads = await headers();
  return (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
}

export async function generateMetadata(): Promise<Metadata> {
  const host = await getHost();
  const site = SITES[host] || SITES['gomovecalc.xyz'];
  const brand = site.config.designConfig.brandName;
  const desc = (site.pages[0] as PageContent).metaDescription || '';
  const domain = site.config.domain;
  // Never use www — Google treats it as duplicate
  const url = `https://${domain.replace(/^www\./, '')}`;
  return {
    title: `${brand} — Free ${site.config.niche}`,
    description: desc,
    metadataBase: new URL(url),
    alternates: { canonical: '/' },
    openGraph: {
      title: `${brand} — Free ${site.config.niche}`,
      description: desc,
      url,
      siteName: brand,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand} — Free ${site.config.niche}`,
      description: desc,
    },
    robots: { index: true, follow: true },
  };
}

export default async function HomePage(props: any) {
  const searchParams = props.searchParams || {};
  const host = await getHost();
  // Allow ?site= query param for testing — maps slug to domain key
  const siteMap: Record<string,string> = {
    'site-001':'gomovecalc.xyz','site-002':'payitoff.xyz','site-003':'paintwise.xyz',
    'site-004':'aitoolshelf.xyz','site-005':'lootcove.xyz',
    'site-006':'pourtrue.8zla.com','site-007':'floorfound.8zla.com','site-008':'devtooltrove.8zla.com',
    'site-009':'renowise.8zla.com','site-010':'bossbreak.8zla.com','site-011':'designtooltrove.8zla.com',
    'site-012':'markettooltrove.8zla.com','site-013':'videotooltrove.8zla.com','site-014':'itemarchive.8zla.com',
    'site-015':'buildcraft.8zla.com','site-016':'voltwise.8zla.com','site-017':'soilwise.8zla.com',
    'site-018':'cleancalc.8zla.com','site-019':'solarwise.8zla.com','site-020':'hvacwise.8zla.com',
    'site-021':'prodtooltrove.8zla.com','site-022':'wavecraft.8zla.com','site-023':'datatooltrove.8zla.com',
    'site-024':'weaponwise.8zla.com','site-025':'npcvault.8zla.com',
  };
  const site = (searchParams?.site && siteMap[searchParams.site])
    ? SITES[siteMap[searchParams.site]]
    : (SITES[host] || SITES['gomovecalc.xyz'] || Object.values(SITES)[0]);
  const page = site.pages[0] as PageContent;
  const brand = site.config.designConfig.brandName;
  const domain = site.config.domain;
  const relatedPages = getRelatedPagesForDomain(domain);

  // Template B: data comparison pages
  if (site.config.template === 'B') {
    return (
      <DataPage
        page={{
          title: page.title,
          metaDescription: page.metaDescription,
          h1: page.h1,
          introBody: page.introBody || page.sections?.[0]?.body || '',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price', sortable: true },
            { key: 'rating', label: 'Rating', sortable: true },
            { key: 'features', label: 'Key Features' },
          ],
          rows: (site.config.keywords || []).slice(0, 8).map((kw: any, i: number) => ({
            id: `tool-${i}`,
            cells: {
              name: kw.keyword.replace('best ', '').replace(' calculator', ''),
              price: ['Free', '$9/mo', '$29/mo', '$49/mo'][i % 4],
              rating: (4.8 - i * 0.2).toFixed(1),
              features: kw.userComplaints?.slice(0, 2).join(', ') || 'N/A',
            },
            detail: `<p>${kw.userComplaints?.join('. ') || 'No details available.'}</p>`,
          })),
          sections: (page.sections || []).map((s: any) => ({ heading: s.heading, body: s.body })),
          faqs: page.faqs || [],
          affiliateCTA: page.affiliateCTA || null,
          lastUpdated: page.lastUpdated,
          author: page.author,
        }}
        brandName={brand}
        designConfig={site.config.designConfig as DesignConfig}
        domain={domain}
        relatedPages={relatedPages}
      />
    );
  }

  // Template C: guide/wiki pages
  if (site.config.template === 'C') {
    return (
      <GuidePage
        page={{
          title: page.title,
          metaDescription: page.metaDescription,
          h1: page.h1,
          introBody: page.introBody || page.sections?.[0]?.body || '',
          tocItems: (page.sections || []).map((s: any, i: number) => ({
            id: `section-${i}`, text: s.heading, level: 2,
          })),
          sections: (page.sections || []).map((s: any, i: number) => ({
            id: `section-${i}`, heading: s.heading, body: s.body,
          })),
          dataCards: page.dataCards || [],
          miniToolCode: site.tool.jsCode?.slice(0, 3000) || '',
          faqs: page.faqs || [],
          lastUpdated: page.lastUpdated,
          author: page.author,
        }}
        brandName={brand}
        designConfig={site.config.designConfig as DesignConfig}
        domain={domain}
        relatedPages={relatedPages}
      />
    );
  }

  // Template A: calculator pages (default)
  return (
    <CalculatorPage
      page={page}
      brandName={brand}
      toolCode={site.tool.jsCode || ''}
      designConfig={site.config.designConfig as DesignConfig}
      domain={domain}
      relatedPages={relatedPages}
      productHuntUrl={domain === 'gomovecalc.xyz' ? 'https://www.producthunt.com/products/movewise' : undefined}
    />
  );
}
