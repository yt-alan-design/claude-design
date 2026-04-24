'use client';

import React from 'react';
import { Ticker } from './data';
import { Theme } from './types';

interface TickerAvatarProps {
  ticker: Ticker;
  selected: boolean;
  onClick: () => void;
  theme: Theme;
}

function TickerAvatar({ ticker, selected, onClick, theme }: TickerAvatarProps) {
  const SIZE = 48;
  const up = ticker.change >= 0;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'none', border: 'none', padding: 0,
        cursor: 'pointer', flexShrink: 0,
      }}
    >
      {/* Fixed-size slot keeps all avatars aligned */}
      <div style={{
        position: 'relative',
        width: SIZE + 8, height: SIZE + 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2px solid ${selected ? theme.fg : 'transparent'}`,
          transition: 'border-color 0.15s ease-out',
        }} />
        <div style={{
          width: SIZE, height: SIZE, borderRadius: '50%',
          background: ticker.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontWeight: 700, fontSize: 17,
          color: '#fff',
        }}>
          {ticker.symbol.slice(0, 1)}
        </div>
      </div>
      {/* DS tag pattern: 50 fill + 500 border + 700 text */}
      <div style={{
        marginTop: 6,
        background: up ? theme.gainBg : theme.lossBg,
        border: `1px solid ${up ? theme.gain : theme.loss}`,
        color: up ? theme.gainFg : theme.lossFg,
        fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
        fontSize: 10, fontWeight: 500,
        padding: '1px 5px', borderRadius: 4,
        whiteSpace: 'nowrap',
        fontFeatureSettings: '"tnum" 1',
      }}>
        {up ? '+' : '−'}{Math.abs(ticker.changePct).toFixed(2)}%
      </div>
      <div style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: 12, fontWeight: selected ? 600 : 500,
        color: selected ? theme.fg : theme.muted,
        marginTop: 6,
      }}>
        {ticker.symbol}
      </div>
    </button>
  );
}

interface TickerCarouselProps {
  tickers: Ticker[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  theme: Theme;
}

export function TickerCarousel({ tickers, selectedIdx, onSelect, theme }: TickerCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const btn = el.children[selectedIdx] as HTMLElement | undefined;
    if (btn) {
      const target = btn.offsetLeft - el.clientWidth / 2 + btn.clientWidth / 2;
      el.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [selectedIdx]);

  return (
    <>
      <style>{`.ticker-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div
        ref={scrollRef}
        className="ticker-scroll"
        style={{
          display: 'flex', gap: 16, padding: '4px 16px 16px',
          overflowX: 'auto', scrollbarWidth: 'none',
          alignItems: 'flex-start',
        } as React.CSSProperties}
      >
        {tickers.map((t, i) => (
          <TickerAvatar
            key={t.symbol}
            ticker={t}
            selected={i === selectedIdx}
            onClick={() => onSelect(i)}
            theme={theme}
          />
        ))}
      </div>
    </>
  );
}
