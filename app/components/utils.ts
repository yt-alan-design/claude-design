export function fmtMoney(v: number, { decimals = 2, compact = false }: { decimals?: number; compact?: boolean } = {}): string {
  if (compact && Math.abs(v) >= 1000) {
    if (Math.abs(v) >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
    return '$' + (v / 1000).toFixed(1) + 'K';
  }
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPct(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return sign + v.toFixed(2) + '%';
}

export function fmtSigned(v: number): string {
  const sign = v >= 0 ? '+' : '−';
  return sign + fmtMoney(Math.abs(v));
}
