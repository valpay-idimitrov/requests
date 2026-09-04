'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const ROTATING_NAMES = [
  { name: 'Ethan', color: '#ffcf9e', transform: 'rotate(-2deg)' },
  { name: 'Tarek', color: '#9edcff', transform: 'rotate(1.5deg) scale(1.06)' },
  { name: 'Mitch', color: '#ffd166', transform: 'skewX(-6deg)' },
  { name: 'Kenneth', color: '#ff9ec4', transform: 'rotate(2deg) scale(0.96)' },
  { name: 'Cam', color: '#b6ffb0', transform: 'skewX(5deg) rotate(-1deg)' },
  { name: 'Meagan', color: '#ffcf9e', transform: 'scale(1.1)' },
  { name: 'Melissa', color: '#c6b4ff', transform: 'rotate(-2.5deg) skewX(3deg)' },
  { name: 'Carly', color: '#9edcff', transform: 'rotate(2.5deg)' },
  { name: 'Blake', color: '#ffd166', transform: 'scale(0.94) rotate(-1deg)' },
  { name: 'Elie', color: '#ff9ec4', transform: 'skewX(-4deg) scale(1.05)' },
  { name: 'Youssef', color: '#b6ffb0', transform: 'rotate(1.8deg) scale(1.04)' },
  { name: 'Raph', color: '#9edcff', transform: 'skewX(4deg) rotate(-1.5deg)' },
  { name: 'Josh', color: '#ffd166', transform: 'scale(0.95) rotate(2deg)' },
  { name: 'Matt', color: '#c6b4ff', transform: 'skewX(-5deg) scale(1.08)' },
  { name: 'Tristan', color: '#ffcf9e', transform: 'rotate(-1.5deg) skewX(3deg)' },
  { name: 'Izza', color: '#ff9ec4', transform: 'scale(1.07) rotate(1deg)' }
];

