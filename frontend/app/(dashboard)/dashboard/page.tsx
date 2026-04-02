'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, Calendar, MapPin, Users, ArrowRight, Zap } from 'lucide-react';

/* ─── Design tokens ─────────────────────────────────── */
const T = {
  bg: '#F5F0EB',
  surface: '#EDE8E1',
  surfaceDeep: '#E3DDD6',
  text: '#1A1612',
  muted: '#8A837A',
  sienna: '#C2491D',
  siennaLight: 'rgba(194,73,29,0.08)',
  amber: '#D97706',
  amberLight: 'rgba(217,119,6,0.08)',
  green: '#059669',
  greenLight: 'rgba(5,150,105,0.08)',
  space: 'var(--font-space), sans-serif',
  inter: 'var(--font-inter), sans-serif',
};

/* ─── Count-up hook ─────────────────────────────────── */
function useCountUp(target: number, duration = 900, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) { setValue(target); return; }
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return value;
}

/* ─── Relative time ─────────────────────────────────── */
function timeAgo() {
  return 'Updated just now';
}

/* ─── Progress bar ──────────────────────────────────── */
function ProgressBar({ filled, total, color }: { filled: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  return (
    <div style={{ height: 3, background: T.surfaceDeep, borderRadius: 99, overflow: 'hidden', marginTop: '0.5rem' }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.6s cubic-bezier(0.34,1.26,0.64,1)',
        }}
      />
    </div>
  );
}

/* ─── Status chip ────────────────────────────────────── */
function StatusChip({ status }: { status: string }) {
  const isOpen = status === 'OPEN';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: isOpen ? T.amber : T.green,
        background: isOpen ? T.amberLight : T.greenLight,
        padding: '0.2rem 0.5rem',
        borderRadius: '99px',
        fontFamily: T.space,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: isOpen ? T.amber : T.green,
          animation: isOpen ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          display: 'inline-block',
        }}
      />
      {status === 'OPEN' ? 'Filling' : 'Full'}
    </span>
  );
}

/* ─── Event card ─────────────────────────────────────── */
function EventCard({ evt, showInsight }: { evt: any; showInsight?: boolean }) {
  const isOpen = evt.status === 'OPEN';
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/events/${evt.event_id}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background: hovered ? T.bg : T.surface,
          borderRadius: '8px',
          padding: '1.25rem 1.25rem 1.25rem 1.5rem',
          borderLeft: `3px solid ${isOpen ? T.amber : T.green}`,
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hovered ? '0 6px 24px rgba(26,22,18,0.08)' : '0 1px 4px rgba(26,22,18,0.04)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.15s',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.6rem' }}>
          <h3
            style={{
              fontFamily: T.space,
              fontWeight: 700,
              fontSize: '0.95rem',
              color: T.text,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              margin: 0,
              flex: 1,
              minWidth: 0,
            }}
          >
            {evt.name}
          </h3>
          <StatusChip status={evt.status} />
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: T.muted }}>
            <Calendar size={11} strokeWidth={1.8} />
            {evt.date}
          </span>
          {evt.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: T.muted }}>
              <MapPin size={11} strokeWidth={1.8} />
              {evt.location}
            </span>
          )}
          {Array.isArray(evt.skills_needed) && evt.skills_needed.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: T.muted }}>
              <Zap size={11} strokeWidth={1.8} />
              {evt.skills_needed.slice(0, 2).join(', ')}
              {evt.skills_needed.length > 2 && ` +${evt.skills_needed.length - 2}`}
            </span>
          )}
        </div>

        {/* Slots + progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: T.muted }}>
            {evt.slots_filled ?? 0} of {evt.slots_total ?? 0} confirmed
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: isOpen ? T.sienna : T.green,
            }}
          >
            {evt.slots_total > 0 ? Math.round(((evt.slots_filled ?? 0) / evt.slots_total) * 100) : 0}%
          </span>
        </div>

        <ProgressBar
          filled={evt.slots_filled ?? 0}
          total={evt.slots_total ?? 0}
          color={isOpen ? T.sienna : T.green}
        />

        {/* Insight callout — only for filled events */}
        {showInsight && !isOpen && (
          <div
            style={{
              marginTop: '0.875rem',
              padding: '0.5rem 0.625rem',
              background: T.greenLight,
              borderRadius: '5px',
              fontSize: '0.72rem',
              color: T.green,
              fontWeight: 500,
            }}
          >
            Fully staffed — no action needed.
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: hovered ? T.sienna : T.muted,
            transition: 'color 0.15s',
          }}
        >
          View details <ArrowRight size={11} />
        </div>
      </div>
    </Link>
  );
}

