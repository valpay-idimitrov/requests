'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface Voter {
  email: string;
  role: string;
  weight: number;
}

interface RoadmapRequest {
  id: string;
  title: string;
  status: string;
  urgency: string;
  gmvLabel: string;
  gmvValue: number;
  partner: string;
  categories: string[];
  primaryCategory: string;
  audience: string[];
  created: string;
  votes: number;
  weightedVotes: number;
  submittedBy?: string;
  compliance?: boolean;
  description?: string;
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function initialsFor(email: string) {
  const name = (email || '').split('@')[0];
  const parts = name.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
function colorForEmail(email: string) {
  const h = hashStr(email || '') % 360;
  return 'hsl(' + h + ', 55%, 42%)';
}
// Visible weighting: a colored ring around the avatar signals seniority.
// Founders > CEO/CTO > dept heads > everyone else (no ring).
function ringColorForWeight(weight: number): string | undefined {
  if (weight >= 5) return '#f6d3ba'; // founder — gold
  if (weight >= 4) return '#9edcff'; // exec (CEO/CTO) — blue
  if (weight >= 2) return '#b6ffb0'; // dept head — green
  return undefined;
}
function roleLabel(role: string): string {
  switch (role) {
    case 'founder': return 'Founder';
    case 'ceo': return 'CEO';
    case 'cto': return 'CTO';
    case 'cfo': return 'CFO';
    case 'dept_head': return 'Head of Department';
    default: return '';
  }
}
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
}

type Theme = 'dark' | 'light';
const PALETTES: Record<Theme, Record<string, string>> = {
  dark: {
    '--ox-1': '#332a5c', '--ox-2': '#3c336c', '--ox-3': '#453c7d', '--ox-glow': '#8b7ac9',
    '--ox-panel': 'rgba(255,255,255,0.06)', '--ox-panel-strong': 'rgba(255,255,255,0.09)',
    '--ox-border': 'rgba(255,255,255,0.14)', '--ox-border-strong': 'rgba(255,255,255,0.24)',
    '--ox-text': '#FFFFFF', '--ox-text-dim': 'rgba(255,255,255,0.82)', '--ox-text-faint': 'rgba(255,255,255,0.58)',
    '--ox-accent': '#B3A3E8', '--ox-cta-bg': '#8B6FDB', '--ox-cta-text': '#FFFFFF',
    '--ox-shadow-cta': '0 10px 24px rgba(139,111,219,0.35)', '--ox-shadow-modal': '0 24px 64px rgba(0,0,0,0.28)', '--ox-shadow-card': '0 8px 24px rgba(0,0,0,0.18)'
  },
  light: {
    '--ox-1': '#FFFFFF', '--ox-2': '#F7FBF9', '--ox-3': '#EAF6EF', '--ox-glow': '#D8F0E3',
    '--ox-panel': 'rgba(23,33,74,0.04)', '--ox-panel-strong': 'rgba(23,33,74,0.07)',
    '--ox-border': 'rgba(23,33,74,0.12)', '--ox-border-strong': 'rgba(23,33,74,0.22)',
    '--ox-text': '#17214A', '--ox-text-dim': 'rgba(23,33,74,0.7)', '--ox-text-faint': 'rgba(23,33,74,0.48)',
    '--ox-accent': '#0F705F', '--ox-cta-bg': '#17214A', '--ox-cta-text': '#FFFFFF',
    '--ox-shadow-cta': '0 2px 8px rgba(15,33,74,0.08)', '--ox-shadow-modal': '0 8px 24px rgba(15,33,74,0.08)', '--ox-shadow-card': '0 1px 2px rgba(15,33,74,0.04)'
  }
};

const PAGE_SIZE = 10;

interface ParticleMeta {
  id: string; emoji: string; anchorLeft: string; anchorTop: string;
  dx: number; dy: number; rot: number; size: number; dur: number;
}
interface ParticleStyle { id: string; emoji: string; style: React.CSSProperties; }

type SortKey = 'newest' | 'impact' | 'votes';
type AuthMode = 'login' | 'signup';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export default function RoadmapPage() {
  const router = useRouter();
  const supabase = useRef(createClient()).current;
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [myEmail, setMyEmail] = useState('');
  const [requests, setRequests] = useState<RoadmapRequest[]>([]);
  const [voterLists, setVoterLists] = useState<Record<string, Voter[]>>({});
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('votes');
  const [complianceOnly, setComplianceOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'q3'>('requests');
  const [modalOpen, setModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formGmv, setFormGmv] = useState('');
  const [formCompliance, setFormCompliance] = useState(false);
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(0);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [particles, setParticles] = useState<ParticleStyle[]>([]);
  const [compliancePulsing, setCompliancePulsing] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordModalError, setPasswordModalError] = useState('');
  const [passwordModalSuccess, setPasswordModalSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const USER_OPTIONS = [
    'blake.rouse@valpay.com','cameron.hutchinson@valpay.com','carly.jackson@valpay.com','elie.dimitri@valpay.com',
    'ethan.savage@valpay.com','izabela.cyranowicz@valpay.com','joshua.leopardi@valpay.com','kenneth.fallon@valpay.com',
    'matthew.georges@valpay.com','matthew.gottlieb@valpay.com','meagan.love@valpay.com','melissa.good@valpay.com',
    'm.bourassa@valsoftcorp.com','raphael.gad@valpay.com','tarek.kazak@valpay.com','tristan.gauthier@valpay.com',
    'youssef.maamoun@valpay.com','ivo.dimitrov@valpay.com'
  ];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [userMenuOpen]);

  const particlesMetaRef = useRef<ParticleMeta[]>([]);
  const animStartRef = useRef(0);
  const particleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const complianceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setMyEmail(data.user.email);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setMyEmail(session.user.email);
        setStatus('authenticated');
      } else {
        setMyEmail('');
        setStatus('unauthenticated');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  async function loadRequests() {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/requests');
      if (!res.ok) return;
      const data: { requests: (RoadmapRequest & { voters: Voter[] })[] } = await res.json();
      const voters: Record<string, Voter[]> = {};
      data.requests.forEach(r => { voters[r.id] = r.voters; });
      setRequests(data.requests);
      setVoterLists(voters);
    } finally {
      setLoadingRequests(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated') loadRequests();
  }, [status]);

  function computeParticleStyles(): ParticleStyle[] {
    const elapsed = Date.now() - animStartRef.current;
    return particlesMetaRef.current.map(p => {
      const progress = Math.max(0, Math.min(1, elapsed / p.dur));
      const ease = 1 - Math.pow(1 - progress, 3);
      const curDx = p.dx * ease;
      const curDy = p.dy * ease;
      const scale = 1 - 0.5 * ease;
      const rot = p.rot * ease;
      const opacity = 1 - progress;
      return {
        id: p.id,
        emoji: p.emoji,
        style: {
          position: 'absolute', left: p.anchorLeft, top: p.anchorTop, fontSize: p.size,
          pointerEvents: 'none', zIndex: 5, opacity,
          transform: `translate(-50%, -50%) translate(${curDx.toFixed(1)}px, ${curDy.toFixed(1)}px) scale(${scale.toFixed(2)}) rotate(${rot.toFixed(1)}deg)`
        }
      };
    });
  }

  function spawnParticles(emojis: string[], e: React.MouseEvent, opts: Partial<{ count: number; distMin: number; distRange: number; sizeMin: number; sizeRange: number }> = {}) {
    const count = opts.count ?? 14;
    const distMin = opts.distMin ?? 55;
    const distRange = opts.distRange ?? 65;
    const sizeMin = opts.sizeMin ?? 15;
    const sizeRange = opts.sizeRange ?? 9;
    let anchorLeft = '50%';
    let anchorTop = '50%';
    const target = e.currentTarget as HTMLElement;
    if (target && target.parentElement) {
      const btnRect = target.getBoundingClientRect();
      const contRect = target.parentElement.getBoundingClientRect();
      anchorLeft = Math.round(btnRect.left - contRect.left + btnRect.width / 2) + 'px';
      anchorTop = Math.round(btnRect.top - contRect.top + btnRect.height / 2) + 'px';
    }
    const meta: ParticleMeta[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = distMin + Math.random() * distRange;
      meta.push({
        id: 'mp-' + Date.now() + '-' + i + '-' + Math.round(Math.random() * 1e6),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        anchorLeft, anchorTop,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 35,
        rot: Math.random() * 360 - 180,
        size: sizeMin + Math.random() * sizeRange,
        dur: 700 + Math.random() * 350
      });
    }
    particlesMetaRef.current = meta;
    animStartRef.current = Date.now();
    setParticles(computeParticleStyles());
    if (particleIntervalRef.current) clearInterval(particleIntervalRef.current);
    particleIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - animStartRef.current;
      const maxDur = Math.max(...particlesMetaRef.current.map(p => p.dur));
      if (elapsed >= maxDur) {
        if (particleIntervalRef.current) clearInterval(particleIntervalRef.current);
        particleIntervalRef.current = null;
        setParticles([]);
      } else {
        setParticles(computeParticleStyles());
      }
    }, 30);
  }

  async function toggleVote(id: string) {
    if (!myEmail) {
      setAuthModalOpen(true);
      setAuthMode('login');
      return;
    }
    // Optimistic update, reconciled with the server response below. The
    // placeholder role/weight for "me" here is a guess (corrected the
    // instant the server responds) — good enough for the brief flash
    // before the real response lands.
    const prevVoters = voterLists[id] || [];
    const prevWeighted = prevVoters.reduce((sum, v) => sum + v.weight, 0);
    const willVote = !prevVoters.some(v => v.email === myEmail);
    const optimisticVoters = willVote
      ? [...prevVoters, { email: myEmail, role: 'member', weight: 1 }]
      : prevVoters.filter(v => v.email !== myEmail);
    const optimisticWeighted = optimisticVoters.reduce((sum, v) => sum + v.weight, 0);
    setVoterLists(prev => ({ ...prev, [id]: optimisticVoters }));
    setRequests(rs => rs.map(r => (r.id === id ? { ...r, votes: optimisticVoters.length, weightedVotes: optimisticWeighted } : r)));

    try {
      const res = await fetch(`/api/requests/${id}/vote`, { method: 'POST' });
      if (!res.ok) throw new Error('vote failed');
      const data: { votes: number; weightedVotes: number; voters: Voter[] } = await res.json();
      setVoterLists(prev => ({ ...prev, [id]: data.voters }));
      setRequests(rs => rs.map(r => (r.id === id ? { ...r, votes: data.votes, weightedVotes: data.weightedVotes } : r)));
    } catch {
      // Roll back on failure.
      setVoterLists(prev => ({ ...prev, [id]: prevVoters }));
      setRequests(rs => rs.map(r => (r.id === id ? { ...r, votes: prevVoters.length, weightedVotes: prevWeighted } : r)));
    }
  }

  function toggleCompliance() {
    const next = !complianceOnly;
    setComplianceOnly(next);
    setPage(0);
    setCompliancePulsing(true);
    if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
    complianceTimerRef.current = setTimeout(() => setCompliancePulsing(false), 900);
  }

  async function submitForm() {
    if (!formTitle.trim()) { setFormError('Please add a title.'); return; }
    if (!formDesc.trim()) { setFormError('Please add a description.'); return; }
    const gmvRaw = (formGmv || '').replace(/[^0-9.]/g, '');
    const gmvValue = gmvRaw ? Math.round(parseFloat(gmvRaw)) : 0;
    const gmvLabel = gmvValue > 0 ? '$' + (gmvValue >= 1000000 ? (gmvValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' : gmvValue.toLocaleString()) : '';

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle.trim(), description: formDesc.trim(), gmvValue, gmvLabel, compliance: formCompliance })
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Something went wrong.'); return; }
      const newReq = data.request as RoadmapRequest & { voters: Voter[] };
      setRequests(rs => [newReq, ...rs]);
      setVoterLists(prev => ({ ...prev, [newReq.id]: newReq.voters }));
      setModalOpen(false);
      setFormTitle(''); setFormDesc(''); setFormGmv(''); setFormCompliance(false); setFormError('');
      setPage(0);
    } catch {
      setFormError('Something went wrong. Try again.');
    }
  }

  function logOut() {
    supabase.auth.signOut().then(() => router.push('/login'));
  }

  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [descriptionSaving, setDescriptionSaving] = useState(false);
  const [descriptionError, setDescriptionError] = useState('');

  async function saveDescription(id: string) {
    const trimmed = descriptionDraft.trim();
    if (!trimmed) { setDescriptionError('Description cannot be empty.'); return; }
    setDescriptionSaving(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: trimmed })
      });
      const data = await res.json();
      setDescriptionSaving(false);
      if (!res.ok) { setDescriptionError(data.error || 'Something went wrong.'); return; }
      setRequests(rs => rs.map(r => (r.id === id ? { ...r, description: trimmed } : r)));
      setEditingDescription(false);
      setDescriptionError('');
    } catch {
      setDescriptionSaving(false);
      setDescriptionError('Something went wrong. Try again.');
    }
  }

  const palette = PALETTES[theme];
  const rootStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', color: 'var(--ox-text)', minHeight: '100vh', display: 'flex',
    flexDirection: 'column',
    background: 'radial-gradient(ellipse 1100px 900px at 78% 0%, var(--ox-glow) 0%, var(--ox-3) 32%, var(--ox-2) 62%, var(--ox-1) 100%)',
    ...(palette as React.CSSProperties)
  };

  let filtered = requests.filter(r => {
    if (userFilter && r.submittedBy !== userFilter) return false;
    if (complianceOnly && !r.compliance) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sortKey === 'votes') filtered = [...filtered].sort((a, b) => b.weightedVotes - a.weightedVotes || b.votes - a.votes || b.gmvValue - a.gmvValue);
  else if (sortKey === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  else if (sortKey === 'impact') filtered = [...filtered].sort((a, b) => b.gmvValue - a.gmvValue);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const sortTabs: { key: SortKey; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'impact', label: 'Money Talks' },
    { key: 'votes', label: "People's Choice" }
  ];

  const q3Requests = [...requests].sort((a, b) => b.votes - a.votes).slice(0, 5);
  const detailReq = requests.find(r => r.id === detailId);
  const detailVoters = detailReq ? voterLists[detailReq.id] || [] : [];
  const gmvCount = requests.filter(r => r.gmvValue >= 1000000).length;
  const complianceCount = requests.filter(r => r.compliance).length;

  async function savePassword() {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setPasswordModalError('Fill in every field.');
      return;
    }
    if (newPassword !== confirmNewPassword) { setPasswordModalError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setPasswordModalError('New password must be at least 8 characters.'); return; }
    setPasswordSaving(true);

    // Re-verify the current password by attempting a fresh sign-in before
    // changing it — Supabase's updateUser() trusts the existing session and
    // doesn't ask for the old password on its own.
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email: myEmail, password: currentPassword });
    if (verifyError) {
      setPasswordSaving(false);
      setPasswordModalError('Current password is incorrect.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSaving(false);
    if (updateError) {
      setPasswordModalError(updateError.message || 'Something went wrong.');
      return;
    }
    setPasswordModalError('');
    setPasswordModalSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ ...rootStyle, alignItems: 'center', justifyContent: 'center' }}>
        <span className="body-sm" style={{ color: 'var(--ox-text-faint)' }}>Loading…</span>
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      <header style={{ padding: '56px 32px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ maxWidth: 720, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src={theme === 'dark' ? '/assets/valpay-logo-transparent.png' : '/assets/valpay-logo-navy.png'}
              alt="ValPay" width={110} height={32} style={{ height: 32, width: 'auto', display: 'block' }}
            />
            <span style={{ width: 1, height: 20, background: 'var(--ox-border-strong)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--ox-text)' }}>Roadmap</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              {myEmail ? (
                <>
                  <div onClick={() => { setPasswordModalOpen(true); setNewPassword(''); setConfirmNewPassword(''); setPasswordModalError(''); setPasswordModalSuccess(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--ox-border)', background: 'var(--ox-panel)', borderRadius: 'var(--radius-btn)', padding: 4, cursor: 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: colorForEmail(myEmail), color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initialsFor(myEmail)}</div>
                    <span className="body-xs" style={{ color: 'var(--ox-text-dim)', paddingRight: 4 }}>{myEmail}</span>
                  </div>
                  <button onClick={logOut} style={btnOutline}>Log out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthModalOpen(true); setAuthMode('login'); }} style={btnOutline}>Log in</button>
                  <button onClick={() => { setAuthModalOpen(true); setAuthMode('signup'); }} style={btnCta}>Sign up</button>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 48 }}>
            <h1 style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', fontSize: 54, fontWeight: 400, lineHeight: 1.12, letterSpacing: -1, margin: 0, textShadow: '1.5px 0 0 rgba(120,200,220,0.35), -1.5px 0 0 rgba(255,120,90,0.25)' }}>Vote on what we build next.</h1>
            <p className="body-md" style={{ color: 'var(--ox-text-dim)', margin: 0, fontSize: 19, lineHeight: 1.5 }}>Every idea below came from a partner ticket, a support thread, or the team. Upvote the ones that matter most to you, or submit a new request.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'nowrap' }}>
            <button
              style={{ flexShrink: 0, background: 'transparent', color: 'var(--ox-text)', border: '1.5px solid var(--ox-cta-bg)', borderRadius: 'var(--radius-btn)', padding: '11px 22px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition-all)' }}
              onClick={() => {
                if (!myEmail) { setAuthModalOpen(true); setAuthMode('signup'); return; }
                setModalOpen(true); setFormError('');
              }}
            >
              Submit a request
            </button>
            <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', marginLeft: 'auto', flexWrap: 'nowrap', height: 40, boxSizing: 'border-box' }}>
              <div style={statCard()}><span style={statNum()}>{requests.length}</span><span style={statLabel()}>Open requests</span></div>
              <div style={statCard()}><span style={statNum()}>{requests.reduce((s, r) => s + r.weightedVotes, 0)}</span><span style={statLabel()}>Votes cast</span></div>
              <div style={statCard('#6bc49f')}><span style={statNum('#6bc49f')}>{gmvCount}</span><span style={statLabel('#6bc49f')}>High GMV</span></div>
              <div style={statCard('#ff6b6b')}><span style={statNum('#ff6b6b')}>{complianceCount}</span><span style={statLabel('#ff6b6b')}>Compliance</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, borderBottom: '1px solid var(--ox-border)', marginTop: 36 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', width: 'auto', flexShrink: 0, borderBottom: '2px solid transparent' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ox-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(calc(-50% - 6px))', pointerEvents: 'none' }}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input
                type="text" placeholder="Search requests..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                style={{ border: 'none', borderRadius: 0, padding: '0 0 12px 24px', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-body)', width: '32ch', height: '100%', boxSizing: 'content-box', background: 'transparent', color: 'var(--ox-text)', transition: 'var(--transition-all)', outline: 'none' }}
              />
            </div>
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${userFilter ? 'var(--ox-accent)' : 'transparent'}`, color: userFilter ? 'var(--ox-text)' : 'var(--ox-text-faint)', padding: '0 0 12px', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'var(--transition-all)', whiteSpace: 'nowrap' }}
              >
                {userFilter || 'Select user'}
                <svg width="9" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 6, display: 'inline-block', verticalAlign: 'middle' }}><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {userMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'var(--ox-2)', border: '1px solid var(--ox-border-strong)', borderRadius: 12, boxShadow: 'var(--ox-shadow-modal)', padding: 6, width: 'max-content', minWidth: '100%', boxSizing: 'border-box', maxHeight: 280, overflowY: 'scroll', zIndex: 20, whiteSpace: 'nowrap' }}>
                  <div onClick={() => { setUserFilter(''); setUserMenuOpen(false); setPage(0); }} style={userMenuItem}>All users</div>
                  {USER_OPTIONS.map(email => (
                    <div key={email} onClick={() => { setUserFilter(email); setUserMenuOpen(false); setPage(0); setActiveTab('requests'); setComplianceOnly(false); }} style={userMenuItem}>{email}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{ padding: '48px 32px 96px', flex: 1, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0.32) 100%)' }}>
        <div style={{ maxWidth: 720, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activeTab === 'requests' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', paddingTop: 6 }}>
                <div style={{ position: 'relative', display: 'flex', gap: 4, padding: 5, height: 48, boxSizing: 'border-box', background: 'var(--ox-panel)', border: '1px solid var(--ox-border)', borderRadius: 'var(--radius-btn)', width: 'fit-content' }}>
                  {sortTabs.map(t => (
                    <button
                      key={t.key}
                      onClick={e => {
                        setSortKey(t.key); setPage(0); setComplianceOnly(false); setUserFilter('');
                        if (t.key === 'impact') spawnParticles(['💰', '💵', '💸', '💯'], e, { count: 46, distMin: 90, distRange: 170, sizeMin: 28, sizeRange: 26 });
                        if (t.key === 'votes') spawnParticles(['🏆', '⭐', '👍', '❤️'], e);
                        if (t.key === 'newest') spawnParticles(['✨', '🆕', '⚡', '🌟'], e);
                      }}
                      style={{
                        whiteSpace: 'nowrap', borderRadius: 'var(--radius-btn)', padding: '0 18px', height: '100%',
                        display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'var(--font-body)', transition: 'var(--transition-all)',
                        border: sortKey === t.key ? '2px solid var(--ox-cta-bg)' : '2px solid transparent',
                        background: sortKey === t.key ? 'rgba(139,111,219,0.14)' : 'transparent',
                        color: sortKey === t.key ? 'var(--ox-text)' : 'var(--ox-text-dim)'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                  {particles.map(p => <span key={p.id} style={p.style}>{p.emoji}</span>)}
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, width: 'fit-content' }}>
                  {compliancePulsing && (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', animation: 'rmArrowBounce 0.5s ease-in-out infinite', pointerEvents: 'none' }}><path d="M12 4v14M6 12l6 6 6-6" /></svg>
                  )}
                  <button
                    onClick={() => {
                      const next = !complianceOnly;
                      setComplianceOnly(next); setUserFilter(''); setPage(0);
                      setCompliancePulsing(true);
                      if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
                      complianceTimerRef.current = setTimeout(() => setCompliancePulsing(false), 900);
                    }}
                    style={{
                      whiteSpace: 'nowrap', flexShrink: 0, height: 36, padding: '0 14px', borderRadius: 'var(--radius-btn)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
                      transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                      border: complianceOnly ? '1px solid #ff6b6b' : '1.5px solid #ff6b6b',
                      background: complianceOnly ? '#ff6b6b' : 'transparent',
                      color: complianceOnly ? '#2a1108' : '#ff6b6b',
                      animation: compliancePulsing ? 'rmCompliancePulse 0.45s ease-out' : undefined
                    }}
                  >
                    Compliance
                  </button>
                </div>
              </div>

              {pageItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pageItems.map(req => {
                    const voters = voterLists[req.id] || [];
                    const voted = !!(myEmail && voters.some(v => v.email === myEmail));
                    // Highest-weight voters shown first so leadership badges surface even
                    // when there are more than 5 voters.
                    const shown = [...voters].sort((a, b) => b.weight - a.weight).slice(0, 5);
                    const overflowCount = voters.length - shown.length;
                    const showImpact = req.gmvValue >= 1000000;
                    return (
                      <div
                        key={req.id}
                        onClick={() => { setDetailId(req.id); setEditingDescription(false); setDescriptionError(''); }}
                        style={{ background: 'var(--ox-panel)', border: '1px solid var(--ox-border)', borderRadius: 20, padding: '20px 22px', display: 'flex', gap: 18, alignItems: 'flex-start', animation: 'rmFadeIn 0.35s var(--ease-out)', backdropFilter: 'blur(6px)', boxShadow: 'var(--ox-shadow-card)', cursor: 'pointer', transition: 'background 0.24s var(--ease-out), border-color 0.24s var(--ease-out), transform 0.24s var(--ease-out)' }}
                      >
                        <button
                          onClick={e => { e.stopPropagation(); toggleVote(req.id); }}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                            width: 52, height: 52, flex: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            fontFamily: 'var(--font-body)', transition: 'var(--transition-all)',
                            border: `1px solid ${voted ? 'var(--ox-cta-bg)' : 'var(--ox-border)'}`,
                            background: voted ? 'rgba(139,111,219,0.14)' : 'var(--ox-panel-strong)'
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={voted ? 'var(--ox-cta-bg)' : 'var(--ox-text-dim)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ox-text)' }}>{req.weightedVotes}</span>
                        </button>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0, flex: 1 }}>
                          <div style={{ margin: 0, color: 'var(--ox-text)', fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{req.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            {voters.length > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                {shown.map((voter, i) => {
                                  const ring = ringColorForWeight(voter.weight);
                                  const label = roleLabel(voter.role);
                                  return (
                                    <div key={voter.email} className="rm-tip" style={{ width: 24, height: 24, borderRadius: '50%', background: colorForEmail(voter.email), color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: ring ? `2px solid ${ring}` : '2px solid var(--ox-2)', marginLeft: i === 0 ? 0 : -8, position: 'relative', zIndex: shown.length - i }}>
                                      {initialsFor(voter.email)}
                                      <span className="rm-tip-bubble">{voter.email}{label ? ` · ${label}` : ''}</span>
                                    </div>
                                  );
                                })}
                                {overflowCount > 0 && (
                                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ox-panel-strong)', color: 'var(--ox-text-dim)', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--ox-2)', marginLeft: -8, position: 'relative' }}>
                                    +{overflowCount}
                                  </div>
                                )}
                              </div>
                            )}
                            {req.submittedBy && (
                              <div className="rm-tip" style={{ width: 24, height: 24, borderRadius: '50%', background: colorForEmail(req.submittedBy), color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                {initialsFor(req.submittedBy)}
                                <span className="rm-tip-bubble">{req.submittedBy}</span>
                              </div>
                            )}
                            {req.weightedVotes !== req.votes && (
                              <span style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--ox-text-faint)', fontSize: 11, fontWeight: 700, letterSpacing: 0.3, padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>{req.votes} raw vote{req.votes === 1 ? '' : 's'}</span>
                            )}
                            {showImpact && <span style={{ background: 'rgba(107,196,159,0.16)', color: '#6bc49f', fontSize: 11, fontWeight: 700, letterSpacing: 0.3, padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>GMV {req.gmvLabel}</span>}
                            {req.compliance && <span style={{ background: 'rgba(255,107,107,0.16)', color: '#ff6b6b', fontSize: 11, fontWeight: 700, letterSpacing: 0.3, padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>Compliance</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ox-text-faint)' }}>
                  <div className="h5" style={{ color: 'var(--ox-text-dim)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>No requests match your filters</div>
                  <p className="body-sm">Try a different category or search term.</p>
                </div>
              )}

              {filtered.length > PAGE_SIZE && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 8 }}>
                  <span className="body-sm" style={{ color: 'var(--ox-text-faint)' }}>Page {currentPage + 1} of {totalPages} — {filtered.length} requests</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button disabled={currentPage === 0} onClick={() => setPage(Math.max(0, currentPage - 1))} style={pagerBtn(currentPage === 0)}>Previous</button>
                    <button disabled={currentPage >= totalPages - 1} onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))} style={pagerBtn(currentPage >= totalPages - 1)}>Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <footer style={{ padding: '24px 32px 40px', textAlign: 'center' }}>
        <span className="body-xs" style={{ color: 'var(--ox-text-faint)' }}>© 2026 ValPay. All rights reserved.</span>
      </footer>

      {modalOpen && (
        <div style={overlayStyle} onClick={() => setModalOpen(false)}>
          <div style={{ ...panelStyle, maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div className="h4" style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', margin: 0 }}>Submit a new request</div>
              <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>Tell us what you need and we'll add it to the board.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span className="body-xs" style={{ color: 'var(--ox-text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Title <span style={{ color: '#ff6b6b' }}>*</span></span>
                <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Bulk export for chargeback data" style={fieldStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span className="body-xs" style={{ color: 'var(--ox-text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Description <span style={{ color: '#ff6b6b' }}>*</span></span>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What problem does this solve?" rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span className="body-xs" style={{ color: 'var(--ox-text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Estimated GMV (optional)</span>
                <input type="text" value={formGmv} onChange={e => setFormGmv(e.target.value)} placeholder="e.g. 2500000" style={fieldStyle} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
                <input type="checkbox" checked={formCompliance} onChange={e => setFormCompliance(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--ox-accent)', border: '1px solid var(--ox-border)', cursor: 'pointer' }} />
                <span className="body-sm" style={{ color: 'var(--ox-text-dim)' }}>This is a compliance-related request</span>
              </label>
            </div>
            {formError && <div className="body-sm" style={{ color: '#ff9b9b', margin: '-8px 0 0' }}>{formError}</div>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--ox-border)', marginTop: 2, paddingTop: 18 }}>
              <button onClick={() => setModalOpen(false)} style={btnCancel}>Cancel</button>
              <button onClick={submitForm} style={btnCta}>Submit request</button>
            </div>
          </div>
        </div>
      )}

      {detailReq && (
        <div style={{ ...overlayStyle, zIndex: 55 }} onClick={() => { setDetailId(null); setEditingDescription(false); }}>
          <div style={{ ...panelStyle, maxWidth: 520, maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {detailReq.compliance && <span style={{ background: 'rgba(255,107,107,0.16)', color: '#ff6b6b', fontSize: 11, fontWeight: 700, letterSpacing: 0.3, padding: '3px 10px', borderRadius: 'var(--radius-pill)', width: 'fit-content' }}>Compliance</span>}
                <div className="h5" style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', margin: 0 }}>{detailReq.title}</div>
              </div>
              <button onClick={() => { setDetailId(null); setEditingDescription(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--ox-text-faint)', fontSize: 20, lineHeight: 1, cursor: 'pointer', padding: 4 }}>×</button>
            </div>
            {editingDescription ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <textarea
                  value={descriptionDraft}
                  onChange={e => { setDescriptionDraft(e.target.value); setDescriptionError(''); }}
                  rows={4}
                  style={{ ...fieldStyle, resize: 'vertical' }}
                />
                {descriptionError && <div className="body-sm" style={{ color: '#ff9b9b' }}>{descriptionError}</div>}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => { setEditingDescription(false); setDescriptionError(''); }} style={btnCancel}>Cancel</button>
                  <button onClick={() => saveDescription(detailReq.id)} disabled={descriptionSaving} style={{ ...btnCta, opacity: descriptionSaving ? 0.7 : 1, cursor: descriptionSaving ? 'default' : 'pointer' }}>{descriptionSaving ? 'Saving…' : 'Save'}</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {detailReq.description && <p className="body-sm" style={{ color: 'var(--ox-text-dim)', margin: 0, whiteSpace: 'pre-wrap' }}>{detailReq.description}</p>}
                <button
                  onClick={() => { setDescriptionDraft(detailReq.description || ''); setEditingDescription(true); setDescriptionError(''); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--ox-text-faint)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, width: 'fit-content', textDecoration: 'underline' }}
                >
                  Edit description
                </button>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--ox-border)', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: colorForEmail(detailReq.submittedBy || ''), color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  {detailReq.submittedBy ? initialsFor(detailReq.submittedBy) : '?'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="body-xs" style={{ color: 'var(--ox-text-faint)' }}>Submitted by</span>
                  <span className="body-sm" style={{ color: 'var(--ox-text)', fontWeight: 600 }}>{detailReq.submittedBy || 'Unknown'}</span>
                </div>
              </div>
              {detailReq.gmvValue >= 1000000 && (
                <div><span className="body-xs" style={{ color: 'var(--ox-text-faint)', display: 'block' }}>Estimated GMV</span><span className="body-sm" style={{ color: 'var(--ox-text-dim)' }}>{detailReq.gmvLabel}</span></div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--ox-border)', paddingTop: 16 }}>
              <span className="body-xs" style={{ color: 'var(--ox-text-faint)' }}>
                {detailReq.weightedVotes} vote(s){detailReq.weightedVotes !== detailReq.votes ? ` (${detailReq.votes} raw vote${detailReq.votes === 1 ? '' : 's'})` : ''}
              </span>
              {detailVoters.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[...detailVoters].sort((a, b) => b.weight - a.weight).map(voter => {
                    const ring = ringColorForWeight(voter.weight);
                    const label = roleLabel(voter.role);
                    return (
                      <div key={voter.email} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: colorForEmail(voter.email), color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', border: ring ? `2px solid ${ring}` : undefined }}>{initialsFor(voter.email)}</div>
                        <span className="body-sm" style={{ color: 'var(--ox-text-dim)' }}>{voter.email}</span>
                        {label && <span className="body-xs" style={{ color: 'var(--ox-text-faint)', fontWeight: 600 }}>{label}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {authModalOpen && (
        <div style={{ ...overlayStyle, zIndex: 60 }} onClick={() => setAuthModalOpen(false)}>
          <div style={{ ...panelStyle, maxWidth: 380, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div className="h5" style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', margin: 0 }}>Sign in required</div>
              <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>{authMode === 'signup' ? "Create an account so your votes and requests are attributed to you." : 'Log in with your ValPay email to continue.'}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setAuthModalOpen(false)} style={btnCancel}>Cancel</button>
              <button onClick={() => router.push(authMode === 'signup' ? '/signup' : '/login')} style={btnCta}>{authMode === 'signup' ? 'Sign up' : 'Log in'}</button>
            </div>
          </div>
        </div>
      )}

      {passwordModalOpen && (
        <div style={{ ...overlayStyle, zIndex: 60 }} onClick={() => setPasswordModalOpen(false)}>
          <div style={{ ...panelStyle, maxWidth: 380, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div className="h5" style={{ color: 'var(--ox-text)', fontFamily: 'var(--font-display)', margin: 0 }}>Change password</div>
              <p className="body-sm" style={{ color: 'var(--ox-text-faint)', margin: 0 }}>Update the password for {myEmail}.</p>
            </div>
            <input type="password" value={currentPassword} onChange={e => { setCurrentPassword(e.target.value); setPasswordModalError(''); setPasswordModalSuccess(false); }} placeholder="Current password" style={fieldStyle} />
            <input type="password" value={newPassword} onChange={e => { setNewPassword(e.target.value); setPasswordModalError(''); setPasswordModalSuccess(false); }} placeholder="New password" style={fieldStyle} />
            <input type="password" value={confirmNewPassword} onChange={e => { setConfirmNewPassword(e.target.value); setPasswordModalError(''); setPasswordModalSuccess(false); }} placeholder="Confirm new password" style={fieldStyle} />
            {passwordModalError && <div className="body-sm" style={{ color: '#ff9b9b', margin: '-8px 0 0' }}>{passwordModalError}</div>}
            {passwordModalSuccess && <div className="body-sm" style={{ color: '#6bc49f', margin: '-8px 0 0' }}>Password updated.</div>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setPasswordModalOpen(false)} style={btnCancel}>Cancel</button>
              <button onClick={savePassword} disabled={passwordSaving} style={{ ...btnCta, opacity: passwordSaving ? 0.7 : 1, cursor: passwordSaving ? 'default' : 'pointer' }}>{passwordSaving ? 'Saving…' : 'Save password'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnOutline: React.CSSProperties = { border: '1px solid var(--ox-border)', background: 'transparent', color: 'var(--ox-text-dim)', borderRadius: 'var(--radius-btn)', padding: '6px 14px', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 };
const btnCta: React.CSSProperties = { background: 'transparent', color: 'var(--ox-text)', border: '1.5px solid var(--ox-cta-bg)', borderRadius: 'var(--radius-btn)', padding: '10px 20px', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'var(--transition-all)' };
const btnCancel: React.CSSProperties = { background: 'transparent', border: '1px solid var(--ox-border)', color: 'var(--ox-text-dim)', borderRadius: 'var(--radius-btn)', padding: '10px 18px', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'var(--transition-all)' };
const fieldStyle: React.CSSProperties = { border: '1px solid var(--ox-border)', borderRadius: 10, padding: '11px 13px', fontSize: 14, fontFamily: 'var(--font-body)', background: 'var(--ox-panel)', color: 'var(--ox-text)', outline: 'none', transition: 'var(--transition-all)' };
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(10,4,3,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24, animation: 'rmFadeIn 0.2s var(--ease-out)' };
const panelStyle: React.CSSProperties = { background: 'var(--ox-2)', border: '1px solid var(--ox-border-strong)', borderRadius: 20, padding: 32, width: '100%', boxShadow: 'var(--ox-shadow-modal)', display: 'flex', flexDirection: 'column', gap: 18, animation: 'rmModalIn 0.25s var(--ease-out)' };
function pagerBtn(disabled: boolean): React.CSSProperties {
  return { padding: '9px 18px', borderRadius: 'var(--radius-btn)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, cursor: disabled ? 'default' : 'pointer', transition: 'var(--transition-all)', border: '1px solid var(--ox-border)', background: 'var(--ox-panel)', color: disabled ? 'var(--ox-text-faint)' : 'var(--ox-text)', opacity: disabled ? 0.5 : 1 };
}
const userMenuItem: React.CSSProperties = { padding: '8px 10px', borderRadius: 8, fontSize: 13, color: 'var(--ox-text-dim)', cursor: 'pointer' };
function statCard(tint?: string): React.CSSProperties {
  return {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
    padding: '0 14px', height: '100%', boxSizing: 'border-box', borderRadius: 10,
    border: `1px solid ${tint ? hexToRgba(tint, 0.15) : 'var(--ox-border)'}`,
    background: tint ? hexToRgba(tint, 0.04) : 'var(--ox-panel)'
  };
}
function statNum(color?: string): React.CSSProperties {
  return { color: color || 'var(--ox-text-dim)', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1, textAlign: 'center', opacity: color ? 0.55 : 1 };
}
function statLabel(color?: string): React.CSSProperties {
  return { color: color || 'var(--ox-text-faint)', fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', whiteSpace: 'nowrap', textAlign: 'center', opacity: color ? 0.45 : 0.75 };
}
function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
