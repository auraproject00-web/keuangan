import type { WalletData, Transaction, MenuKey } from './types';
import {
  LayoutDashboard, Plus, Clock, Settings,
} from 'lucide-react';
import { Wallet } from 'lucide-react';
import { getToday, getDaysAgo } from './helpers';

// ─── Colors ───────────────────────────────────────────────────────────────────

export const PRIMARY = '#FF6B35';
export const BK = '#1A1A1A';
export const BG = '#FFFBF5';

// ─── Category lookup maps ─────────────────────────────────────────────────────

export const CAT_ICONS: Record<string, string> = {
  Makan: '🍜', Transport: '🛵', Belanja: '🛒', Hiburan: '🎬',
  Kesehatan: '💊', Tagihan: '📋', Pendidikan: '📚', Gaji: '💼',
  Freelance: '💻', Bisnis: '📈', Investasi: '💹', Hadiah: '🎁',
  Transfer: '🔄', Lainnya: '📦',
};

export const CAT_COLORS: Record<string, string> = {
  Makan: '#FF6B35', Transport: '#3B82F6', Belanja: '#8B5CF6', Hiburan: '#EC4899',
  Kesehatan: '#10B981', Tagihan: '#F59E0B', Pendidikan: '#6366F1',
  Gaji: '#10B981', Freelance: '#3B82F6', Bisnis: '#8B5CF6', Investasi: '#F59E0B',
  Hadiah: '#EC4899', Transfer: '#6B7280', Lainnya: '#6B7280',
};

export const EXPENSE_CATS = ['Makan', 'Transport', 'Belanja', 'Hiburan', 'Kesehatan', 'Tagihan', 'Pendidikan', 'Lainnya'];
export const INCOME_CATS  = ['Gaji', 'Freelance', 'Bisnis', 'Investasi', 'Hadiah', 'Lainnya'];

// ─── Wallet presets ───────────────────────────────────────────────────────────

export const WALLET_PRESETS = [
  { name: 'Bank Jago',    emoji: '🟢', color: '#4CAF50', type: 'bank'    as const },
  { name: 'BCA',          emoji: '🔷', color: '#0066CC', type: 'bank'    as const },
  { name: 'Mandiri',      emoji: '🟡', color: '#F5A623', type: 'bank'    as const },
  { name: 'BNI',          emoji: '🟠', color: '#FF6600', type: 'bank'    as const },
  { name: 'GoPay',        emoji: '🔵', color: '#00ADB5', type: 'ewallet' as const },
  { name: 'OVO',          emoji: '🟣', color: '#4C2B7E', type: 'ewallet' as const },
  { name: 'Dana',         emoji: '🔹', color: '#118EEA', type: 'ewallet' as const },
  { name: 'ShopeePay',    emoji: '🔴', color: '#EE4D2D', type: 'ewallet' as const },
  { name: 'Kas',          emoji: '💵', color: '#FF9800', type: 'cash'    as const },
];

// ─── Initial data (used on first launch) ──────────────────────────────────────

export const INITIAL_WALLETS: WalletData[] = [
  { id: 1, name: 'Bank Jago',  emoji: '🟢', color: '#4CAF50', balance: 3_500_000, type: 'bank'    },
  { id: 2, name: 'GoPay',      emoji: '🔵', color: '#00ADB5', balance:   750_000, type: 'ewallet' },
  { id: 3, name: 'Kas',        emoji: '💵', color: '#FF9800', balance:   500_000, type: 'cash'    },
];

export const INITIAL_TXS: Transaction[] = [
  { id: 1, type: 'income',   category: 'Gaji',      desc: 'Gaji bulan ini',         amount: 5_000_000, date: getDaysAgo(1), walletId: 1 },
  { id: 2, type: 'income',   category: 'Freelance',  desc: 'Project desain website', amount: 800_000,   date: getDaysAgo(3), walletId: 1 },
  { id: 3, type: 'expense',  category: 'Makan',      desc: 'Makan siang kantor',     amount: 45_000,    date: getToday(),    walletId: 2 },
  { id: 4, type: 'expense',  category: 'Transport',  desc: 'Ojek online',            amount: 25_000,    date: getDaysAgo(1), walletId: 2 },
  { id: 5, type: 'expense',  category: 'Belanja',    desc: 'Supermarket Indomaret',  amount: 285_000,   date: getDaysAgo(2), walletId: 1 },
  { id: 6, type: 'expense',  category: 'Hiburan',    desc: 'Netflix bulan ini',      amount: 54_000,    date: getDaysAgo(4), walletId: 2 },
  { id: 7, type: 'expense',  category: 'Kesehatan',  desc: 'Beli vitamin',           amount: 35_000,    date: getDaysAgo(5), walletId: 3 },
  { id: 8, type: 'transfer', category: 'Transfer',   desc: 'Top up GoPay',           amount: 200_000,   date: getDaysAgo(6), walletId: 1, toWalletId: 2 },
];

// ─── Navigation config ────────────────────────────────────────────────────────

export const NAV: { key: MenuKey; label: string; Icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard'   as MenuKey, label: 'Dashboard',   Icon: LayoutDashboard },
  { key: 'transaksi'   as MenuKey, label: 'Transaksi',   Icon: Plus            },
  { key: 'riwayat'     as MenuKey, label: 'Riwayat',     Icon: Clock           },
  { key: 'dompet'      as MenuKey, label: 'Dompet',      Icon: Wallet          },
  { key: 'pengaturan'  as MenuKey, label: 'Pengaturan',  Icon: Settings        },
];
