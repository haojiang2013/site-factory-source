'use client';
import { useState } from 'react';

export function NewsletterForm({ palette }: { palette: { text: string; muted: string; accent: string; border: string; surface?: string } }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {}
    try { localStorage.setItem('nl-signed', '1'); } catch {}
    setDone(true);
    setLoading(false);
  };

  if (done) return null;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto 0', padding: '0 16px' }}>
      <div style={{ border: `1px solid ${palette.border}`, borderRadius: 8, padding: 16, textAlign: 'center', background: palette.surface || '#fff' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600, color: palette.text }}>
          Get updates when estimates change
        </p>
        <p style={{ margin: '0 0 12px 0', fontSize: 12, color: palette.muted }}>
          One email when costs shift. No spam. Unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
            style={{ padding: '8px 12px', borderRadius: 4, border: `1px solid ${palette.border}`, width: 220, fontSize: 13 }} />
          <button type="submit" disabled={loading}
            style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 4, background: palette.accent, color: '#fff', border: 'none', fontSize: 13, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        <p style={{ margin: '8px 0 0 0', fontSize: 10, color: '#ccc' }}>No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
