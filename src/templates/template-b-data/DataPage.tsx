import { FilterTable, TableColumn, TableRow } from './FilterTable';
import { Layout } from '@/components/Layout';
import { DesignConfig } from '@/lib/site-config';
import { COLOR_PALETTES } from '@/lib/design-tokens';
import { RelatedPages } from '@/components/RelatedPages';

export interface DataPageContent {
  title: string;
  metaDescription: string;
  h1: string;
  introBody: string;
  columns: TableColumn[];
  rows: TableRow[];
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  affiliateCTA: { productName: string; link: string; platform: string; disclosureText: string } | null;
  lastUpdated?: string;
  author?: { name: string; url: string; jobTitle?: string };
}

export function DataPage({ page, brandName, designConfig, domain, currentSlug, relatedPages }: {
  page: DataPageContent;
  brandName: string;
  designConfig?: DesignConfig;
  domain?: string;
  currentSlug?: string;
  relatedPages?: Array<{ slug: string; h1: string }>;
}) {
  const palette = designConfig?.colorScheme ? COLOR_PALETTES[designConfig.colorScheme] : null;

  // JSON-LD structured data for rich snippets
  const schemaJson: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: page.h1,
      description: page.metaDescription,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      ...(page.lastUpdated ? { dateModified: page.lastUpdated } : {}),
      ...(page.author ? { author: { '@type': 'Person', name: page.author.name, url: page.author.url } } : {}),
      publisher: { '@type': 'Organization', name: brandName, url: domain ? `https://${domain}` : undefined, sameAs: ['https://github.com/pank770766', 'https://x.com/stevenkuep'] },
    },
  ];
  if (page.faqs.length > 0) {
    schemaJson.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return (
    <Layout brandName={brandName} designConfig={designConfig} lastUpdated={page.lastUpdated} author={page.author}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson.length === 1 ? schemaJson[0] : { '@context': 'https://schema.org', '@graph': schemaJson }) }} />
      <article className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: palette?.text || '#1a1a1a' }}>
            {page.h1}
          </h1>
          <p className="mt-2 text-lg" style={{ color: palette?.muted || '#666' }}>
            {page.metaDescription}
          </p>
        </header>

        {/* Intro */}
        {page.introBody && (
          <section className="mb-8">
            <div className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.introBody || '' }} />
          </section>
        )}

        {/* Filter + Table — the Evidence Block */}
        <section className="mb-10">
          <FilterTable columns={page.columns} rows={page.rows} brandName={brandName} />
        </section>

        {/* Content sections */}
        {page.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.body || '' }} />
          </section>
        ))}

        {/* Affiliate CTA */}
        {page.affiliateCTA && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-5 my-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-green-700">{brandName} Pick</span>
              <span className="text-xs text-green-600">•</span>
              <span className="text-xs text-green-600">Our Recommendation</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{page.affiliateCTA.productName}</p>
            <a href={page.affiliateCTA.link} target="_blank" rel="nofollow sponsored noopener"
              className="inline-flex items-center gap-1 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
              View on {page.affiliateCTA.platform} →
            </a>
            <p className="text-xs text-gray-400 mt-2">{page.affiliateCTA.disclosureText}</p>
          </div>
        )}

        {/* FAQ */}
        {page.faqs.length > 0 && (
          <section className="faq-section my-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <dl className="space-y-5">
              {page.faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <dt className="font-semibold text-gray-900 mb-1">{faq.question}</dt>
                  <dd className="text-gray-600 leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Internal linking */}
        {domain && relatedPages && relatedPages.length > 1 && (
          <RelatedPages domain={domain} currentSlug={currentSlug} pages={relatedPages} />
        )}
      </article>
    </Layout>
  );
}
