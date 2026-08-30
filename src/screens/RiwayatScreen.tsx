import { useState } from 'react';
import { BK, BG } from '@/lib/constants';
import { getToday, getYesterday, groupDateLabel } from '@/lib/helpers';
import TxItem from '@/components/ui/TxItem';
import type { Transaction, WalletData, TxType } from '@/lib/types';

export default function RiwayatScreen({
  txs, wallets, onDelete,
}: { txs: Transaction[]; wallets: WalletData[]; onDelete?: (id: number) => void }) {
  const [filter, setFilter] = useState<TxType | 'all'>('all');

  const filtered = [...txs]
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, tx) => {
    (acc[tx.date] = acc[tx.date] ?? []).push(tx);
    return acc;
  }, {});

  const FILTERS: { key: TxType | 'all'; label: string }[] = [
    { key: 'all',      label: 'Semua' },
    { key: 'income',   label: 'Masuk' },
    { key: 'expense',  label: 'Keluar' },
    { key: 'transfer', label: 'Transfer' },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: BG }}>
      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className="px-3.5 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-wide transition-all flex-shrink-0"
            style={{
              background: filter === key ? BK : BG,
              color: filter === key ? 'white' : BK,
              border: `2px solid ${BK}`,
              boxShadow: filter === key ? `2px 2px 0 ${BK}` : 'none',
            }}>
            {label}
          </button>
        ))}
      </div>
      <div className="px-4 pb-6 space-y-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="text-[11px] font-black uppercase tracking-wide mb-2" style={{ color: BK }}>{groupDateLabel(date)}</p>
            <div className="space-y-2">
              {items.map(tx => <TxItem key={tx.id} tx={tx} wallets={wallets} onDelete={onDelete} />)}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-14">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-bold" style={{ color: '#6B7280' }}>Belum ada transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
}
