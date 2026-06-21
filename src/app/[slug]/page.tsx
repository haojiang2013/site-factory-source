import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { getPageByDomainAndSlug, getRelatedPagesForDomain } from '@/lib/page-registry';
import { CalculatorPage } from '@/templates/template-a-calculator/page-template';
import { DataPage } from '@/templates/template-b-data/DataPage';
import { GuidePage } from '@/templates/template-c-guide/GuidePage';
import { PageContent, DesignConfig } from '@/lib/site-config';

async function getHost() {
  const heads = await headers();
  return (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: any }): Promise<Metadata> {
  const { slug } = await params;
  const host = await getHost();
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
  const lookupHost = (searchParams?.site && siteMap[searchParams.site]) ? siteMap[searchParams.site] : host;
  const entry = getPageByDomainAndSlug(lookupHost, slug);
  if (!entry) return { title: 'Not Found' };

  const brand = entry.config.designConfig.brandName;
  const page = entry.page as PageContent;
  const domain = entry.config.domain.replace(/^www\./, '');
  const url = `https://${domain}/${slug}`;

  return {
    title: `${page.h1} | ${brand}`,
    description: page.metaDescription || '',
    metadataBase: new URL(`https://${domain.replace(/^www\./, '')}`),
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${page.h1} | ${brand}`,
      description: page.metaDescription || '',
      url,
      siteName: brand,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.h1} | ${brand}`,
      description: page.metaDescription || '',
    },
    robots: { index: true, follow: true },
  };
}

export default async function SubPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: any }) {
  const { slug } = await params;
  const host = await getHost();
  // Allow ?site= query param for testing
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
  const lookupHost = (searchParams?.site && siteMap[searchParams.site]) ? siteMap[searchParams.site] : host;
  const entry = getPageByDomainAndSlug(lookupHost, slug);

  if (!entry) {
    notFound();
  }

  const page = entry.page as PageContent;
  const brand = entry.config.designConfig.brandName;
  const designConfig = entry.config.designConfig as DesignConfig;
  const template = entry.config.template;
  const domain = entry.domain;
  const relatedPages = getRelatedPagesForDomain(domain);

  // Render with the appropriate template (same as home page)
  if (template === 'B') {
    return (
      <DataPage
        page={{
          title: page.title,
          metaDescription: page.metaDescription,
          h1: page.h1,
          introBody: (page as any).introBody || page.sections?.[0]?.body || '',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price', sortable: true },
            { key: 'rating', label: 'Rating', sortable: true },
            { key: 'features', label: 'Key Features' },
          ],
          rows: (entry.config.keywords || []).slice(0, 8).map((kw: any, i: number) => ({
            id: `tool-${i}`,
            cells: {
              name: kw.keyword.replace('best ', '').replace(' calculator', ''),
              price: ['Free', '$9/mo', '$29/mo', '$49/mo'][i % 4],
              rating: (4.8 - i * 0.2).toFixed(1),
              features: kw.userComplaints?.slice(0, 2).join(', ') || 'N/A',
            },
            detail: `<p>${kw.userComplaints?.join('. ') || 'No details available.'}</p>`,
          })),
          sections: page.sections.filter((s: any) => s.type === 'text').map((s: any) => ({ heading: s.heading, body: s.body })),
          faqs: page.faqs || [],
          affiliateCTA: page.affiliateCTA || null,
          lastUpdated: page.lastUpdated,
          author: page.author,
        }}
        brandName={brand}
        designConfig={designConfig}
        domain={domain}
        relatedPages={relatedPages}
        currentSlug={slug}
      />
    );
  }

  if (template === 'C') {
    return (
      <GuidePage
        page={{
          title: page.title,
          metaDescription: page.metaDescription,
          h1: page.h1,
          introBody: (page as any).introBody || page.sections?.[0]?.body || '',
          tocItems: (page.sections || []).map((s: any, i: number) => ({
            id: `section-${i}`, text: s.heading, level: 2,
          })),
          sections: (page.sections || []).map((s: any, i: number) => ({
            id: `section-${i}`, heading: s.heading, body: s.body,
          })),
          dataCards: page.dataCards || [],
          miniToolCode: entry.tool.jsCode?.slice(0, 3000) || '',
          faqs: page.faqs || [],
          lastUpdated: page.lastUpdated,
          author: page.author,
        }}
        brandName={brand}
        designConfig={designConfig}
        domain={domain}
        relatedPages={relatedPages}
        currentSlug={slug}
      />
    );
  }

  // Template A: calculator pages
  return (
    <CalculatorPage
      page={page}
      brandName={brand}
      toolCode={entry.tool.jsCode || ''}
      designConfig={designConfig}
      domain={domain}
      relatedPages={relatedPages}
      currentSlug={slug}
    />
  );
}
