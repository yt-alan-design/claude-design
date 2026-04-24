'use client';

import React from 'react';

interface LineGraphProps {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
  showCrosshair?: boolean;
  padTop?: number;
  padBottom?: number;
  onHover?: (info: { x: number; idx: number; value: number } | null) => void;
  interactive?: boolean;
}

export function LineGraph({
  points,
  width = 360,
  height = 140,
  stroke = '#B7F075',
  showCrosshair = true,
  padTop = 12,
  padBottom = 8,
  onHover,
  interactive = true,
}: LineGraphProps) {
  const [hoverX, setHoverX] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const n = points.length;

  const xAt = (i: number) => (i / (n - 1)) * width;
  const yAt = (v: number) => padTop + (1 - (v - min) / range) * (height - padTop - padBottom);

  const path = React.useMemo(() => {
    const coords = points.map((v, i) => [xAt(i), yAt(v)]);
    let d = `M ${coords[0][0]},${coords[0][1]}`;
    for (let i = 1; i < coords.length; i++) {
      const [x0, y0] = coords[i - 1];
      const [x1, y1] = coords[i];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
    }
    return d;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, width, height]);

  const areaPath = path + ` L ${width},${height} L 0,${height} Z`;

  const handleMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!interactive || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(width, ((clientX - rect.left) / rect.width) * width));
    setHoverX(x);
    if (onHover) {
      const idx = Math.round((x / width) * (n - 1));
      onHover({ x, idx, value: points[idx] });
    }
  };

  const handleLeave = () => {
    setHoverX(null);
    if (onHover) onHover(null);
  };

  const hoverIdx = hoverX != null ? Math.round((hoverX / width) * (n - 1)) : null;
  const hoverY = hoverIdx != null ? yAt(points[hoverIdx]) : null;

  const gradId = React.useId();

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', touchAction: 'none', cursor: interactive ? 'crosshair' : 'default' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {showCrosshair && hoverX != null && hoverY != null && (
        <g>
          <line x1={hoverX} y1={0} x2={hoverX} y2={height} stroke={stroke} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx={hoverX} cy={hoverY} r="5" fill={stroke} fillOpacity="0.25" />
          <circle cx={hoverX} cy={hoverY} r="2.5" fill={stroke} />
        </g>
      )}
    </svg>
  );
}

interface SparklineProps {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
}

export function Sparkline({ points, width = 60, height = 24, stroke = '#B7F075' }: SparklineProps) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const n = points.length;
  const path = points
    .map((v, i) => {
      const x = (i / (n - 1)) * width;
      const y = (1 - (v - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
