import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { BK, BG } from '@/lib/constants';
import { fmt } from '@/lib/helpers';
import TxItem from '@/components/ui/TxItem';
import type { WalletData, Transaction } from '@/lib/types';

export default function WalletDetailSheet({
  wallet, txs, wallets, onClose,
}: { wallet: WalletData; txs: Transaction[]; wallets: WalletData[]; onClose: () => void }) {
  const walletTxs = txs
    .filter(t => t.walletId === wallet.id || t.toWalletId === wallet.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const income  = walletTxs.filter(t => t.type === 'income'  && t.walletId === wallet.id).reduce((s, t) => s + t.amount, 0);
  const expense = walletTxs.filter(t => t.type === 'expense' && t.walletId === wallet.id).reduce((s, t) => s + t.amount, 0);
  const transfers = walletTxs.filter(t => t.type === 'transfer').length;

  return (
    <>
      {/* Backdrop */}
      <motion.div key="sheet-bd"
        className="absolute inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.48)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet panel */}
      <motion.div key="sheet-panel"
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{ borderRadius: '20px 20px 0 0', maxHeight: '82%', background: BG, borderTop: `3px solid ${BK}`, borderLeft: `3px solid ${BK}`, borderRight: `3px solid ${BK}` }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, { velocity, offset }) => {
          if (velocity.y > 400 || offset.y > 120) onClose();
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <motion.div
            className="w-10 h-1 rounded-full"
            style={{ background: BK }}
            whileHover={{ width: 48 }}
          />
        </div>

        {/* Wallet header */}
        <div className="px-5 pt-2 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: wallet.color, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}>
              {wallet.emoji}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h2 className="font-black font-display text-[18px]" style={{ color: BK }}>{wallet.name}</h2>
              <p className="text-[12px] font-medium" style={{ color: '#6B7280' }}>
                {wallet.type === 'bank' ? '🏦 Bank' : wallet.type === 'ewallet' ? '📱 E-Wallet' : '💵 Tunai'}
              </p>
            </div>
            <motion.button
              whileHover={{ x: -2, y: -2, boxShadow: `4px 4px 0 ${BK}` }}
              whileTap={{ x: 1, y: 1, boxShadow: `1px 1px 0 ${BK}` }}
              transition={{ type: 'spring', stiffness: 400 }}
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}` }}>
              <X className="w-4 h-4" style={{ color: BK }} />
            </motion.button>
          </div>

          {/* Balance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-xl p-4 mb-3"
            style={{ background: wallet.color, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
            <p className="text-[10.5px] font-black uppercase tracking-widest mb-1 text-white/70">Saldo Tersedia</p>
            <p className="text-[1.8rem] font-black font-display text-white">{fmt(wallet.balance)}</p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="flex gap-2">
            <div className="flex-1 rounded-lg p-3" style={{ background: '#D1FAE5', border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}` }}>
              <p className="text-[10.5px] font-black mb-0.5" style={{ color: '#065F46' }}>↓ Masuk</p>
              <p className="font-black text-[12px]" style={{ color: '#065F46' }}>{fmt(income)}</p>
            </div>
            <div className="flex-1 rounded-lg p-3" style={{ background: '#FEE2E2', border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}` }}>
              <p className="text-[10.5px] font-black mb-0.5" style={{ color: '#991B1B' }}>↑ Keluar</p>
              <p className="font-black text-[12px]" style={{ color: '#991B1B' }}>{fmt(expense)}</p>
            </div>
            <div className="w-[72px] rounded-lg p-3" style={{ background: '#EDE9FE', border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}` }}>
              <p className="text-[10.5px] font-black mb-0.5" style={{ color: '#5B21B6' }}>↔ Trf</p>
              <p className="font-black text-[12px]" style={{ color: '#5B21B6' }}>{transfers}x</p>
            </div>
          </motion.div>
        </div>

        <div className="h-[2px] mx-5 flex-shrink-0" style={{ background: BK }} />

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8" style={{ background: BG }}>
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: BK }}>
            Riwayat Transaksi ({walletTxs.length})
          </p>
          {walletTxs.length === 0 ? (
            <div className="text-center py-12">
              <motion.p animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl mb-3">📭</motion.p>
              <p className="text-gray-400 text-sm font-medium">Belum ada transaksi di dompet ini</p>
            </div>
          ) : (
            <div className="space-y-2">
              {walletTxs.map((tx, i) => (
                <motion.div key={tx.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045, type: 'spring', stiffness: 400, damping: 28 }}>
                  <TxItem tx={tx} wallets={wallets} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
