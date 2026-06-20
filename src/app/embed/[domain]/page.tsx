/**
 * Embeddable calculator widget — Phase 2: Content Leverage
 * Returns ONLY the calculator, no header/footer/nav.
 * Usage: <iframe src="https://domain.com/embed/domain" width="100%" height="500"></iframe>
 */
import { notFound } from 'next/navigation';
import { CalculatorWidget } from '@/templates/template-a-calculator/CalculatorWidget';
import { PageContent } from '@/lib/site-config';
import { getSiteByDomain } from '@/lib/page-registry';

export default async function EmbedPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const entry = getSiteByDomain(domain);
  if (!entry || entry.config.template !== 'A') {
    notFound();
  }

  const page = entry.page as PageContent;
  const brand = entry.config.designConfig.brandName;
  const colorScheme = entry.config.designConfig.colorScheme;
  const palette: Record<string, string> = {
    sky: '#0f172a', ocean: '#1e3a5f', forest: '#1a3b32',
    sunset: '#7c2d12', plum: '#3b1d4a', slate: '#1e293b',
  };
  const accent = palette[colorScheme] || '#1a1a2e';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{brand} — Free {entry.config.niche}</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #f7fafc;
            padding: 12px;
          }
          .embed-brand {
            text-align: center;
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
          }
          .embed-brand a {
            color: ${accent};
            font-size: 12px;
            text-decoration: none;
            font-weight: 600;
          }
          .embed-brand a:hover { text-decoration: underline; }
        `}</style>
      </head>
      <body>
        <CalculatorWidget
          toolCode={entry.tool.jsCode || ''}
          brandName={brand}
        />
        <div className="embed-brand">
          <a href={`https://${domain}/`} target="_blank" rel="noopener">
            ⚡ {brand} — Free {entry.config.niche} — open ↗
          </a>
        </div>
      </body>
    </html>
  );
}
