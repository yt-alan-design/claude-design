'use client';

import React from 'react';
import { TopBar, BottomNav } from './components/Chrome';
import { PortfolioHero } from './components/PortfolioHero';
import { TickerCarousel } from './components/TickerCarousel';
import { StockPreview } from './components/StockPreview';
import { Sparkline } from './components/Graph';
import { TICKERS, PORTFOLIO } from './components/data';
import { Theme } from './components/types';
import { fmtMoney, fmtPct } from './components/utils';

// Simple Design System — light theme tokens
const THEME: Theme = {
  dark: false,
  bg: '#f5f5f5',           // --base-50
  bgSecondary: '#f5f5f5',  // --base-50
  fg: '#1e1e1e',           // --fg-default
  muted: '#444444',        // --fg-secondary
  card: '#ffffff',         // --base-0
  cardBorder: '1px solid #d9d9d9', // --border-default
  cardShadow: '',
  chipBg: '#f5f5f5',
  chipActive: '#ffffff',
  divider: '#d9d9d9',      // --border-default
  navBg: 'rgba(255,255,255,0.92)',
  gain: '#188038',         // --success-500
  gainBg: '#e8f5ea',       // --success-50
  gainFg: '#0d5a25',       // --success-700
  loss: '#ec221f',         // --danger-500
  lossBg: '#fee9e7',       // --danger-50
  lossFg: '#900b09',       // --danger-700
};

export default function Home() {
  const [selected, setSelected] = React.useState(0);
  const [nav, setNav] = React.useState('home');

  const ticker = TICKERS[selected];

  return (
    <div style={{
      minHeight: '100vh',
      background: THEME.bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-inter), Inter, sans-serif',
    }}>
      <div style={{
        flex: 1,
        maxWidth: 600,
        width: '100%',
        margin: '0 auto',
        paddingBottom: 80,
        display: 'flex', flexDirection: 'column',
      }}>
        <TopBar theme={THEME} />

        <div style={{ marginBottom: 16 }}>
          <PortfolioHero portfolio={PORTFOLIO} theme={THEME} />
        </div>

        {/* Watchlist label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px 4px',
        }}>
          <div style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: 12, color: THEME.muted, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Watching · 7
          </div>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: THEME.muted, fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: 12, fontWeight: 500, padding: 0,
          }}>
            See all →
          </button>
        </div>

        <TickerCarousel
          tickers={TICKERS}
          selectedIdx={selected}
          onSelect={setSelected}
          theme={THEME}
        />

        <StockPreview ticker={ticker} theme={THEME} key={ticker.symbol} />

        {/* Today's movers */}
        <div style={{ padding: '20px 16px 8px' }}>
          <div style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: 12, color: THEME.muted, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Today&apos;s movers
          </div>
        </div>
        <div style={{
          margin: '0 16px 20px',
          background: THEME.card, borderRadius: 8,
          border: THEME.cardBorder,
        }}>
          {TICKERS.slice(0, 4).map((t, i) => {
            const up = t.change >= 0;
            const color = up ? THEME.gainFg : THEME.lossFg;
            return (
              <div
                key={t.symbol}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: i < 3 ? `1px solid ${THEME.divider}` : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setSelected(TICKERS.indexOf(t))}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: t.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                }}>
                  {t.symbol[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontSize: 14, fontWeight: 600, color: THEME.fg, letterSpacing: '-0.01em',
                  }}>
                    {t.symbol}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontSize: 12, color: THEME.muted,
                  }}>
                    {t.name}
                  </div>
                </div>
                <Sparkline points={t.points.slice(-20)} stroke={color} width={54} height={22} />
                <div style={{ textAlign: 'right', minWidth: 72 }}>
                  <div style={{
                    fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
                    fontSize: 13, fontWeight: 500, color: THEME.fg,
                    fontFeatureSettings: '"tnum" 1',
                  }}>
                    {fmtMoney(t.price)}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
                    fontSize: 11, fontWeight: 500, color,
                    fontFeatureSettings: '"tnum" 1',
                  }}>
                    {fmtPct(t.changePct)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom nav */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <BottomNav theme={THEME} active={nav} onChange={setNav} />
        </div>
      </div>
    </div>
  );
}
