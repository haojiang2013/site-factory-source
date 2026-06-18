import React from 'react';
import { DesignConfig } from '@/lib/site-config';
import { COLOR_PALETTES, FONT_PAIRS } from '@/lib/design-tokens';
import { NewsletterForm } from './NewsletterForm';

interface LayoutProps {
  brandName: string;
  designConfig?: DesignConfig;
  children: React.ReactNode;
}

export function Layout({ brandName, designConfig, children }: LayoutProps) {
  const palette = designConfig?.colorScheme ? COLOR_PALETTES[designConfig.colorScheme] : COLOR_PALETTES['denim-canvas'];
  const fonts = designConfig?.fontPair ? FONT_PAIRS[designConfig.fontPair] : FONT_PAIRS['merriweather+opensans'];
  const year = new Date().getFullYear();
  if (!palette) return <>{children}</>;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href={`https://fonts.googleapis.com/css2?family=${fonts.googleUrl}&display=swap`} rel="stylesheet" />

      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:palette.bg, fontFamily:`'${fonts.body}',system-ui,sans-serif` }}>
        {/* Minimal nav — just brand + hub link */}
        <header style={{ borderBottom:`1px solid ${palette.border}`, background:palette.navBg, position:'sticky',top:0,zIndex:10 }}>
          <div style={{ maxWidth:960, margin:'0 auto', padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <a href="/" style={{ fontFamily:`'${fonts.heading}',serif`, fontWeight:700, fontSize:18, color:palette.text, textDecoration:'none' }}>
              {brandName}
            </a>
            <nav style={{ display:'flex', gap:16, fontSize:13 }}>
              <a href="/hub" style={{ color:palette.muted, textDecoration:'none' }}>More Tools</a>
              <a href="/about" style={{ color:palette.muted, textDecoration:'none' }}>About</a>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main style={{ flex:1, maxWidth:960, margin:'0 auto', padding:'24px 20px', width:'100%' }}>
          {children}
        </main>

        {/* Newsletter */}
        <NewsletterForm palette={palette} />

        {/* Footer — trust signals */}
        <footer style={{ borderTop:`1px solid ${palette.border}`, color:palette.muted, padding:'24px 20px', fontSize:12, marginTop:40 }}>
          <div style={{ maxWidth:960, margin:'0 auto', textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap', marginBottom:12 }}>
              <span>✅ Free · No Signup</span>
              <span>📊 Data from public industry sources</span>
              <span>🔒 No personal data collected</span>
            </div>
            <p style={{ margin:0, color:'#bbb', fontSize:11 }}>
              Thousands of people use our tools every month. Every estimate is private and instant.
            </p>
            <nav style={{ marginTop:12, display:'flex', justifyContent:'center', gap:16 }}>
              <a href="/hub" style={{ color:palette.muted, textDecoration:'none' }}>More Tools</a>
              <a href="/privacy" style={{ color:palette.muted, textDecoration:'none' }}>Privacy</a>
              <a href="/terms" style={{ color:palette.muted, textDecoration:'none' }}>Terms</a>
              <a href="/contact" style={{ color:palette.muted, textDecoration:'none' }}>Contact</a>
            </nav>
            <p style={{ marginTop:12, color:'#ccc', fontSize:10 }}>© {year} {brandName}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
