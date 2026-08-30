import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { BK, BG, CAT_ICONS, CAT_COLORS } from '@/lib/constants';
import { fmt, relDate } from '@/lib/helpers';
import type { Transaction, WalletData } from '@/lib/types';

export default function TxItem({
  tx, wallets, onDelete,
}: { tx: Transaction; wallets: WalletData[]; onDelete?: (id: number) => void }) {
  const color = CAT_COLORS[tx.category] ?? '#6B7280';
  const wallet = wallets.find(w => w.id === tx.walletId);
  const toWallet = tx.toWalletId ? wallets.find(w => w.id === tx.toWalletId) : null;
  return (
    <motion.div
      whileHover={{ x: -2, y: -2, boxShadow: `5px 5px 0 ${BK}` }}
      whileTap={{ x: 1, y: 1, boxShadow: `2px 2px 0 ${BK}` }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex items-center gap-3 rounded-xl px-3.5 py-3 cursor-default group"
      style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}>
      <motion.div
        whileHover={{ rotate: [0, -8, 8, -4, 4, 0], scale: 1.15 }}
        transition={{ duration: 0.4 }}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}>
        {CAT_ICONS[tx.category] ?? '📦'}
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[13.5px] leading-tight truncate" style={{ color: BK }}>{tx.desc}</p>
        <p className="text-[11px] mt-0.5 font-medium" style={{ color: '#6B7280' }}>
          {tx.type === 'transfer' && toWallet
            ? `${wallet?.name} → ${toWallet.name}`
            : `${wallet?.name ?? ''} · ${relDate(tx.date)}`}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-[13.5px]"
          style={{ color: tx.type === 'income' ? '#059669' : tx.type === 'transfer' ? '#6B7280' : '#DC2626' }}>
          {tx.type === 'income' ? '+' : tx.type === 'transfer' ? '↔' : '-'}{fmt(tx.amount)}
        </p>
        <p className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>{relDate(tx.date)}</p>
      </div>
      {onDelete && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.1, x: -1, y: -1, boxShadow: `3px 3px 0 ${BK}` }}
          whileTap={{ scale: 0.9, x: 1, y: 1 }}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: '#FEE2E2', border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}` }}
          onClick={e => { e.stopPropagation(); onDelete(tx.id); }}
        >
          <Trash2 className="w-3 h-3" style={{ color: '#DC2626' }} />
        </motion.button>
      )}
    </motion.div>
  );
}
