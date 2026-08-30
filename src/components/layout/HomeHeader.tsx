import { motion } from 'framer-motion';
import { Menu, Bell } from 'lucide-react';
import { BK, PRIMARY } from '@/lib/constants';

export default function HomeHeader({ title, onMenu }: { title: string; onMenu: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
      style={{ background: PRIMARY, borderBottom: `3px solid ${BK}` }}>
      {/* Hamburger — only on mobile */}
      <motion.button onClick={onMenu}
        whileHover={{ x: -1, y: -1, boxShadow: `3px 3px 0 ${BK}` }}
        whileTap={{ x: 1, y: 1, boxShadow: `1px 1px 0 ${BK}` }}
        className="w-9 h-9 rounded-lg flex items-center justify-center md:hidden"
        style={{ background: 'rgba(255,255,255,0.25)', border: `2px solid rgba(255,255,255,0.5)`, boxShadow: `2px 2px 0 ${BK}` }}>
        <Menu className="w-[18px] h-[18px] text-white" />
      </motion.button>
      <h2 className="font-display font-black text-white text-[15px] uppercase tracking-wide">{title}</h2>
      <button className="w-9 h-9 rounded-lg flex items-center justify-center relative"
        style={{ background: 'rgba(255,255,255,0.25)', border: `2px solid rgba(255,255,255,0.5)`, boxShadow: `2px 2px 0 ${BK}` }}>
        <Bell className="w-[18px] h-[18px] text-white" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-sm" style={{ background: BK }} />
      </button>
    </div>
  );
}
