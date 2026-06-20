import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://gomovecalc.xyz'),
  robots: 'index, follow',
  verification: {
    google: 'EM2YePYffT9Cu9RtydWDVqnYsEpQYpsgD-gt_srn3XM',
  },
};
export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="p:domain_verify" content="1fc11e3b568cf17463e32d448fb2a768" />
      </head>
      <body>
        {children}
        <Analytics />
        <AnalyticsTracker />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
