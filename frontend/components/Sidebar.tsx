'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Settings } from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, hint: 'What\'s happening' },
      { name: 'Events', href: '/events', icon: Calendar, hint: 'All events' },
      { name: 'Volunteers', href: '/volunteers', icon: Users, hint: 'Your roster' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings, hint: 'Preferences' },
    ],
  },
];

function WobblyGWhite() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '240px',
        background: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <WobblyGWhite />
          <span
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#F5F0EB',
              letterSpacing: '-0.02em',
            }}
          >
            Gatherly
          </span>
        </Link>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, gi) => {
          const isActive = (href: string) =>
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

          return (
            <div key={gi} style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? '1.75rem' : 0 }}>
              {/* Group label */}
              <p
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,235,0.3)',
                  marginBottom: '0.5rem',
                  paddingLeft: '0.625rem',
                  fontFamily: 'var(--font-space), sans-serif',
                }}
              >
                {group.label}
              </p>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5rem 0.625rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        position: 'relative',
                        background: active ? 'rgba(194,73,29,0.1)' : 'transparent',
                        borderLeft: active ? '2px solid #C2491D' : '2px solid transparent',
                        transition: 'background 0.15s, border-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(245,240,235,0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }
                      }}
                    >
                      <Icon
                        size={15}
                        strokeWidth={active ? 2.5 : 1.8}
                        style={{ color: active ? '#C2491D' : 'rgba(245,240,235,0.45)', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: active ? 600 : 400,
                            color: active ? '#F5F0EB' : 'rgba(245,240,235,0.55)',
                            whiteSpace: 'nowrap',
                            fontFamily: 'var(--font-space), sans-serif',
                          }}
                        >
                          {item.name}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(194,73,29,0.2)',
              border: '1px solid rgba(194,73,29,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#C2491D',
              flexShrink: 0,
              fontFamily: 'var(--font-space), sans-serif',
            }}
          >
            AD
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(245,240,235,0.7)', lineHeight: 1.2 }}>
              Admin
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(245,240,235,0.3)', marginTop: '1px' }}>
              Organiser account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
