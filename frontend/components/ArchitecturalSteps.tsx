'use client';

import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Create your event.',
    body: "Tell us what, when, where, and what skills you need. Takes about two minutes. Maybe three if you're a slow typer.",
    align: 'left',
    accent: '#C2491D',       // burnt sienna card
    numColor: 'rgba(194,73,29,0.08)',
  },
  {
    num: '02',
    title: 'We find your people.',
    body: 'Gatherly scans the volunteer registry, cross-references skills, and sends personalised HTML invitations. Automatically.',
    align: 'right',
    accent: '#1A1612',
    numColor: 'rgba(245,240,235,0.06)',
  },
  {
    num: '03',
    title: 'They show up.',
    body: 'Volunteers RSVP directly from email. You see confirmed headcounts live on the dashboard. No chasing. No spreadsheets.',
    align: 'left',
    accent: '#C2491D',
    numColor: 'rgba(194,73,29,0.08)',
  },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isRight = step.align === 'right';
  const isSienna = step.accent === '#C2491D';

  return (
    <div
      ref={ref}
      className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}
      style={{
        marginTop: index === 0 ? 0 : '-2rem',
        zIndex: index,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 'min(560px, 90vw)',
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(0) rotate(0deg)'
            : `translateY(32px) rotate(${isRight ? '0.8deg' : '-0.8deg'})`,
          transition: `opacity 0.6s ease ${index * 160}ms, transform 0.7s cubic-bezier(0.34,1.26,0.64,1) ${index * 160}ms`,
          background: isSienna ? '#C2491D' : '#181310',
          borderRadius: '4px',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isSienna
            ? '0 24px 64px rgba(194,73,29,0.25), 0 4px 16px rgba(26,22,18,0.15)'
            : '0 24px 64px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        {/* Giant ghost number background */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: isSienna ? '-0.5rem' : 'auto',
            left: isSienna ? 'auto' : '-0.5rem',
            top: '-1rem',
            fontFamily: 'var(--font-space), sans-serif',
            fontSize: 'clamp(6rem, 14vw, 10rem)',
            fontWeight: 700,
            color: isSienna ? 'rgba(245,240,235,0.12)' : 'rgba(194,73,29,0.15)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {step.num}
        </span>

        {/* Step label */}
        <p
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: isSienna ? 'rgba(245,240,235,0.55)' : '#C2491D',
            marginBottom: '0.75rem',
            position: 'relative',
          }}
        >
          Step {step.num}
        </p>

        {/* Heading */}
        <h3
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: isSienna ? '#F5F0EB' : '#F5F0EB',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          {step.title}
        </h3>

        {/* Body */}
        <p
          style={{
            color: isSienna ? 'rgba(245,240,235,0.72)' : '#8A837A',
            lineHeight: 1.75,
            fontSize: '0.95rem',
            position: 'relative',
            maxWidth: '380px',
          }}
        >
          {step.body}
        </p>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: isSienna ? 'rgba(245,240,235,0.2)' : '#C2491D',
          }}
        />
      </div>
    </div>
  );
}

export default function ArchitecturalSteps() {
  return (
    <section
      id="how-it-works"
      style={{ background: '#0F172A', padding: '6rem 1.5rem 8rem' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ marginBottom: '4rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C2491D',
              marginBottom: '1rem',
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#F5F0EB',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              maxWidth: '520px',
            }}
          >
            Three steps.
            <br />
            <span style={{ color: '#C2491D' }}>Zero spreadsheets.</span>
          </h2>
        </div>

        {/* Overlapping stacked cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
