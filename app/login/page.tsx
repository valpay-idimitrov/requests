'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const ROTATING_NAMES = [
  { name: 'Ethan', flare: 0 }, { name: 'Ethan', flare: 0 }, { name: 'Tarek', flare: 1 }, { name: 'Mitch', flare: 2 },
  { name: 'Kenneth', flare: 3 }, { name: 'Cam', flare: 4 }, { name: 'Meagan', flare: 0 }, { name: 'Melissa', flare: 5 },
  { name: 'Carly', flare: 1 }, { name: 'Blake', flare: 2 }, { name: 'Elie', flare: 3 }, { name: 'Youssef', flare: 4 },
  { name: 'Raph', flare: 1 }, { name: 'Josh', flare: 2 }, { name: 'Matt', flare: 5 }, { name: 'Tristan', flare: 0 }, { name: 'Izza', flare: 3 },
  { name: 'Hadi', flare: 4 }, { name: 'May', flare: 5 }, { name: 'Zaliqa', flare: 1 }, { name: 'Ali Kobba', flare: 2 },
  { name: 'Ali Kaakati', flare: 0 }, { name: 'Ahmad', flare: 3 }
];
const FLARE_COLORS = ['#E0B3F5', '#C084E8', '#F0A8E0', '#B48EF0', '#D9A8F5', '#9C6FD9'];

const loginPalette: React.CSSProperties = {
  '--ox-1': '#332a5c', '--ox-2': '#3c336c', '--ox-3': '#453c7d', '--ox-glow': '#8b7ac9',
  '--ox-panel': 'rgba(255,255,255,0.06)', '--ox-panel-strong': 'rgba(255,255,255,0.09)',
  '--ox-border': 'rgba(255,255,255,0.14)', '--ox-border-strong': 'rgba(255,255,255,0.24)',
  '--ox-text': '#FFFFFF', '--ox-text-dim': 'rgba(255,255,255,0.82)', '--ox-text-faint': 'rgba(255,255,255,0.58)',
  '--ox-accent': '#B3A3E8', '--ox-cta-bg': '#8B6FDB', '--ox-cta-text': '#FFFFFF'
} as React.CSSProperties;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
}

