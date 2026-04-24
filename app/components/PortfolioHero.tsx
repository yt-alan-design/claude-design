'use client';

import React from 'react';
import { LineGraph } from './Graph';
import { Portfolio, RANGES, Range } from './data';
import { Theme } from './types';
import { fmtMoney, fmtPct } from './utils';

interface RangeChipsProps {
  value: Range;
  onChange: (r: Range) => void;
  theme: Theme;
}

export function RangeChips({ value, onChange, theme }: RangeChipsProps) {
  return (
    <div style={{
      display: 'flex', gap: 0,
      background: theme.bgSecondary,
      borderRadius: 8, padding: 2,
      border: `1px solid ${theme.divider}`,
    }}>
      {RANGES.map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{
            background: value === r ? theme.card : 'transparent',
            color: value === r ? theme.fg : theme.muted,
            border: value === r ? `1px solid ${theme.divider}` : '1px solid transparent',
            padding: '5px 10px',
            borderRadius: 6, cursor: 'pointer',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: 12, fontWeight: value === r ? 600 : 500,
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

interface HoverInfo {
  x: number;
  idx: number;
  value: number;
}

interface PortfolioHeroProps {
  portfolio: Portfolio;
  theme: Theme;
}

export function PortfolioHero({ portfolio, theme }: PortfolioHeroProps) {
  const [range, setRange] = React.useState<Range>('3M');
  const [hover, setHover] = React.useState<HoverInfo | null>(null);

  const pts = React.useMemo(() => {
    const all = portfolio.points;
    const map: Record<Range, number> = { '1D': 24, '1W': 30, '1M': 30, '3M': all.length, '1Y': all.length, 'ALL': all.length };
    const n = map[range];
    if (n >= all.length) return all;
    const step = all.length / n;
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(all[Math.floor(i * step)]);
    out.push(all[all.length - 1]);
    return out;
  }, [range, portfolio.points]);

  const displayValue = hover ? hover.value : portfolio.value;
  const isPositive = portfolio.change >= 0;
  const lineColor = isPositive ? theme.gainFg : theme.lossFg;

  return (
    <div style={{
      margin: '0 16px', padding: '20px',
      background: theme.card,
      borderRadius: 8,
      border: theme.cardBorder,
    }}>
      {/* Label row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <div style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 14, color: theme.muted, fontWeight: 500,
        }}>
          Total portfolio value
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 12, color: theme.muted,
          padding: '2px 8px',
          border: `1px solid ${theme.divider}`,
          borderRadius: 9999,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: theme.gain,
          }} />
          Live
        </div>
      </div>

      {/* Big value — Inter 700 */}
      <div style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: 48, fontWeight: 700,
        color: theme.fg, letterSpacing: '-0.03em',
        lineHeight: 1, marginBottom: 10,
        fontFeatureSettings: '"tnum" 1',
      }}>
        {fmtMoney(displayValue, { decimals: 2 })}
      </div>

      {/* DS tag badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: isPositive ? theme.gainBg : theme.lossBg,
          color: lineColor,
          padding: '2px 8px', borderRadius: 4,
          fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
          fontSize: 12, fontWeight: 500,
          border: `1px solid ${isPositive ? theme.gain : theme.loss}`,
        }}>
          {isPositive ? '+' : '−'}{fmtMoney(Math.abs(portfolio.change))}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: isPositive ? theme.gainBg : theme.lossBg,
          color: lineColor,
          padding: '2px 8px', borderRadius: 4,
          fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
          fontSize: 12, fontWeight: 500,
          border: `1px solid ${isPositive ? theme.gain : theme.loss}`,
        }}>
          {fmtPct(portfolio.changePct)}
        </div>
        <div style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 12, color: theme.muted, fontWeight: 500,
        }}>
          {hover ? `day ${hover.idx + 1} of ${pts.length}` : 'today'}
        </div>
      </div>

      {/* Graph */}
      <LineGraph
        points={pts}
        width={320}
        height={100}
        stroke={lineColor}
        onHover={setHover}
        padTop={8}
        padBottom={4}
      />

      {/* Range chips */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <RangeChips value={range} onChange={setRange} theme={theme} />
      </div>
    </div>
  );
}
