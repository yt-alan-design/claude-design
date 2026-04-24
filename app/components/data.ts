export interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  shares: number;
  avgCost: number;
  color: string;
  points: number[];
}

export interface Portfolio {
  value: number;
  change: number;
  changePct: number;
  dayChange: number;
  points: number[];
}

export const TICKERS: Ticker[] = [
  {
    symbol: 'NVDA', name: 'Nvidia',
    price: 1284.50, change: 42.30, changePct: 3.40,
    shares: 12, avgCost: 820.00,
    color: '#76B900',
    points: [820, 835, 815, 870, 890, 860, 920, 980, 950, 1010, 1050, 1020, 1080, 1120, 1090, 1150, 1180, 1145, 1200, 1240, 1210, 1260, 1284.5],
  },
  {
    symbol: 'AAPL', name: 'Apple Inc.',
    price: 234.82, change: -1.24, changePct: -0.53,
    shares: 45, avgCost: 185.50,
    color: '#A2AAAD',
    points: [210, 215, 220, 218, 225, 230, 228, 232, 236, 234, 238, 240, 237, 235, 238, 236, 232, 234, 238, 236, 235, 236, 234.82],
  },
  {
    symbol: 'TSLA', name: 'Tesla',
    price: 412.67, change: 18.22, changePct: 4.62,
    shares: 8, avgCost: 350.20,
    color: '#E31937',
    points: [340, 335, 350, 365, 358, 370, 382, 378, 390, 385, 395, 388, 400, 395, 405, 398, 410, 405, 412, 408, 415, 410, 412.67],
  },
  {
    symbol: 'MSFT', name: 'Microsoft',
    price: 468.12, change: 5.44, changePct: 1.18,
    shares: 20, avgCost: 420.00,
    color: '#00A4EF',
    points: [420, 425, 430, 435, 428, 440, 445, 438, 450, 448, 455, 452, 460, 458, 462, 459, 465, 462, 467, 464, 469, 466, 468.12],
  },
  {
    symbol: 'GOOGL', name: 'Alphabet',
    price: 198.45, change: 2.10, changePct: 1.07,
    shares: 30, avgCost: 170.00,
    color: '#4285F4',
    points: [175, 178, 180, 182, 179, 185, 188, 184, 190, 188, 193, 191, 196, 193, 197, 194, 198, 195, 199, 196, 200, 197, 198.45],
  },
  {
    symbol: 'META', name: 'Meta',
    price: 612.30, change: -8.45, changePct: -1.36,
    shares: 15, avgCost: 510.00,
    color: '#0866FF',
    points: [560, 572, 585, 595, 580, 600, 615, 608, 620, 618, 625, 622, 630, 625, 628, 622, 620, 625, 618, 622, 615, 618, 612.30],
  },
  {
    symbol: 'AMZN', name: 'Amazon',
    price: 224.18, change: 3.67, changePct: 1.66,
    shares: 25, avgCost: 195.00,
    color: '#FF9900',
    points: [200, 205, 208, 212, 210, 215, 218, 214, 220, 217, 222, 219, 224, 220, 226, 223, 227, 224, 228, 225, 229, 226, 224.18],
  },
];

function generatePortfolioPoints(): number[] {
  const start = 265000;
  const end = 312844.52;
  const pts: number[] = [];
  for (let i = 0; i < 90; i++) {
    const progress = i / 89;
    const target = start + (end - start) * progress;
    // Deterministic pseudo-random via sine to avoid SSR hydration mismatch
    const pseudoRand = Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5;
    const noise = (Math.sin(i * 0.7) + Math.sin(i * 1.3) * 0.5 + (pseudoRand - 0.5) * 0.8) * 3500;
    pts.push(target + noise);
  }
  pts[89] = end;
  return pts;
}

export const PORTFOLIO: Portfolio = {
  value: 312844.52,
  change: 4218.33,
  changePct: 1.37,
  dayChange: 4218.33,
  points: generatePortfolioPoints(),
};

export const RANGES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;
export type Range = (typeof RANGES)[number];
