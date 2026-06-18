import { CalculatorWidget } from './CalculatorWidget';
import { AffiliateCTA } from './AffiliateCTA';
import { FAQSection } from './FAQSection';
import { Layout } from '@/components/Layout';
import { PageContent, DesignConfig } from '@/lib/site-config';
import { COLOR_PALETTES } from '@/lib/design-tokens';

interface CalculatorPageProps {
  page: PageContent;
  brandName: string;
  toolCode: string;
  designConfig?: DesignConfig;
}

export function CalculatorPage({ page, brandName, toolCode, designConfig }: CalculatorPageProps) {
  const palette = designConfig?.colorScheme ? COLOR_PALETTES[designConfig.colorScheme] : null;
  const toolSection = page.sections.find(s => s.type === 'tool');

  // Build FAQ HowTo schema
  const schemaJson = page.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : undefined;

  return (
    <Layout brandName={brandName} designConfig={designConfig}>
      {/* Tool-first layout: calculator dominates the hero */}
      <div style={{marginBottom:32}}>
        {/* Title above the tool — brief */}
        <h1 style={{fontSize:28,fontWeight:800,color:palette?.text||'#111',margin:'0 0 8px 0',lineHeight:1.2}}>
          {page.h1}
        </h1>
        <p style={{fontSize:15,color:palette?.muted||'#777',margin:'0 0 8px 0',lineHeight:1.5}}>
          {designConfig?.tagline || page.metaDescription}
        </p>

        {/* The tool — the star of the page */}
        {toolSection && (
          <CalculatorWidget toolCode={toolCode} brandName={brandName} />
        )}
      </div>

      {/* Trust card — between tool and content */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:24,padding:'16px 20px',borderRadius:12,background:'#f8faf8',border:'1px solid #e0e8e0',fontSize:13,color:'#555'}}>
        <span>✅ Free · No signup · No email required</span>
        <span>📊 Data from public industry sources</span>
        <span>🕐 Prices updated {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span>
        <span>🔒 We never see your data</span>
        <span>🧑‍💻 Built by {brandName} · <a href="/about" style={{color:'#2563eb'}}>About us</a></span>
      </div>

      {/* Content — supporting material, visually subordinated to the tool */}
      <div style={{borderTop:'1px solid #e8e8e8',paddingTop:24}}>
        {page.sections
          .filter(s => s.type !== 'tool')
          .map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.body || '' }}
              />
            </section>
          ))}

        {/* Affiliate CTA */}
        {page.affiliateCTA && (
          <AffiliateCTA cta={page.affiliateCTA} brandName={brandName} />
        )}

        {/* FAQ */}
        <FAQSection faqs={page.faqs} />
      </div>
    </Layout>
  );
}
