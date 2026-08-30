import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Bar, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { BK, BG, PRIMARY } from '@/lib/constants';
import { fmt, fmtK, getCurrentMonth, buildChartData } from '@/lib/helpers';
import TxItem from '@/components/ui/TxItem';
import ChartTooltip from '@/components/ui/ChartTooltip';
import type { Transaction, WalletData, MenuKey } from '@/lib/types';

export default function DashboardScreen({
  txs, wallets, onNav, onWalletClick, onDeleteTx,
}: {
  txs: Transaction[];
  wallets: WalletData[];
  onNav: (k: MenuKey) => void;
  onWalletClick: (id: number) => void;
  onDeleteTx?: (id: number) => void;
}) {
  const [period, setPeriod] = useState<'7H' | '1B' | '3B'>('7H');
  const income  = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const recent  = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const totalWallet = wallets.reduce((s, w) => s + w.balance, 0);

  const chartDays = period === '7H' ? 7 : period === '1B' ? 30 : 90;
  const chartData = useMemo(() => buildChartData(txs, chartDays), [txs, chartDays]);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: BG, paddingBottom: '1rem' }}>

      {/* Balance card */}
      <div className="mx-4 mt-4 rounded-xl p-4 relative overflow-hidden"
        style={{ background: PRIMARY, border: `2px solid ${BK}`, boxShadow: `5px 5px 0 ${BK}` }}>
        <p className="text-white/80 text-[10.5px] font-black uppercase tracking-widest mb-1">Saldo Total Semua Dompet</p>
        <h2 className="text-white text-[1.65rem] font-black font-display leading-none mb-0.5">
          {fmt(totalWallet)}
        </h2>
        <p className="text-white/60 text-[10.5px] mb-3.5 font-medium">{getCurrentMonth()}</p>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.4)' }}>
            <div className="flex items-center gap-1 mb-0.5">
              <ArrowDownLeft className="w-3 h-3 text-white/80" />
              <span className="text-white/80 text-[10px] font-bold">Pemasukan</span>
            </div>
            <p className="text-white font-black text-[12.5px]">{fmt(income)}</p>
          </div>
          <div className="flex-1 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.4)' }}>
            <div className="flex items-center gap-1 mb-0.5">
              <ArrowUpRight className="w-3 h-3 text-white/80" />
              <span className="text-white/80 text-[10px] font-bold">Pengeluaran</span>
            </div>
            <p className="text-white font-black text-[12.5px]">{fmt(expense)}</p>
          </div>
        </div>
      </div>

      {/* Wallet chips */}
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-black text-[14px]" style={{ color: BK }}>Dompet Saya</h3>
          <motion.button onClick={() => onNav('dompet')}
            whileHover={{ x: -1, y: -1, boxShadow: `3px 3px 0 ${BK}` }}
            whileTap={{ x: 1, y: 1, boxShadow: `1px 1px 0 ${BK}` }}
            className="text-[11px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg"
            style={{ color: BK, border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}`, background: BG }}>
            Kelola
          </motion.button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {wallets.map(w => (
            <motion.div key={w.id}
              whileHover={{ x: -2, y: -2, boxShadow: `5px 5px 0 ${BK}` }}
              whileTap={{ x: 1, y: 1, boxShadow: `2px 2px 0 ${BK}` }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              onClick={() => onWalletClick(w.id)}
              className="flex-shrink-0 rounded-xl p-3 cursor-pointer select-none"
              style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}`, minWidth: '115px' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 600 }}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-sm"
                  style={{ background: w.color, border: `1.5px solid ${BK}` }}>{w.emoji}</motion.div>
                <span className="text-[11px] font-bold truncate" style={{ color: BK }}>{w.name}</span>
              </div>
              <p className="font-black text-[13px]" style={{ color: BK }}>{fmt(w.balance)}</p>
              <p className="text-[9.5px] font-bold mt-0.5" style={{ color: PRIMARY }}>Lihat riwayat →</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mx-4 mt-4 rounded-xl pt-3.5 pb-2"
        style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
        <div className="flex items-center justify-between px-4 mb-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide" style={{ color: '#6B7280' }}>Grafik Arus Kas</p>
            <p className="font-black text-[15px] font-display" style={{ color: BK }}>{fmt(balance)}</p>
          </div>
          <div className="flex gap-1">
            {(['7H', '1B', '3B'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase transition-all"
                style={{
                  background: period === p ? BK : BG,
                  color: period === p ? 'white' : BK,
                  border: `2px solid ${BK}`,
                  boxShadow: period === p ? `2px 2px 0 ${BK}` : 'none',
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 px-4 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: '#059669', border: `1.5px solid ${BK}` }} />
            <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: BK }}>Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: PRIMARY, border: `1.5px solid ${BK}` }} />
            <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: BK }}>Pengeluaran</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2.5 rounded-sm" style={{ background: '#6366F1', border: `1.5px solid ${BK}` }} />
            <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: BK }}>Saldo</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={155}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 12, left: -28, bottom: 0 }}
            barCategoryGap="30%">
            <defs>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#FF6B35" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E5E1D8" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 9.5, fill: '#9CA3AF' }}
              axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 9, fill: '#C4C4C4' }}
              axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
            <Bar dataKey="income"  fill="url(#incGrad)" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Bar dataKey="expense" fill="url(#expGrad)" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Area dataKey="balance" type="monotone" stroke="#6366F1" strokeWidth={2}
              fill="url(#balGrad)" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Recent transactions */}
      <div className="mx-4 mt-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-black text-[14px]" style={{ color: BK }}>Transaksi Terbaru</h3>
          <motion.button onClick={() => onNav('riwayat')}
            whileHover={{ x: -1, y: -1, boxShadow: `3px 3px 0 ${BK}` }}
            whileTap={{ x: 1, y: 1 }}
            className="text-[11px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg"
            style={{ color: BK, border: `2px solid ${BK}`, boxShadow: `2px 2px 0 ${BK}`, background: BG }}>
            Lihat Semua
          </motion.button>
        </div>
        <div className="space-y-2">
          {recent.map(tx => <TxItem key={tx.id} tx={tx} wallets={wallets} onDelete={onDeleteTx} />)}
        </div>
        {recent.length === 0 && (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm font-bold" style={{ color: '#6B7280' }}>Belum ada transaksi</p>
            <p className="text-xs font-medium mt-1" style={{ color: '#9CA3AF' }}>Tap + untuk menambahkan</p>
          </div>
        )}
      </div>
    </div>
  );
}
