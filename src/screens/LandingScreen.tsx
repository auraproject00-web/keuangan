import { motion } from 'framer-motion';
import { ArrowRight, Wallet, Banknote, Coins } from 'lucide-react';
import { PRIMARY, BK, BG } from '@/lib/constants';
import TopoBg from '@/components/ui/TopoBg';
import Wave from '@/components/ui/Wave';

export default function LandingScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 'clamp(260px, 46svh, 358px)', background: PRIMARY }}>
        <TopoBg />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="relative">
            <motion.div
              initial={{ y: -40, opacity: 0, scale: 0.5 }}
              animate={{ y: [ -40, -10, 0, 10, 20 ], opacity: [0, 1, 1, 0, 0], scale: [0.5, 1, 1, 0.8, 0] }}
              transition={{ delay: 0.6, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              className="absolute -top-6 -right-2 z-0"
            >
              <Banknote className="w-6 h-6 text-green-300" strokeWidth={2.5} />
            </motion.div>
            
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.5 }}
              animate={{ y: [ -50, -20, -5, 15, 25 ], opacity: [0, 1, 1, 0, 0], scale: [0.5, 1, 1, 0.8, 0] }}
              transition={{ delay: 1.2, duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
              className="absolute -top-10 -left-1 z-0"
            >
              <Coins className="w-5 h-5 text-yellow-300" strokeWidth={2.5} />
            </motion.div>

            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-[68px] h-[68px] rounded-xl flex items-center justify-center relative z-10"
              style={{ background: BK, border: '3px solid white', boxShadow: '4px 4px 0 white' }}>
              <Wallet className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>
          </div>
          <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-white font-display font-black text-lg uppercase tracking-widest">
            CatatUang
          </motion.span>
        </div>
      </div>
      <Wave />
      <div className="flex-1 px-8 pt-2 pb-10 flex flex-col" style={{ marginTop: '-1px', background: BG }}>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="font-display text-[2.6rem] font-black leading-none mb-3" style={{ color: BK }}>
          Welcome
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.45 }}
          className="text-[14px] leading-relaxed font-medium" style={{ color: '#6B7280' }}>
          Kelola catatan keuangan Anda dengan mudah dan cerdas. Pantau pengeluaran dan pemasukan kapan saja.
        </motion.p>
        <div className="flex-1" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.45 }} className="flex items-center justify-end">
          <motion.button
            whileHover={{ x: -2, y: -2, boxShadow: `6px 6px 0 ${BK}` }}
            whileTap={{ x: 2, y: 2, boxShadow: `2px 2px 0 ${BK}` }}
            onClick={onContinue}
            className="flex items-center gap-3 px-5 py-3 rounded-xl font-black text-[15px] uppercase tracking-wide"
            style={{ background: PRIMARY, color: BK, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
            Continue
            <ArrowRight className="w-5 h-5" style={{ color: BK }} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
