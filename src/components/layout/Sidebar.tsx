import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut } from 'lucide-react';
import { Wallet } from 'lucide-react';
import { BK, BG, PRIMARY, NAV } from '@/lib/constants';
import type { MenuKey } from '@/lib/types';

// ─── Desktop Sidebar (always visible ≥768px) ─────────────────────────────────

export function DesktopSidebar({ active, onSelect, onLogout }: {
  active: MenuKey; onSelect: (k: MenuKey) => void; onLogout: () => void;
}) {
  return (
    <div
      className="hidden md:flex flex-col flex-shrink-0 overflow-hidden"
      style={{ width: '260px', background: BG, borderRight: `3px solid ${BK}` }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex-shrink-0"
        style={{ background: PRIMARY, borderBottom: `3px solid ${BK}` }}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)' }}>
            <Wallet className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          </div>
          <span className="text-white font-display font-black text-[17px] uppercase tracking-wide">CatatUang</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)' }}>
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-[13.5px] leading-tight">Pengguna</p>
            <p className="text-white/70 text-[11.5px] font-medium">demo@email.com</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
        {NAV.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button key={key} onClick={() => onSelect(key)}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all duration-150 text-left"
              style={{
                background: isActive ? BK : 'transparent',
                color: isActive ? 'white' : BK,
                border: isActive ? `2px solid ${BK}` : '2px solid transparent',
                boxShadow: isActive ? `3px 3px 0 ${PRIMARY}` : 'none',
              }}>
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[14px] flex-1 ${isActive ? 'font-black' : 'font-bold'}`}>{label}</span>
              {isActive && <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PRIMARY }} />}
            </button>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="px-3 pb-5 pt-2 flex-shrink-0" style={{ borderTop: `2px solid ${BK}` }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg transition-colors"
          style={{ color: '#DC2626' }}
          onMouseOver={e => (e.currentTarget.style.background = '#FEE2E2')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
          <LogOut className="w-4 h-4" strokeWidth={2} />
          <span className="text-[14px] font-bold">Keluar</span>
        </button>
      </div>
    </div>
  );
}

// ─── Mobile Sidebar (overlay, <768px) ─────────────────────────────────────────

export default function Sidebar({ open, active, onClose, onSelect, onLogout }: {
  open: boolean; active: MenuKey;
  onClose: () => void; onSelect: (k: MenuKey) => void; onLogout?: () => void;
}) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20 md:hidden" style={{ background: 'rgba(0,0,0,0.42)' }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div key="pn"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed left-0 top-0 bottom-0 z-30 flex flex-col overflow-hidden md:hidden"
            style={{ width: 'min(300px, 82vw)', background: BG, borderRight: `3px solid ${BK}` }}>
            {/* Header */}
            <div className="px-6 pt-8 pb-5 relative flex-shrink-0"
              style={{ background: PRIMARY, borderBottom: `3px solid ${BK}` }}>
              <button onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)' }}>
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)' }}>
                  <Wallet className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                </div>
                <span className="text-white font-display font-black text-[17px] uppercase tracking-wide">CatatUang</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)' }}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-[13.5px] leading-tight">Pengguna</p>
                  <p className="text-white/70 text-[11.5px] font-medium">demo@email.com</p>
                </div>
              </div>
            </div>
            {/* Nav */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
              {NAV.map(({ key, label, Icon }) => {
                const isActive = active === key;
                return (
                  <button key={key} onClick={() => { onSelect(key); onClose(); }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all duration-150 text-left"
                    style={{
                      background: isActive ? BK : 'transparent',
                      color: isActive ? 'white' : BK,
                      border: isActive ? `2px solid ${BK}` : '2px solid transparent',
                      boxShadow: isActive ? `3px 3px 0 ${PRIMARY}` : 'none',
                    }}>
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                    <span className={`text-[14px] flex-1 ${isActive ? 'font-black' : 'font-bold'}`}>{label}</span>
                    {isActive && <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PRIMARY }} />}
                  </button>
                );
              })}
            </nav>
            {/* Footer */}
            <div className="px-3 pb-6 pt-2 flex-shrink-0" style={{ borderTop: `2px solid ${BK}` }}>
              <button
                onClick={() => { onLogout?.(); onClose(); }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg transition-colors"
                style={{ color: '#DC2626' }}
                onMouseOver={e => (e.currentTarget.style.background = '#FEE2E2')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                <LogOut className="w-4 h-4" strokeWidth={2} />
                <span className="text-[14px] font-bold">Keluar</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