/* ─── Volunteer bar ──────────────────────────────────── */
function VolunteerBar({ vol, maxEvents, index }: { vol: any; maxEvents: number; index: number }) {
  const initials = vol.name ? vol.name.substring(0, 2).toUpperCase() : '??';
  const count = vol.total_events || 0;
  const pct = maxEvents > 0 ? (count / maxEvents) * 100 : 0;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: T.siennaLight,
          border: `1px solid rgba(194,73,29,${hovered ? 0.4 : 0.15})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.62rem',
          fontWeight: 700,
          color: T.sienna,
          fontFamily: T.space,
          flexShrink: 0,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.15s, border-color 0.15s',
        }}
      >
        {initials}
      </div>

      {/* Name + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 500, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vol.name}</span>
          <span style={{ fontSize: '0.7rem', color: T.muted, flexShrink: 0, marginLeft: '0.5rem' }}>{count} event{count !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ height: 2, background: T.surfaceDeep, borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: T.sienna,
              borderRadius: 99,
              opacity: 0.6 + (index === 0 ? 0.4 : 0),
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const dummyIds = new Set([
    'EVT_20260311_B57196', 'EVT_20260320_088211', 'EVT_20260320_23F6AE',
    'EVT_20260320_2FDE17', 'EVT_20260320_30B2AA', 'EVT_20260320_32E6E8',
    'EVT_20260320_39B896', 'EVT_20260320_44AF37', 'EVT_20260320_4FF42A',
    'EVT_20260320_5A8889', 'EVT_20260320_66E881', 'EVT_20260320_7A06DC',
    'EVT_20260320_8FF6C8', 'EVT_20260320_9B101C', 'EVT_20260320_A99FAA',
    'EVT_20260320_B4E845', 'EVT_20260320_B51D75', 'EVT_20260320_C6DFDB',
    'EVT_20260320_C77320', 'EVT_20260320_CB124F', 'EVT_20260320_D51088',
    'EVT_20260320_E3B711', 'EVT_20260320_E40712',
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
        
        const [resEvents, resVols] = await Promise.all([
          fetch(`${apiUrl}/events`, { cache: 'force-cache', next: { revalidate: 60 } }).catch(() => null),
          fetch(`${apiUrl}/volunteers`, { cache: 'force-cache', next: { revalidate: 60 } }).catch(() => null),
        ]);

        if (resEvents && resEvents.ok) {
          const contentType = resEvents.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const dataE = await resEvents.json();
            const pureEvents = (dataE.events || []).filter((e: any) => !dummyIds.has(e.event_id));
            setEvents(pureEvents);
          }
        }

        if (resVols && resVols.ok) {
          const contentType = resVols.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const dataV = await resVols.json();
            setVolunteers(dataV.volunteers || []);
          }
        }
      } catch (err) {
        console.error('Dashboard load failed:', err);
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    }
    fetchData();
  }, []);

  /* ─── Derived data ─────────────── */
  const openEvents = events.filter(e => e.status === 'OPEN');
  const filledEvents = events.filter(e => e.status === 'FILLED');
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const topVolunteers = [...volunteers]
    .sort((a, b) => (b.total_events || 0) - (a.total_events || 0))
    .slice(0, 5);
  const maxEvents = topVolunteers[0]?.total_events || 1;

  /* ─── Count-up values ──────────── */
  const animOpen = useCountUp(openEvents.length, 800, dataLoaded);
  const animFilled = useCountUp(filledEvents.length, 800, dataLoaded);
  const animVols = useCountUp(volunteers.length, 900, dataLoaded);

  /* ─── Skeleton ─────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Skeleton header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ width: 260, height: 18, background: T.surfaceDeep, borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ width: 140, height: 12, background: T.surfaceDeep, borderRadius: 4, opacity: 0.6 }} />
          </div>
          <div style={{ width: 120, height: 40, background: T.surfaceDeep, borderRadius: 6 }} />
        </div>
        {/* Skeleton hero */}
        <div style={{ background: T.surface, borderRadius: 10, padding: '2rem', height: 160 }} />
        {/* Skeleton body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.25rem' }}>
          <div style={{ background: T.surface, borderRadius: 10, height: 320 }} />
          <div style={{ background: T.surface, borderRadius: 10, height: 320 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Zone A: Header ──────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1
            style={{
              fontFamily: T.space,
              fontWeight: 700,
              fontSize: '1.35rem',
              color: T.text,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {openEvents.length > 0
              ? `${openEvents.length} event${openEvents.length > 1 ? 's' : ''} still need${openEvents.length === 1 ? 's' : ''} your attention.`
              : "Everything's fully staffed."}
          </h1>
          <p style={{ fontSize: '0.75rem', color: T.muted, marginTop: '0.3rem', fontStyle: 'italic' }}>
            {timeAgo()}
          </p>
        </div>

        <Link
          href="/events/create"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: T.sienna,
            color: '#F5F0EB',
            padding: '0.625rem 1.25rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: T.space,
            letterSpacing: '-0.01em',
            transition: 'background 0.15s, transform 0.15s',
            boxShadow: '0 2px 8px rgba(194,73,29,0.2)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#a33b17';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = T.sienna;
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Create event
        </Link>
      </div>

      {/* ── Zone B: Hero Metric ─────────────────────────── */}
      <div
        style={{
          background: T.surface,
          borderRadius: '10px',
          padding: '1.75rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(26,22,18,0.05)',
        }}
      >
        {/* Ghost background text */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-0.5rem',
            top: '-1rem',
            fontFamily: T.space,
            fontSize: '7rem',
            fontWeight: 700,
            color: 'rgba(194,73,29,0.04)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          {events.length}
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-end', position: 'relative' }}>
          {/* Primary metric */}
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.5rem', fontFamily: T.space }}>
              What needs filling
            </p>
            <p
              style={{
                fontFamily: T.space,
                fontSize: 'clamp(2.8rem, 5vw, 3.8rem)',
                fontWeight: 700,
                color: T.sienna,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              {animOpen}
              <span style={{ fontSize: '1.4rem', color: T.muted, marginLeft: '0.3rem', fontWeight: 400 }}>open</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: T.muted, marginTop: '0.4rem', maxWidth: 320 }}>
              {openEvents.length === 0
                ? 'All events are fully staffed. Nothing to action.'
                : `${openEvents.reduce((a, e) => a + ((e.slots_total ?? 0) - (e.slots_filled ?? 0)), 0)} volunteer spots still available across active events.`}
            </p>
          </div>

          {/* Secondary metrics */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ borderLeft: `3px solid ${T.green}`, paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.25rem', fontFamily: T.space }}>
                Fully staffed
              </p>
              <p style={{ fontFamily: T.space, fontSize: '2rem', fontWeight: 700, color: T.green, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
                {animFilled}
              </p>
            </div>

            <div style={{ borderLeft: `3px solid rgba(138,131,122,0.3)`, paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.25rem', fontFamily: T.space }}>
                Volunteers
              </p>
              <p style={{ fontFamily: T.space, fontSize: '2rem', fontWeight: 700, color: T.text, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
                {animVols}
              </p>
            </div>

            <div style={{ borderLeft: `3px solid rgba(138,131,122,0.3)`, paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.25rem', fontFamily: T.space }}>
                Total events
              </p>
              <p style={{ fontFamily: T.space, fontSize: '2rem', fontWeight: 700, color: T.text, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
                {events.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Zone C: Asymmetric body ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.25rem', alignItems: 'start' }}>

        {/* Left: Events list */}
        <div
          style={{
            background: T.surface,
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(26,22,18,0.04)',
          }}
        >
          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
            <div>
              <h2
                style={{
                  fontFamily: T.space,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: T.text,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                What needs your attention
              </h2>
              <p style={{ fontSize: '0.7rem', color: T.muted, marginTop: '0.2rem' }}>
                Upcoming events, sorted by date
              </p>
            </div>
            <Link
              href="/events"
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: T.sienna,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              All events <ArrowRight size={11} />
            </Link>
          </div>

          {/* Events */}
          {upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: T.muted }}>
              <p style={{ fontSize: '0.85rem' }}>No events yet.</p>
              <Link href="/events/create" style={{ color: T.sienna, fontSize: '0.8rem', textDecoration: 'underline', marginTop: '0.5rem', display: 'block' }}>
                Create your first one →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingEvents.map((evt, i) => (
                <EventCard key={evt.event_id} evt={evt} showInsight={evt.status === 'FILLED' && i === 0} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Volunteers */}
        <div
          style={{
            background: T.surface,
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(26,22,18,0.04)',
            position: 'sticky',
            top: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
            <div>
              <h2
                style={{
                  fontFamily: T.space,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: T.text,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                Who&rsquo;s showing up
              </h2>
              <p style={{ fontSize: '0.7rem', color: T.muted, marginTop: '0.2rem' }}>
                Most active volunteers
              </p>
            </div>
            <Link
              href="/volunteers"
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: T.sienna,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              All <ArrowRight size={11} />
            </Link>
          </div>

          {topVolunteers.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: T.muted, textAlign: 'center', padding: '2rem 0' }}>
              No volunteers registered yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topVolunteers.map((vol, i) => (
                <VolunteerBar key={vol.volunteer_id || i} vol={vol} maxEvents={maxEvents} index={i} />
              ))}
            </div>
          )}

          {/* Volunteer count summary */}
          {volunteers.length > 0 && (
            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(26,22,18,0.06)',
              }}
            >
              <Link
                href="/volunteers"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: T.muted,
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '5px',
                  background: T.bg,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.surfaceDeep}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = T.bg}
              >
                <span>See all {volunteers.length} volunteers</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Zone D: Ambient footer strip ───────────────── */}
      <div
        style={{
          padding: '0.875rem 1.25rem',
          background: T.surface,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: T.muted }}>
            <span style={{ fontWeight: 600, color: T.text }}>{events.length}</span> events total
          </span>
          <span style={{ fontSize: '0.72rem', color: T.muted }}>
            <span style={{ fontWeight: 600, color: T.text }}>{volunteers.length}</span> volunteers registered
          </span>
          <span style={{ fontSize: '0.72rem', color: T.muted }}>
            <span style={{ fontWeight: 600, color: T.text }}>{filledEvents.length}</span> fully staffed
          </span>
        </div>
        <span style={{ fontSize: '0.68rem', color: T.muted, fontStyle: 'italic' }}>
          {openEvents.length > 0
            ? `${openEvents.length} event${openEvents.length > 1 ? 's' : ''} still accepting volunteers`
            : 'All events staffed — nothing to action'}
        </span>
      </div>

    </div>
  );
}
