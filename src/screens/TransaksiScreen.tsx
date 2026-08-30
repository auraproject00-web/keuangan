import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';
import { BK, BG, PRIMARY, CAT_ICONS, CAT_COLORS, EXPENSE_CATS, INCOME_CATS } from '@/lib/constants';
import { getToday } from '@/lib/helpers';
import WalletPicker from '@/components/ui/WalletPicker';
import type { Transaction, WalletData, TxType } from '@/lib/types';

export default function TransaksiScreen({
  wallets, onAdd,
}: { wallets: WalletData[]; onAdd: (tx: Omit<Transaction, 'id'>) => void }) {
  const [type,       setType]       = useState<TxType>('expense');
  const [amount,     setAmount]     = useState('');
  const [cat,        setCat]        = useState('');
  const [desc,       setDesc]       = useState('');
  const [walletId,   setWalletId]   = useState<number | null>(wallets[0]?.id ?? null);
  const [toWalletId, setToWalletId] = useState<number | null>(null);
  const [done,       setDone]       = useState(false);

  const cats = type === 'expense' ? EXPENSE_CATS : type === 'income' ? INCOME_CATS : [];

  const handleAmount = (v: string) => {
    const raw = v.replace(/\D/g, '');
    setAmount(raw ? new Intl.NumberFormat('id-ID').format(parseInt(raw)) : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !walletId) return;
    if (type === 'transfer' && !toWalletId) return;
    if (type !== 'transfer' && !cat) return;
    const num = parseInt(amount.replace(/\./g, ''));
    onAdd({
      type, category: type === 'transfer' ? 'Transfer' : cat,
      desc: desc || (type === 'transfer' ? 'Transfer antar dompet' : cat),
      amount: num, date: getToday(), walletId,
      toWalletId: type === 'transfer' ? toWalletId! : undefined,
    });
    setAmount(''); setCat(''); setDesc(''); setToWalletId(null);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  const tabColor = type === 'income' ? '#10B981' : type === 'transfer' ? '#6366F1' : '#EF4444';

  return (
    <form onSubmit={handleSubmit}
      className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
      style={{ background: BG }}>

      {/* Type toggle */}
      <div className="flex rounded-xl p-1" style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}>
        {(['expense', 'income', 'transfer'] as const).map(t => (
          <button key={t} type="button"
            onClick={() => { setType(t); setCat(''); }}
            className="flex-1 py-2.5 rounded-lg text-[12.5px] font-black transition-all duration-200 flex items-center justify-center gap-1.5"
            style={{
              background: type === t
                ? (t === 'income' ? '#059669' : t === 'transfer' ? '#6366F1' : '#DC2626')
                : 'transparent',
              color: type === t ? 'white' : BK,
              border: type === t ? `1.5px solid ${BK}` : 'none',
              boxShadow: type === t ? `2px 2px 0 ${BK}` : 'none',
            }}>
            {t === 'expense' ? <><ArrowUpRight className="w-3.5 h-3.5" />Keluar</> :
             t === 'income'  ? <><ArrowDownLeft className="w-3.5 h-3.5" />Masuk</> :
                               <><ArrowLeftRight className="w-3.5 h-3.5" />Transfer</>}
          </button>
        ))}
      </div>

      {/* Wallet selectors */}
      {type === 'transfer' ? (
        <div className="rounded-xl p-4 space-y-3" style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}>
          <WalletPicker wallets={wallets} selected={walletId} onSelect={setWalletId} label="Dari dompet" />
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[2px]" style={{ background: BK }} />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#6366F1', border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}` }}>
              <ArrowDownLeft className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 h-[2px]" style={{ background: BK }} />
          </div>
          <WalletPicker
            wallets={wallets.filter(w => w.id !== walletId)}
            selected={toWalletId} onSelect={setToWalletId} label="Ke dompet" />
        </div>
      ) : (
        <div className="rounded-xl p-4" style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}>
          <WalletPicker wallets={wallets} selected={walletId} onSelect={setWalletId} label="Dompet" />
        </div>
      )}

      {/* Amount */}
      <div className="rounded-xl px-5 py-4" style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}>
        <p className="text-[10.5px] font-black uppercase tracking-widest mb-2" style={{ color: BK }}>Jumlah</p>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-base" style={{ color: BK }}>Rp</span>
          <input type="tel" value={amount} onChange={e => handleAmount(e.target.value)}
            placeholder="0"
            className="flex-1 text-[2rem] font-black font-display outline-none bg-transparent"
            style={{ color: BK, caretColor: tabColor }}
          />
        </div>
        <div className="h-[3px] rounded-full mt-2" style={{ background: BK }} />
      </div>

      {/* Category — not shown for transfer */}
      {type !== 'transfer' && (
        <div>
          <p className="text-[11.5px] font-black uppercase tracking-wide mb-2.5 ml-0.5" style={{ color: BK }}>Kategori</p>
          <div className="grid grid-cols-4 gap-2">
            {cats.map(k => (
              <motion.button key={k} type="button" onClick={() => setCat(k)}
                whileHover={{ x: -2, y: -2, boxShadow: `4px 4px 0 ${BK}` }}
                whileTap={{ x: 1, y: 1, boxShadow: `1px 1px 0 ${BK}` }}
                animate={cat === k ? { scale: [1, 1.12, 0.96, 1.04, 1] } : {}}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl"
                style={{
                  border: `2px solid ${BK}`,
                  background: cat === k ? (CAT_COLORS[k] ?? '#6B7280') : BG,
                  boxShadow: cat === k ? `3px 3px 0 ${BK}` : `2px 2px 0 ${BK}`,
                }}>
                <motion.span
                  animate={cat === k ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  className="text-xl leading-none">
                  {CAT_ICONS[k] ?? '📦'}
                </motion.span>
                <span className="text-[10px] font-bold text-center leading-tight"
                  style={{ color: cat === k ? 'white' : BK }}>{k}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <p className="text-[11.5px] font-black uppercase tracking-wide mb-2 ml-0.5" style={{ color: BK }}>Keterangan</p>
        <input type="text" value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Tambahkan keterangan..."
          className="w-full text-[14px] font-medium outline-none rounded-xl px-4 py-3 placeholder:text-gray-400"
          style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}`, color: BK }} />
      </div>

      <div className="flex-1" />

      <motion.button
        whileHover={{ x: -2, y: -2, boxShadow: `6px 6px 0 ${BK}` }}
        whileTap={{ x: 2, y: 2, boxShadow: `2px 2px 0 ${BK}` }}
        type="submit"
        disabled={!amount || (!cat && type !== 'transfer') || !walletId || (type === 'transfer' && !toWalletId)}
        className="w-full py-4 rounded-xl text-white font-black text-[15px] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide"
        style={{ background: done ? '#059669' : tabColor, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
        {done ? '✓ Berhasil!' : type === 'transfer' ? 'Transfer Sekarang' : 'Tambah Transaksi'}
      </motion.button>
    </form>
  );
}
