import { Layout } from '@/components/Layout';
import { DesignConfig } from '@/lib/site-config';
import { COLOR_PALETTES } from '@/lib/design-tokens';
import { TableOfContents } from './TableOfContents';
import { DataCard, DataCardItem } from './DataCard';
import { RelatedPages } from '@/components/RelatedPages';

export interface GuidePageContent {
  title: string;
  metaDescription: string;
  h1: string;
  introBody: string;
  tocItems: { id: string; text: string; level: number }[];
  sections: { heading: string; body: string; id: string }[];
  dataCards: DataCardItem[];
  miniToolCode?: string;
  faqs: { question: string; answer: string }[];
}

export function GuidePage({ page, brandName, designConfig, domain, currentSlug, relatedPages }: {
  page: GuidePageContent;
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
      '@type': 'Article',
      headline: page.h1,
      description: page.metaDescription,
      author: { '@type': 'Organization', name: brandName },
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
    <Layout brandName={brandName} designConfig={designConfig}>
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

        {/* Table of Contents */}
        <TableOfContents items={page.tocItems} />

        {/* Content sections */}
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-8">
            <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.body || '' }} />
          </section>
        ))}

        {/* Data Cards */}
        {page.dataCards.length > 0 && (
          <section className="my-10">
            <h2 className="text-xl font-bold mb-4">Item Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.dataCards.map((card, i) => (
                <DataCard key={i} item={card} />
              ))}
            </div>
          </section>
        )}

        {/* Embedded Mini Tool */}
        {page.miniToolCode && (
          <section className="my-10 border rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Quick Tool</h2>
            <div dangerouslySetInnerHTML={{ __html: `<script>${page.miniToolCode}</script>` }} />
            <p className="text-xs text-gray-400 mt-2">This tool runs automatically on page load</p>
          </section>
        )}

        {/* FAQ */}
        {page.faqs.length > 0 && (
          <section className="my-8">
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
