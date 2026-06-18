import { Layout } from '@/components/Layout';
import fs from 'fs/promises';
import path from 'path';

const SITE = process.env.SITE_SLUG || 'site-001-moving-calculator';

export default async function TermsPage() {
  const configRaw = await fs.readFile(path.join(process.cwd(), 'src', 'data', SITE, 'config.json'), 'utf-8');
  const { designConfig } = JSON.parse(configRaw);

  return (
    <Layout brandName={designConfig.brandName}>
      <div className="max-w-2xl mx-auto px-4 py-16 prose">
        <h1>Terms of Use</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>1. Disclaimer</h2>
        <p>The tools and calculators on {designConfig.brandName} provide estimates for informational purposes only. Actual costs may vary by ±15% or more depending on your specific circumstances. We are not responsible for decisions made based on these estimates.</p>
        <h2>2. No Professional Advice</h2>
        <p>Content on this site does not constitute professional advice. Always consult qualified professionals for your specific situation.</p>
        <h2>3. Limitation of Liability</h2>
        <p>{designConfig.brandName} shall not be liable for any damages arising from the use of this website.</p>
      </div>
    </Layout>
  );
}