const loginPalette: React.CSSProperties = {
  '--ox-1': '#2e1209', '--ox-2': '#46201a', '--ox-3': '#5c2a1f', '--ox-glow': '#8a4632',
  '--ox-panel': 'rgba(20,8,5,0.3)', '--ox-panel-strong': 'rgba(20,8,5,0.44)',
  '--ox-border': 'rgba(255,238,230,0.16)', '--ox-border-strong': 'rgba(255,238,230,0.28)',
  '--ox-text': '#FFF9F5', '--ox-text-dim': 'rgba(255,249,245,0.82)', '--ox-text-faint': 'rgba(255,249,245,0.6)',
  '--ox-accent': '#f6d3ba', '--ox-cta-bg': '#FFFFFF', '--ox-cta-text': '#46201a'
} as React.CSSProperties;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [nameIndex, setNameIndex] = useState(0);
  const [showName, setShowName] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setShowName(false);
      setTimeout(() => {
        setNameIndex(i => (i + 1) % ROTATING_NAMES.length);
        setShowName(true);
      }, 40);
    }, 1600);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  async function onSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Sign in with a ValPay email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    setSubmitting(false);
    if (authError) {
      setError('Incorrect email or password.');
      return;
    }
    router.push('/');
    router.refresh();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') onSubmit();
  }

  const current = ROTATING_NAMES[nameIndex];

  return (
    <div style={{ ...loginPalette, fontFamily: 'var(--font-body)', color: 'var(--ox-text)', minHeight: '100vh', display: 'flex', alignItems: 'stretch', justifyContent: 'center', padding: 24, boxSizing: 'border-box', background: 'radial-gradient(ellipse 900px 700px at 82% 4%, var(--ox-glow) 0%, var(--ox-3) 26%, var(--ox-2) 52%, var(--ox-1) 100%)' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 1420, border: '1px solid var(--ox-border)', borderRadius: 28, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 220, padding: 56, boxSizing: 'border-box', minHeight: 'calc(100vh - 48px)', background: 'rgba(10,4,3,0.1)' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 460, flex: '1 1 320px', minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'nowrap', paddingLeft: 10 }}>
            <Image src="/assets/valpay-logo-transparent.png" alt="ValPay" width={140} height={52} style={{ height: 52, width: 'auto', display: 'block', flexShrink: 0 }} />
            <span style={{ width: 1, height: 32, background: 'var(--ox-border-strong)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: 'var(--ox-text)', whiteSpace: 'nowrap' }}>Roadmap</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460, paddingLeft: 20 }}>
            <h1 style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 600, lineHeight: 1.12, letterSpacing: -1, margin: 0, whiteSpace: 'nowrap' }}>Requests, simplified.</h1>
            <p className="body-md" style={{ color: 'var(--ox-text-dim)', margin: 0, fontSize: 19, lineHeight: 1.45, fontWeight: 400 }}>
              See what&apos;s being built, submit, and upvote requests that matter to{' '}
              <span style={{ position: 'relative', display: 'inline-block', width: 130, height: '1.3em', verticalAlign: 'bottom', perspective: 500 }}>
              {showName && (
                <strong
                  key={nameIndex}
                  style={{
                    color: current.color, transform: current.transform, position: 'absolute', left: 0, top: -2, display: 'inline-block',
                    fontStyle: 'italic', fontWeight: 800, fontSize: '1.25em', letterSpacing: 0.5, whiteSpace: 'nowrap',
                    textShadow: '0 2px 0 rgba(0,0,0,0.35)', transformOrigin: '0% 100%',
                    animation: 'rmYouGlitch 3.2s steps(1) infinite, rmPageFlip 0.5s steps(1) both'
                  }}
                >
                  {current.name}!
                  <span style={{ position: 'absolute', left: 0, right: '-14%', bottom: -12, height: 10, transformOrigin: 'left center', animation: 'rmUnderlineIn 0.22s ease-out 0.05s both', background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='14' viewBox='0 0 60 14'%3E%3Cline x1='0' y1='12' x2='46' y2='2' stroke='%23ffcf9e' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E\") no-repeat center / 100% 100%" }} />
                  <span style={{ position: 'absolute', left: 0, right: '-14%', bottom: -12, height: 10, transformOrigin: 'left center', animation: 'rmUnderlineIn 0.22s ease-out 0.22s both', background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='14' viewBox='0 0 60 14'%3E%3Cline x1='10' y1='12' x2='58' y2='2' stroke='%23ffcf9e' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E\") no-repeat center / 100% 100%" }} />
                </strong>
              )}
              </span>
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', background: 'linear-gradient(165deg, rgba(255,238,230,0.14), rgba(255,238,230,0.03))', borderRadius: 28, padding: 1, width: 460, flexShrink: 0, boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}>
          <div style={{ position: 'relative', background: 'linear-gradient(165deg, var(--ox-panel-strong), var(--ox-2) 40%)', borderRadius: 27, padding: '52px 64px', display: 'flex', flexDirection: 'column', gap: 36, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,238,230,0.5), transparent)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500, letterSpacing: -0.5, margin: 0 }}>Sign in</div>
              <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>Only ValPay email addresses can sign in.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <span className="body-sm" style={{ color: 'var(--ox-text-dim)', fontWeight: 600, letterSpacing: 0.3 }}>Email address</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 16, pointerEvents: 'none' }}><path d="M22 6 12 13 2 6" /><path d="M2 6h20v12H2z" /></svg>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} onKeyDown={onKeyDown} placeholder="you@valpay.com" style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--ox-border)', borderRadius: 13, padding: '16px 16px 16px 47px', fontSize: 16, fontFamily: 'var(--font-body)', background: 'rgba(0,0,0,0.14)', color: 'var(--ox-text)', outline: 'none' }} />
                </div>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <span className="body-sm" style={{ color: 'var(--ox-text-dim)', fontWeight: 600, letterSpacing: 0.3 }}>Password</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 16, pointerEvents: 'none' }}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} onKeyDown={onKeyDown} placeholder="••••••••••••" style={{ width: '100%', border: '1px solid var(--ox-border)', borderRadius: 13, padding: '16px 68px 16px 47px', fontSize: 16, fontFamily: 'var(--font-body)', background: 'rgba(0,0,0,0.14)', color: 'var(--ox-text)', outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 14, background: 'transparent', border: 'none', color: 'var(--ox-text-faint)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer', padding: 4 }}>{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </label>

              {error && <div className="body-sm" style={{ color: '#ff9b9b' }}>{error}</div>}
            </div>

            <button onClick={onSubmit} disabled={submitting} style={{ background: 'linear-gradient(180deg, #FFFFFF, #f3ece6)', color: 'var(--ox-cta-text)', border: 'none', borderRadius: 'var(--radius-btn)', padding: '18px 22px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 17, letterSpacing: 0.2, cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 14px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)' }}>{submitting ? 'Signing in…' : 'Sign in'}</button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <p className="body-xs" style={{ color: 'var(--ox-text-faint)', margin: 0, textAlign: 'center' }}>Don&apos;t have an account? <a href="/signup" style={{ fontWeight: 600 }}>Sign up</a></p>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 72, bottom: 32 }}>
          <span className="body-xs" style={{ color: 'var(--ox-text-faint)' }}>© 2026 ValPay. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
