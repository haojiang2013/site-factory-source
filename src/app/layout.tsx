import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
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
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
