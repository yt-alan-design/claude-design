'use client';

import React from 'react';
import { LineGraph } from './Graph';
import { Ticker, Range } from './data';
import { Theme } from './types';
import { fmtMoney, fmtPct, fmtSigned } from './utils';
import { RangeChips } from './PortfolioHero';

interface HoverInfo {
  x: number;
  idx: number;
  value: number;
}

interface StockPreviewProps {
  ticker: Ticker;
  theme: Theme;
}

export function StockPreview({ ticker, theme }: StockPreviewProps) {
  const [range, setRange] = React.useState<Range>('1M');
  const [hover, setHover] = React.useState<HoverInfo | null>(null);

  const isPositive = ticker.change >= 0;
  const lineColor = isPositive ? theme.gainFg : theme.lossFg;

  const pts = React.useMemo(() => {
    const all = ticker.points;
    const map: Record<Range, number> = { '1D': 10, '1W': 14, '1M': all.length, '3M': all.length, '1Y': all.length, 'ALL': all.length };
    const n = Math.min(map[range], all.length);
    if (n >= all.length) return all;
    const step = all.length / n;
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(all[Math.floor(i * step)]);
    out.push(all[all.length - 1]);
    return out;
  }, [range, ticker.points]);

  const displayPrice = hover ? hover.value : ticker.price;
  const holdingValue = ticker.shares * ticker.price;
  const holdingCost = ticker.shares * ticker.avgCost;
  const holdingReturn = holdingValue - holdingCost;
  const holdingReturnPct = (holdingReturn / holdingCost) * 100;

  const min = Math.min(...pts);
  const max = Math.max(...pts);

  return (
    <div style={{
      margin: '0 16px', padding: '20px',
      background: theme.card,
      borderRadius: 8,
      border: theme.cardBorder,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: ticker.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16,
            fontFamily: 'var(--font-inter), Inter, sans-serif',
          }}>
            {ticker.symbol[0]}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 700, fontSize: 16, color: theme.fg, letterSpacing: '-0.02em',
            }}>
              {ticker.symbol}
            </div>
            <div style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: 12, color: theme.muted, fontWeight: 500,
            }}>
              {ticker.name}
            </div>
          </div>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 8,
          background: theme.card, border: `1px solid ${theme.divider}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={theme.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <div style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 32, fontWeight: 700,
          color: theme.fg, letterSpacing: '-0.02em', lineHeight: 1,
          fontFeatureSettings: '"tnum" 1',
        }}>
          {fmtMoney(displayPrice)}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          color: lineColor,
          fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
          fontSize: 13, fontWeight: 500,
          fontFeatureSettings: '"tnum" 1',
        }}>
          {isPositive ? '▲' : '▼'} {fmtPct(ticker.changePct)}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: 12, color: theme.muted, marginBottom: 16, fontWeight: 500,
      }}>
        {hover ? `at ${range} · point ${hover.idx + 1}` : `${fmtSigned(ticker.change)} today`}
      </div>

      {/* Graph */}
      <div style={{ position: 'relative' }}>
        <LineGraph
          points={pts}
          width={320}
          height={120}
          stroke={lineColor}
          onHover={setHover}
          padTop={12}
          padBottom={8}
        />
        <div style={{
          position: 'absolute', right: 4, top: 4, fontSize: 10,
          color: theme.muted,
          fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
        }}>
          {fmtMoney(max, { decimals: 0 })}
        </div>
        <div style={{
          position: 'absolute', right: 4, bottom: 4, fontSize: 10,
          color: theme.muted,
          fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
        }}>
          {fmtMoney(min, { decimals: 0 })}
        </div>
      </div>

      {/* Range chips */}
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
        <RangeChips value={range} onChange={setRange} theme={theme} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: theme.divider, margin: '20px -4px 16px' }} />

      {/* Holdings stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
        {[
          { label: 'Shares', value: ticker.shares.toString() },
          { label: 'Avg cost', value: fmtMoney(ticker.avgCost) },
          { label: 'Value', value: fmtMoney(holdingValue, { compact: true, decimals: 2 }) },
        ].map((s, i) => (
          <div key={i} style={{
            padding: i === 0 ? '0 12px 0 0' : i === 2 ? '0 0 0 12px' : '0 12px',
            borderLeft: i > 0 ? `1px solid ${theme.divider}` : 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: 12, color: theme.muted, fontWeight: 500, marginBottom: 4,
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
              fontSize: 14, fontWeight: 500, color: theme.fg,
              fontFeatureSettings: '"tnum" 1',
            }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Return row — DS tag style */}
      <div style={{
        marginTop: 16, padding: '10px 12px',
        background: isPositive ? theme.gainBg : theme.lossBg,
        border: `1px solid ${isPositive ? theme.gain : theme.loss}`,
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: 13, color: theme.fg, fontWeight: 500,
        }}>
          Your return
        </div>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'baseline',
          color: lineColor,
          fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
          fontWeight: 500, fontFeatureSettings: '"tnum" 1',
        }}>
          <span style={{ fontSize: 14 }}>{fmtSigned(holdingReturn)}</span>
          <span style={{ fontSize: 12 }}>({fmtPct(holdingReturnPct)})</span>
        </div>
      </div>

      {/* Buy / Sell — DS Primary + Neutral */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button style={{
          flex: 1, height: 40, borderRadius: 8,
          border: '1px solid #303030',
          background: '#303030', color: '#fafafa',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          Buy
        </button>
        <button style={{
          flex: 1, height: 40, borderRadius: 8,
          border: `1px solid ${theme.divider}`,
          background: theme.card, color: theme.fg,
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          Sell
        </button>
      </div>
    </div>
  );
}
