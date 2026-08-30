import type { Transaction } from './types';

// ─── Date helpers ─────────────────────────────────────────────────────────────

function pad(n: number) { return n.toString().padStart(2, '0'); }

export function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getCurrentMonth(): string {
  return new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export const fmt  = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.abs(n));

export const fmtK = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'jt';
  if (Math.abs(n) >= 1_000)     return (n / 1_000).toFixed(0) + 'rb';
  return String(n);
};

// ─── Relative date display ────────────────────────────────────────────────────

export const relDate = (d: string) => {
  if (d === getToday()) return 'Hari ini';
  if (d === getYesterday()) return 'Kemarin';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

export const groupDateLabel = (d: string) => {
  if (d === getToday()) return 'Hari Ini';
  if (d === getYesterday()) return 'Kemarin';
  return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
};

// ─── SVG helpers ──────────────────────────────────────────────────────────────

export const star4 = (cx: number, cy: number, R: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
};

// ─── Chart data builder ──────────────────────────────────────────────────────

export function buildChartData(txs: Transaction[], days: number = 7) {
  const today = new Date();
  const labels: { key: string; label: string }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    labels.push({ key, label });
  }

  let bal = 0;
  // Calculate starting balance from transactions before the window
  const startDate = labels[0]?.key ?? '';
  txs.forEach(tx => {
    if (tx.date < startDate) {
      if (tx.type === 'income') bal += tx.amount;
      else if (tx.type === 'expense') bal -= tx.amount;
      // transfers don't affect total balance
    }
  });

  return labels.map(({ key, label }) => {
    const dayTxs = txs.filter(t => t.date === key);
    const income  = dayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = dayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    bal += income - expense;
    return { label, income, expense, balance: bal };
  });
}
