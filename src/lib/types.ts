// ─── Types ────────────────────────────────────────────────────────────────────

export type Screen  = 'landing' | 'login' | 'home';
export type MenuKey = 'dashboard' | 'transaksi' | 'riwayat' | 'dompet' | 'pengaturan';
export type TxType  = 'income' | 'expense' | 'transfer';

export interface WalletData {
  id: number;
  name: string;
  emoji: string;
  color: string;
  balance: number;
  type: 'bank' | 'ewallet' | 'cash';
}

export interface Transaction {
  id: number;
  type: TxType;
  category: string;
  desc: string;
  amount: number;
  date: string;
  walletId: number;
  toWalletId?: number;
}
