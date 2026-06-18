import { Layout } from '@/components/Layout';
import fs from 'fs/promises';
import path from 'path';

const SITE = process.env.SITE_SLUG || 'site-001-moving-calculator';

export default async function PrivacyPage() {
  const configRaw = await fs.readFile(path.join(process.cwd(), 'src', 'data', SITE, 'config.json'), 'utf-8');
  const { designConfig } = JSON.parse(configRaw);

  return (
    <Layout brandName={designConfig.brandName}>
      <div className="max-w-2xl mx-auto px-4 py-16 prose">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>1. Information We Collect</h2>
        <p>{designConfig.brandName} does not require registration. We do not collect personal information unless you voluntarily provide it (e.g., via our contact form or newsletter signup).</p>
        <h2>2. Cookies</h2>
        <p>We use minimal cookies for essential functionality (such as saving your calculator results locally in your browser). We do not use tracking cookies.</p>
        <h2>3. Third Parties</h2>
        <p>We may use Google AdSense for advertising. Google may use cookies to serve ads based on your prior visits. You can opt out at Google Ads Settings.</p>
        <h2>4. Affiliate Disclosure</h2>
        <p>Some links on this site are affiliate links. If you make a purchase through these links, we may earn a commission at no extra cost to you. As an Amazon Associate we may earn from qualifying purchases.</p>
        <h2>5. Contact</h2>
        <p>For privacy questions, contact us via our Contact page.</p>
      </div>
    </Layout>
  );
}