type Mode = 'login' | 'signup' | 'reset';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [nameIndex, setNameIndex] = useState(0);
  const [showName, setShowName] = useState(true);
  const [mode, setMode] = useState<Mode>('login');
  const [formVisible, setFormVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setShowName(false);
      setTimeout(() => {
        setNameIndex(i => (i + 1) % ROTATING_NAMES.length);
        setShowName(true);
      }, 16);
    }, 800);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const isSignup = mode === 'signup';
  const isLogin = mode === 'login';
  const isReset = mode === 'reset';
  const showConfirmPassword = isSignup;

  function switchMode(next: Mode) {
    setFormVisible(false);
    setTimeout(() => {
      setMode(next); setFormVisible(true); setError(''); setPassword(''); setConfirmPassword(''); setCheckEmail(false); setResetSent(false);
    }, 320);
  }

  async function onSubmit() {
    if (isReset) {
      if (!email.trim()) { setError('Enter your email to continue.'); return; }
      if (!isValidEmail(email)) { setError('Enter a valid email address.'); return; }
      setError('');
      setSubmitting(true);
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      setSubmitting(false);
      if (resetError) { setError(resetError.message); return; }
      setResetSent(true);
      return;
    }

    if (!email.trim() || !password.trim() || (showConfirmPassword && !confirmPassword.trim())) {
      setError('Fill in all fields to continue.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (showConfirmPassword && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSubmitting(true);
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();

    if (isSignup) {
      const { data, error: signUpError } = await supabase.auth.signUp({ email: normalizedEmail, password });
      setSubmitting(false);
      if (signUpError) {
        setError(signUpError.message.toLowerCase().includes('valpay') ? 'Only ValPay email addresses can sign up.' : signUpError.message);
        return;
      }
      if (data.session) {
        router.push('/');
        router.refresh();
        return;
      }
      // Email confirmation is required before a session is issued.
      setCheckEmail(true);
      return;
    }

    // isLogin
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    setSubmitting(false);
    if (signInError) {
      setError('Incorrect email or password.');
      return;
    }
    router.push('/');
    router.refresh();
  }

  const current = ROTATING_NAMES[nameIndex];
  const currentColor = FLARE_COLORS[current.flare];

  async function goHome() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    router.push(data.session ? '/' : '/login');
  }

  return (
    <div style={{ ...loginPalette, fontFamily: 'var(--font-body)', color: 'var(--ox-text)', minHeight: '100vh', display: 'flex', alignItems: 'stretch', justifyContent: 'center', padding: 24, boxSizing: 'border-box', background: 'linear-gradient(160deg, var(--ox-3) 0%, var(--ox-2) 45%, var(--ox-1) 100%)' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 1280, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 140, padding: 56, boxSizing: 'border-box', minHeight: 'calc(100vh - 48px)' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 440, flex: '1 1 320px', minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'nowrap' }}>
            <Image onClick={goHome} src="/assets/valpay-logo-transparent.png" alt="ValPay" width={110} height={40} style={{ height: 40, width: 'auto', display: 'block', flexShrink: 0, cursor: 'pointer' }} />
            <span style={{ width: 1, height: 24, background: 'var(--ox-border)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--ox-text-dim)', whiteSpace: 'nowrap' }}>Roadmap Requests</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460 }}>
            <h1 style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 600, lineHeight: 1.15, letterSpacing: -1, margin: 0 }}>Requests, simplified.</h1>
            <p className="body-md" style={{ color: 'var(--ox-text-dim)', margin: 0, fontSize: 19, lineHeight: 1.45, fontWeight: 400 }}>
              See what&apos;s being built, submit, and upvote requests that matter to{' '}
              <span style={{ position: 'relative', display: 'inline-block', width: 130, height: '1.3em', verticalAlign: 'bottom' }}>
              {showName && (
                <strong
                  key={nameIndex}
                  style={{
                    color: currentColor, position: 'absolute', left: 0, top: -2, display: 'inline-block',
                    fontStyle: 'italic', fontWeight: 800, fontSize: '1em', letterSpacing: 0.5, whiteSpace: 'nowrap',
                    textShadow: '0 2px 0 rgba(0,0,0,0.35)', transformOrigin: '0% 100%',
                    animation: 'rmNameIn 0.16s steps(1) both'
                  }}
                >
                  {current.name}!
                  <span style={{ position: 'absolute', left: 0, right: '-14%', bottom: -12, height: 10, transformOrigin: 'left center', animation: 'rmUnderlineIn 0.09s ease-out 0.02s both', background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='14' viewBox='0 0 60 14'%3E%3Cline x1='0' y1='12' x2='46' y2='2' stroke='%23C084E8' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E\") no-repeat center / 100% 100%" }} />
                  <span style={{ position: 'absolute', left: 0, right: '-14%', bottom: -12, height: 10, transformOrigin: 'left center', animation: 'rmUnderlineIn 0.09s ease-out 0.09s both', background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='14' viewBox='0 0 60 14'%3E%3Cline x1='10' y1='12' x2='58' y2='2' stroke='%23C084E8' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E\") no-repeat center / 100% 100%" }} />
                </strong>
              )}
              </span>
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', border: '1px solid var(--ox-border)', borderRadius: 20, width: 380, flexShrink: 0, boxShadow: 'var(--ox-shadow-modal, 0 24px 64px rgba(0,0,0,0.28))', overflow: 'hidden', background: 'var(--ox-panel)', backdropFilter: 'blur(20px)' }}>
          <div style={{ position: 'relative', padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', gap: 24, opacity: formVisible ? 1 : 0, transform: formVisible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.99)', transition: 'opacity 0.32s cubic-bezier(0.22,1,0.36,1), transform 0.32s cubic-bezier(0.22,1,0.36,1)' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, letterSpacing: -0.4, margin: 0 }}>
                {checkEmail ? 'Check your email' : resetSent ? 'Check your email' : (isReset ? 'Reset your password' : (isSignup ? 'Create your account' : 'Sign in'))}
              </div>
              <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>
                {checkEmail
                  ? `We sent a confirmation link to ${email.trim()}. Click it, then come back and sign in.`
                  : resetSent
                  ? `We sent a password reset link to ${email.trim()}.`
                  : isSignup
                  ? 'Only ValPay email addresses can sign up.'
                  : isReset
                  ? "Enter your email and we'll send you a reset link."
                  : 'Sign in to your account.'}
              </p>
            </div>

            {!checkEmail && !resetSent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="body-sm" style={{ color: 'var(--ox-text-dim)', fontWeight: 600, letterSpacing: 0.3 }}>Email address</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}><path d="M22 6 12 13 2 6" /><path d="M2 6h20v12H2z" /></svg>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@valpay.com" style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--ox-border)', borderRadius: 12, padding: '13px 13px 13px 40px', fontSize: 14, fontFamily: 'var(--font-body)', background: 'rgba(0,0,0,0.14)', color: 'var(--ox-text)', outline: 'none', transition: 'var(--transition-all)' }} />
                </div>
              </label>

              {!isReset && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="body-sm" style={{ color: 'var(--ox-text-dim)', fontWeight: 600, letterSpacing: 0.3 }}>Password</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="••••••••••••" style={{ width: '100%', border: '1px solid var(--ox-border)', borderRadius: 12, padding: '13px 58px 13px 40px', fontSize: 14, fontFamily: 'var(--font-body)', background: 'rgba(0,0,0,0.14)', color: 'var(--ox-text)', outline: 'none', boxSizing: 'border-box', transition: 'var(--transition-all)' }} />
                  <button onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 12, background: 'transparent', border: 'none', color: 'var(--ox-text-faint)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer', padding: 4 }}>{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </label>
              )}

              {isLogin && (
                <a href="#" onClick={e => { e.preventDefault(); switchMode('reset'); }} style={{ fontSize: 12, fontWeight: 600, alignSelf: 'flex-end', marginTop: -8, color: 'var(--ox-accent)' }}>Forgot password?</a>
              )}

              {showConfirmPassword && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="body-sm" style={{ color: 'var(--ox-text-dim)', fontWeight: 600, letterSpacing: 0.3 }}>Confirm password</span>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} placeholder="••••••••••••" style={{ width: '100%', border: '1px solid var(--ox-border)', borderRadius: 12, padding: '13px 13px 13px 40px', fontSize: 14, fontFamily: 'var(--font-body)', background: 'rgba(0,0,0,0.14)', color: 'var(--ox-text)', outline: 'none', boxSizing: 'border-box', transition: 'var(--transition-all)' }} />
                  </div>
                </label>
              )}

              {error && <div className="body-sm" style={{ color: '#ff9b9b' }}>{error}</div>}
            </div>
            )}

            {!checkEmail && !resetSent && (
            <button onClick={onSubmit} disabled={submitting} style={{ background: 'rgba(139,111,219,0.14)', color: 'var(--ox-text)', border: '2px solid var(--ox-cta-bg)', borderRadius: 'var(--radius-btn)', padding: '13px 20px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, letterSpacing: 0.2, cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'var(--transition-all)' }}>
              {submitting ? 'Please wait…' : (isReset ? 'Send reset link' : (isSignup ? 'Create account' : 'Sign in'))}
            </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              {(isReset || resetSent) && (
                <p className="body-xs" style={{ color: 'var(--ox-text-faint)', margin: 0, textAlign: 'center' }}>
                  <a href="#" onClick={e => { e.preventDefault(); switchMode('login'); }} style={{ fontWeight: 600, color: 'var(--ox-text)' }}>Back to sign in</a>
                </p>
              )}
              {checkEmail && (
                <p className="body-xs" style={{ color: 'var(--ox-text-faint)', margin: 0, textAlign: 'center' }}>
                  <a href="#" onClick={e => { e.preventDefault(); switchMode('login'); }} style={{ fontWeight: 600, color: 'var(--ox-text)' }}>Go to sign in</a>
                </p>
              )}
              {!isReset && !resetSent && !checkEmail && (
                <p className="body-xs" style={{ color: 'var(--ox-text-faint)', margin: 0, textAlign: 'center' }}>
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <a href="#" onClick={e => { e.preventDefault(); switchMode(isSignup ? 'login' : 'signup'); }} style={{ fontWeight: 600, color: 'var(--ox-text)' }}>{isSignup ? 'Log in' : 'Sign up'}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
