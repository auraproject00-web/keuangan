import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { BK, BG, PRIMARY, NAV } from '@/lib/constants';
import type { MenuKey } from '@/lib/types';

export default function BottomNav({
  active, onSelect,
}: { active: MenuKey; onSelect: (k: MenuKey) => void }) {
  return (
    <div
      className="flex-shrink-0 flex items-end justify-around px-2 md:hidden"
      style={{
        background: BG,
        borderTop: `3px solid ${BK}`,
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))',
        paddingTop: '0.4rem',
      }}
    >
      {NAV.map(({ key, label, Icon }) => {
        const isActive = active === key;
        const isCenter = key === 'transaksi';

        if (isCenter) {
          return (
            <motion.button
              key={key}
              onClick={() => onSelect(key)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center -mt-5"
            >
              <motion.div
                animate={isActive ? { y: -2, boxShadow: `4px 4px 0 ${BK}` } : { y: 0, boxShadow: `3px 3px 0 ${BK}` }}
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-0.5"
                style={{
                  background: isActive ? PRIMARY : BK,
                  border: `2px solid ${BK}`,
                }}
              >
                <Plus className="w-6 h-6" style={{ color: 'white' }} strokeWidth={2.5} />
              </motion.div>
              <span
                className="text-[9px] font-black uppercase tracking-wide"
                style={{ color: isActive ? PRIMARY : '#9CA3AF' }}
              >
                {label}
              </span>
            </motion.button>
          );
        }

        return (
          <motion.button
            key={key}
            onClick={() => onSelect(key)}
            whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[52px]"
          >
            <motion.div
              animate={isActive ? { y: -2 } : { y: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="relative"
            >
              <Icon
                className="w-[22px] h-[22px]"
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? PRIMARY : '#9CA3AF' }}
              />
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: PRIMARY }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
            <span
              className="text-[9px] font-bold uppercase tracking-wide leading-none"
              style={{ color: isActive ? BK : '#9CA3AF' }}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
