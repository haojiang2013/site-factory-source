import Head from 'next/head';

interface SEOMetaProps {
  title: string;
  description: string;
  canonical: string;
  schemaJson?: Record<string, unknown>;
}

export function SEOMeta({ title, description, canonical, schemaJson }: SEOMetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}
    </Head>
  );
}
