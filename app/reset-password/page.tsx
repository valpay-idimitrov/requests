'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const palette: React.CSSProperties = {
  '--ox-1': '#332a5c', '--ox-2': '#3c336c', '--ox-3': '#453c7d', '--ox-glow': '#8b7ac9',
  '--ox-panel': 'rgba(255,255,255,0.06)', '--ox-panel-strong': 'rgba(255,255,255,0.09)',
  '--ox-border': 'rgba(255,255,255,0.14)', '--ox-border-strong': 'rgba(255,255,255,0.24)',
  '--ox-text': '#FFFFFF', '--ox-text-dim': 'rgba(255,255,255,0.82)', '--ox-text-faint': 'rgba(255,255,255,0.58)',
  '--ox-accent': '#B3A3E8', '--ox-cta-bg': '#8B6FDB', '--ox-cta-text': '#FFFFFF'
} as React.CSSProperties;

type Status = 'checking' | 'ready' | 'invalid' | 'success';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('checking');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Clicking the emailed link puts a recovery token in the URL hash;
    // supabase-js picks it up automatically and fires this event once it's
    // turned that into a real (temporary) session.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready');
    });

    // Also check directly in case the event already fired before this
    // listener was attached (can happen on a fast page load).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus('ready');
      else setTimeout(() => {
        // Give the recovery-link handshake a moment before giving up.
        supabase.auth.getSession().then(({ data: retry }) => {
          setStatus(retry.session ? 'ready' : 'invalid');
        });
      }, 1500);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function onSubmit() {
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Fill in both fields to continue.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setStatus('success');
    setTimeout(() => { router.push('/'); router.refresh(); }, 1500);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') onSubmit();
  }

  async function goHome() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    router.push(data.session ? '/' : '/login');
  }

  return (
    <div style={{ ...palette, fontFamily: 'var(--font-body)', color: 'var(--ox-text)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box', background: 'linear-gradient(160deg, var(--ox-3) 0%, var(--ox-2) 45%, var(--ox-1) 100%)' }}>
      <div style={{ position: 'relative', border: '1px solid var(--ox-border)', borderRadius: 20, width: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.28)', overflow: 'hidden', background: 'var(--ox-panel)', backdropFilter: 'blur(20px)' }}>
        <div style={{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Image onClick={goHome} src="/assets/valpay-logo-transparent.png" alt="ValPay" width={110} height={40} style={{ height: 40, width: 'auto', display: 'block', cursor: 'pointer' }} />
            <span style={{ width: 1, height: 24, background: 'var(--ox-border)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--ox-text-dim)' }}>Roadmap Requests</span>
          </div>

          {status === 'checking' && (
            <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>Checking your reset link…</p>
          )}

          {status === 'invalid' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, letterSpacing: -0.4 }}>Link expired</div>
                <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>This reset link is invalid or has expired. Request a new one from the sign-in page.</p>
              </div>
              <a href="/login" style={{ background: 'transparent', color: 'var(--ox-text)', border: '1.5px solid var(--ox-cta-bg)', borderRadius: 'var(--radius-btn)', padding: '13px 20px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none' }}>Back to sign in</a>
            </>
          )}

          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, letterSpacing: -0.4 }}>Password updated</div>
              <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>Taking you to the app…</p>
            </div>
          )}

          {status === 'ready' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, letterSpacing: -0.4 }}>Set a new password</div>
                <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>Choose a new password for your account.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="body-sm" style={{ color: 'var(--ox-text-dim)', fontWeight: 600, letterSpacing: 0.3 }}>New password</span>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} onKeyDown={onKeyDown} placeholder="At least 8 characters" style={{ width: '100%', border: '1px solid var(--ox-border)', borderRadius: 12, padding: '13px 58px 13px 40px', fontSize: 14, fontFamily: 'var(--font-body)', background: 'rgba(0,0,0,0.14)', color: 'var(--ox-text)', outline: 'none', boxSizing: 'border-box' }} />
                    <button onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 12, background: 'transparent', border: 'none', color: 'var(--ox-text-faint)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 4 }}>{showPassword ? 'Hide' : 'Show'}</button>
                  </div>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="body-sm" style={{ color: 'var(--ox-text-dim)', fontWeight: 600, letterSpacing: 0.3 }}>Confirm new password</span>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} onKeyDown={onKeyDown} placeholder="Re-enter your password" style={{ width: '100%', border: '1px solid var(--ox-border)', borderRadius: 12, padding: '13px 13px 13px 40px', fontSize: 14, fontFamily: 'var(--font-body)', background: 'rgba(0,0,0,0.14)', color: 'var(--ox-text)', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </label>

                {error && <div className="body-sm" style={{ color: '#ff9b9b' }}>{error}</div>}
              </div>

              <button onClick={onSubmit} disabled={submitting} style={{ background: 'transparent', color: 'var(--ox-text)', border: '1.5px solid var(--ox-cta-bg)', borderRadius: 'var(--radius-btn)', padding: '13px 20px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, letterSpacing: 0.2, cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Updating…' : 'Update password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
