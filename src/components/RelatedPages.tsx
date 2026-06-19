/**
 * Internal linking component — shows links to all sub-pages on the same domain.
 * Critical for SEO: helps Google discover pages, spreads link equity.
 */
import Link from 'next/link';

interface RelatedPagesProps {
  domain: string;
  currentSlug?: string;
  pages: Array<{ slug: string; h1: string }>;
}

export function RelatedPages({ domain, currentSlug, pages }: RelatedPagesProps) {
  if (pages.length <= 1) return null;

  const otherPages = pages.filter(p => p.slug !== currentSlug);

  return (
    <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e8e8e8' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#333' }}>
        More Free Tools & Guides
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
        {otherPages.map(p => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            style={{
              display: 'block',
              padding: '10px 14px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e8ecf1',
              fontSize: 13,
              color: '#2563eb',
              textDecoration: 'none',
            }}
          >
            {p.h1.replace(/[-–—]/g, '').substring(0, 70)}{p.h1.length > 70 ? '…' : ''}
          </Link>
        ))}
      </div>
    </section>
  );
}
