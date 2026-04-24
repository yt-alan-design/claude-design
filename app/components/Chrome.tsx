'use client';

import React from 'react';
import { Theme } from './types';

interface BottomNavProps {
  theme: Theme;
  active?: string;
  onChange?: (id: string) => void;
}

const NAV_ICONS: Record<string, React.ReactNode> = {
  home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V9z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </>
  ),
  'trending-up': (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>
  ),
};

export function BottomNav({ theme, active = 'home', onChange }: BottomNavProps) {
  const items = [
    { id: 'home',      label: 'Home',     icon: 'home' },
    { id: 'discover',  label: 'Discover', icon: 'compass' },
    { id: 'trades',    label: 'Trades',   icon: 'trending-up' },
    { id: 'wallet',    label: 'Wallet',   icon: 'credit-card' },
  ];

  return (
    <div style={{
      position: 'relative', left: 0, right: 0, bottom: 0, zIndex: 40,
      padding: '10px 16px 28px',
      background: theme.navBg,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderTop: `1px solid ${theme.divider}`,
    } as React.CSSProperties}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {items.map(it => {
          const isActive = it.id === active;
          return (
            <button
              key={it.id}
              onClick={() => onChange?.(it.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                color: isActive ? theme.fg : theme.muted,
                padding: '4px 10px',
              }}
            >
              <svg
                width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                {NAV_ICONS[it.icon]}
              </svg>
              <span style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: 11, fontWeight: isActive ? 600 : 500,
              }}>
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TopBarProps {
  theme: Theme;
}

export function TopBar({ theme }: TopBarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 16px 16px',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 14, color: theme.muted, fontWeight: 500,
        }}>
          Good morning, Alex
        </div>
        <div style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 24, fontWeight: 700, color: theme.fg, letterSpacing: '-0.02em',
          marginTop: 2, lineHeight: 1.2,
        }}>
          Portfolio
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Search */}
        <button style={{
          width: 40, height: 40, borderRadius: 8,
          background: theme.card, border: `1px solid ${theme.divider}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={theme.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        {/* Bell */}
        <button style={{
          width: 40, height: 40, borderRadius: 8,
          background: theme.card, border: `1px solid ${theme.divider}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={theme.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div style={{
            position: 'absolute', top: 8, right: 8,
            width: 6, height: 6, borderRadius: '50%',
            background: '#ec221f',
            border: `1.5px solid ${theme.card}`,
          }} />
        </button>
      </div>
    </div>
  );
}
