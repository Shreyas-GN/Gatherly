'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';


const MarqueeStrip = dynamic(() => import('@/components/MarqueeStrip'), { ssr: false });
const ArchitecturalSteps = dynamic(() => import('@/components/ArchitecturalSteps'), { ssr: false });

/* ─── Wobbly G logo ────────────────────────────────── */
function WobblyG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 3 16 C 3.2 7.8, 8.5 3.1, 16.3 3 C 24.1 2.9, 29.2 8.2, 29 16.1 C 28.8 22.8, 24.5 28.3, 16.2 29 C 10.1 29.5, 5.2 26.1, 3 21"
        stroke="#C2491D"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <text x="9.5" y="21" fontFamily="var(--font-space), sans-serif" fontSize="14" fontWeight="700" fill="#C2491D">G</text>
    </svg>
  );
}

/* ─── Hero words with stagger ──────────────────────── */
const HERO_LINES = ['Stop emailing', 'spreadsheets', 'to strangers.'];



export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen"
      style={{ background: '#F5F0EB', color: '#1A1612' }}
    >
      {/* ── NAV ─────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: 'rgba(245, 240, 235, 0.85)', backdropFilter: 'blur(12px)', borderColor: '#EDE8E1' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <WobblyG />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-space), sans-serif', color: '#1A1612' }}
            >
              Gatherly
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-8 pr-0">
            <a href="#how-it-works" className="nav-link text-sm font-medium" style={{ color: '#8A837A' }}>
              How it works
            </a>
            <a href="#story" className="nav-link text-sm font-medium" style={{ color: '#8A837A' }}>
              The story
            </a>
            <Link href="/dashboard" className="nav-link text-sm font-semibold" style={{ color: '#1A1612' }}>
              Dashboard →
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-0">
            {/* Left — text block */}
            <div className="flex-1 lg:pr-8">
              {/* Eyebrow */}
              <p
                className="text-xs font-semibold tracking-widest mb-8 uppercase"
                style={{ color: '#8A837A', fontFamily: 'var(--font-space), sans-serif' }}
              >
                Volunteer Coordination Software
              </p>

              {/* Main heading — word stagger */}
              <h1
                className="mb-8 leading-[0.95]"
                style={{
                  fontFamily: 'var(--font-space), sans-serif',
                  fontSize: 'clamp(3.2rem, 7vw, 6.5rem)',
                  fontWeight: 700,
                  color: '#1A1612',
                  letterSpacing: '-0.02em',
                }}
              >
                {HERO_LINES.map((line, li) => (
                  <span key={li} className="block">
                    {line.split(' ').map((word, wi) => (
                      <span
                        key={wi}
                        className="word-anim inline-block mr-[0.22em]"
                        style={{ animationDelay: `${(li * 3 + wi) * 110}ms` }}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              {/* Subtext */}
              <p
                className="text-lg leading-relaxed mb-10 max-w-[480px]"
                style={{ color: '#8A837A' }}
              >
                Gatherly matches volunteers to events by skill, sends the invites, tracks the RSVPs,
                and tells you when you&rsquo;re full. You just show up.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/dashboard" className="btn-primary">
                  Open the dashboard →
                </Link>
                <Link
                  href="/events/create"
                  className="inline-flex items-center gap-2 text-sm font-medium mt-1 sm:mt-3"
                  style={{ color: '#8A837A' }}
                >
                  or create an event
                </Link>
              </div>

              <p className="text-xs mt-4" style={{ color: '#8A837A' }}>
                No signup. It just works.
              </p>
            </div>

            {/* Right — floating event card */}
            <div className="lg:w-[42%] flex-shrink-0 mt-8 lg:mt-16">
              <div
                className="animate-cardSettle rounded-xl p-6 relative"
                style={{
                  background: '#EDE8E1',
                  borderLeft: '3px solid #C2491D',
                  boxShadow: '8px 16px 48px rgba(26,22,18,0.12)',
                  transform: 'rotate(2deg)',
                }}
              >
                {/* Status dot */}
                <div className="flex items-center gap-2.5 mb-5">
                  <span
                    className="w-2.5 h-2.5 rounded-full pulse-dot"
                    style={{ background: '#BFFF00' }}
                  />
                  <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#8A837A' }}>
                    Open · 4 of 12 filled
                  </span>
                </div>

                {/* Event name */}
                <h3
                  className="font-bold mb-1 uppercase tracking-tight text-xl"
                  style={{ fontFamily: 'var(--font-space), sans-serif', color: '#1A1612' }}
                >
                  Riverside Park Cleanup
                </h3>
                <p className="text-sm mb-1" style={{ color: '#8A837A' }}>Apr 15, 2026 · 9:00 AM</p>
                <p className="text-sm mb-5" style={{ color: '#8A837A' }}>Skills: Landscaping, Driving, First Aid</p>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#D6CFC7' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: '33%', background: '#C2491D' }}
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: '#8A837A' }}>4 confirmed · 8 pending invitations</p>

                {/* Invitation note */}
                <div
                  className="mt-5 pt-5 border-t text-xs font-mono"
                  style={{ borderColor: '#D6CFC7', color: '#8A837A' }}
                >
                  ✓ 14 invitations dispatched · 2 declined automatically
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ───────────────────────────── */}
      <div className="skew-section py-5" style={{ background: '#1A1612' }}>
        <MarqueeStrip />
      </div>

      {/* ── HOW IT WORKS — ARCHITECTURAL ─────────────── */}
      <ArchitecturalSteps />


      {/* ── BUILDER NOTE ────────────────────────────── */}
      <section id="story" className="py-32 px-6">
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>

          {/* Wavy sienna divider */}
          <svg viewBox="0 0 400 12" className="w-full mb-16" preserveAspectRatio="none">
            <path
              d="M 0 6 C 40 2, 60 10, 100 6 C 140 2, 160 10, 200 6 C 240 2, 260 10, 300 6 C 340 2, 360 10, 400 6"
              fill="none"
              stroke="#C2491D"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>

          <p
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#C2491D',
              marginBottom: '2rem',
              letterSpacing: '-0.01em',
            }}
          >
            A quick note from me
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              fontSize: '1rem',
              lineHeight: 1.9,
              color: '#1A1612',
            }}
          >
            <p>
              Running a community shouldn&rsquo;t feel like managing a spreadsheet full-time.
            </p>
            <p>
              But that&rsquo;s exactly what happens. Most organisers don&rsquo;t burn out because of the people — they burn out because of the constant coordination work behind the scenes.
            </p>
            <p style={{ color: '#8A837A' }}>
              Tracking volunteers, managing schedules, updating sheets&hellip; it never really stops.
            </p>
            <p>
              That&rsquo;s the problem Gatherly solves. It takes care of the repetitive admin work so you don&rsquo;t have to. No more messy spreadsheets. No more chasing updates. No more wasting hours on coordination.
            </p>
            <p>
              You can focus on your community — not the busywork.
            </p>
            <p>
              If you&rsquo;re still using spreadsheets to manage people, there&rsquo;s a better way.
            </p>
          </div>

          <p
            style={{
              marginTop: '2.5rem',
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#1A1612',
            }}
          >
            — Shreyas Hegde
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="px-6 pb-12 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Chartreuse divider */}
          <div className="h-px w-full mb-8" style={{ background: '#BFFF00' }} />

          <div className="flex items-end justify-between">
            {/* Left wordmark */}
            <span
              className="text-2xl font-bold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-space), sans-serif', color: '#C2491D' }}
            >
              Gatherly
            </span>

            {/* Right meta */}
            <div className="text-right text-sm" style={{ color: '#8A837A', fontFamily: 'monospace' }}>
              <p>Built by Shreyas Hegde · 2026</p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors"
                style={{ color: '#C2491D' }}
              >
                Open source on GitHub ↗
              </a>
            </div>
          </div>

          {/* Closing line — rotated mic-drop */}
          <p
            className="mt-8 text-xs"
            style={{
              color: '#8A837A',
              transform: 'rotate(-0.5deg)',
              display: 'inline-block',
              fontStyle: 'italic',
            }}
          >
            &ldquo;If your volunteers aren&rsquo;t showing up, it&rsquo;s not their fault.&rdquo;
          </p>
        </div>
      </footer>
    </div>
  );
}
