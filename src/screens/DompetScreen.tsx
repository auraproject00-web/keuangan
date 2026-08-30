import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Trash2 } from 'lucide-react';
import { BK, BG, PRIMARY, WALLET_PRESETS } from '@/lib/constants';
import { fmt } from '@/lib/helpers';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { WalletData } from '@/lib/types';

export default function DompetScreen({
  wallets, onAdd, onDelete, onSelectWallet,
}: { wallets: WalletData[]; onAdd: (w: Omit<WalletData, 'id'>) => void; onDelete: (id: number) => void; onSelectWallet: (id: number) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [picked, setPicked]   = useState<typeof WALLET_PRESETS[0] | null>(null);
  const [custom, setCustom]   = useState('');
  const [bal,    setBal]      = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const walletToDelete = deleteId !== null ? wallets.find(w => w.id === deleteId) : null;

  const handleAdd = () => {
    if (!picked && !custom) return;
    const preset = picked ?? { name: custom, emoji: '💳', color: PRIMARY, type: 'bank' as const };
    const num = parseInt(bal.replace(/\D/g, '')) || 0;
    onAdd({ ...preset, balance: num });
    setPicked(null); setCustom(''); setBal(''); setShowAdd(false);
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-6" style={{ background: BG }}>
      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Dompet?"
        message={`Dompet "${walletToDelete?.name ?? ''}" akan dihapus. Transaksi terkait tidak akan dihapus.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="px-4 pt-4 space-y-2.5">
        {wallets.map((w, i) => (
          <motion.div key={w.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 400, damping: 28 }}
            whileHover={{ x: -2, y: -2, boxShadow: `6px 6px 0 ${BK}` }}
            whileTap={{ x: 1, y: 1, boxShadow: `2px 2px 0 ${BK}` }}
            onClick={() => onSelectWallet(w.id)}
            className="rounded-xl p-4 flex items-center gap-3 cursor-pointer select-none"
            style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
            <motion.div
              whileHover={{ rotate: [0, -12, 12, -6, 6, 0], scale: 1.18 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: w.color, border: `2px solid ${BK}` }}>{w.emoji}</motion.div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[14.5px]" style={{ color: BK }}>{w.name}</p>
              <p className="text-[11px] mt-0.5 font-bold" style={{ color: '#6B7280' }}>
                {w.type === 'bank' ? '🏦 Bank' : w.type === 'ewallet' ? '📱 E-Wallet' : '💵 Tunai'} · Tap untuk riwayat
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-black text-[15px]" style={{ color: w.color }}>{fmt(w.balance)}</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: '#9CA3AF' }}>saldo</p>
            </div>
            <motion.button
              whileHover={{ x: -1, y: -1, boxShadow: `3px 3px 0 ${BK}` }} whileTap={{ x: 1, y: 1 }}
              onClick={e => { e.stopPropagation(); setDeleteId(w.id); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center ml-1 flex-shrink-0"
              style={{ background: '#FEE2E2', border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}` }}>
              <Trash2 className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
            </motion.button>
          </motion.div>
        ))}

        {/* Add wallet button */}
        {!showAdd ? (
          <motion.button onClick={() => setShowAdd(true)}
            whileHover={{ x: -2, y: -2, boxShadow: `5px 5px 0 ${BK}` }}
            whileTap={{ x: 1, y: 1, boxShadow: `2px 2px 0 ${BK}` }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[14px] uppercase tracking-wide transition-colors"
            style={{ border: `2px solid ${BK}`, color: BK, background: PRIMARY, boxShadow: `4px 4px 0 ${BK}` }}>
            <Plus className="w-4 h-4" />
            Tambah Dompet
          </motion.button>
        ) : (
          <div className="rounded-xl p-4 space-y-4" style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
            <div className="flex items-center justify-between">
              <p className="font-black text-[14px]" style={{ color: BK }}>Tambah Dompet Baru</p>
              <motion.button
                whileHover={{ x: -1, y: -1, boxShadow: `3px 3px 0 ${BK}` }}
                whileTap={{ x: 1, y: 1 }}
                onClick={() => setShowAdd(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ border: `2px solid ${BK}`, background: BG, boxShadow: `2px 2px 0 ${BK}` }}>
                <X className="w-3.5 h-3.5" style={{ color: BK }} />
              </motion.button>
            </div>

            {/* Wallet presets grid */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide mb-2" style={{ color: BK }}>Pilih Dompet</p>
              <div className="grid grid-cols-3 gap-2">
                {WALLET_PRESETS.map(p => {
                  const active = picked?.name === p.name;
                  return (
                    <button key={p.name} type="button"
                      onClick={() => { setPicked(p); setCustom(''); }}
                      className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[11.5px] font-bold transition-all"
                      style={{
                        background: active ? p.color : BG,
                        border: `2px solid ${BK}`,
                        color: active ? 'white' : BK,
                        boxShadow: active ? `2px 2px 0 ${BK}` : 'none',
                      }}>
                      <span>{p.emoji}</span>
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom name */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide mb-1.5" style={{ color: BK }}>Atau nama kustom</p>
              <input value={custom} onChange={e => { setCustom(e.target.value); setPicked(null); }}
                placeholder="Nama dompet..."
                className="w-full text-[13.5px] font-medium outline-none rounded-lg px-3.5 py-2.5 placeholder:text-gray-400"
                style={{ border: `2px solid ${BK}`, background: BG, color: BK }} />
            </div>

            {/* Initial balance */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide mb-1.5" style={{ color: BK }}>Saldo Awal</p>
              <div className="flex items-center gap-2 rounded-lg px-3.5 py-2.5" style={{ border: `2px solid ${BK}`, background: BG }}>
                <span className="font-bold text-sm" style={{ color: BK }}>Rp</span>
                <input type="tel" value={bal}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setBal(raw ? new Intl.NumberFormat('id-ID').format(parseInt(raw)) : '');
                  }}
                  placeholder="0"
                  className="flex-1 text-[13.5px] font-bold outline-none bg-transparent placeholder:text-gray-400"
                  style={{ color: BK }} />
              </div>
            </div>

            <motion.button onClick={handleAdd}
              whileHover={{ x: -2, y: -2, boxShadow: `5px 5px 0 ${BK}` }}
              whileTap={{ x: 1, y: 1, boxShadow: `2px 2px 0 ${BK}` }}
              disabled={!picked && !custom}
              className="w-full py-3 rounded-xl text-white font-black text-[14px] uppercase tracking-wide disabled:opacity-40"
              style={{ background: PRIMARY, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}>
              Simpan Dompet
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
