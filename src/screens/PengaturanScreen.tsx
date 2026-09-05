import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Globe, Bell, ShieldCheck, Info, LogOut, ChevronRight, Trash2, AlertCircle } from 'lucide-react';
import { BK, BG, PRIMARY } from '@/lib/constants';
import { clearAllData } from '@/lib/storage';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function PengaturanScreen({ onLogout }: { onLogout: () => void }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Auto-hide toast after 2.5s
  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(''), 2500);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  const groups = [
    {
      title: 'Akun',
      items: [
        { Icon: User,        label: 'Profil Saya',        sub: 'Edit informasi akun' },
        { Icon: Globe,       label: 'Bahasa',             sub: 'Indonesia' },
      ],
    },
    {
      title: 'Aplikasi',
      items: [
        { Icon: Bell,        label: 'Notifikasi',         sub: 'Aktif' },
        { Icon: ShieldCheck, label: 'Privasi & Keamanan', sub: '' },
        { Icon: Info,        label: 'Tentang Aplikasi',   sub: 'v1.0.0' },
      ],
    },
  ];

  const handleReset = () => {
    clearAllData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <div className="flex-1 overflow-y-auto pb-6" style={{ background: BG }}>
      <ConfirmDialog
        open={showResetConfirm}
        title="Hapus Semua Data?"
        message="Semua data dompet, transaksi, dan pengaturan akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Hapus Semua"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Keluar dari Akun?"
        message="Anda akan keluar dari aplikasi. Data tetap tersimpan dan bisa diakses kembali setelah login."
        confirmLabel="Keluar"
        confirmColor="#6B7280"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* Floating Toast for WIP Features */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
              style={{ background: '#1F2937', color: 'white' }}
            >
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-[13px] font-bold">{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-4 mt-4 rounded-xl p-4 flex items-center gap-3"
        style={{ background: PRIMARY, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.25)', border: `2px solid rgba(255,255,255,0.5)` }}>P</div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-[14.5px]">Pengguna</p>
          <p className="text-white/70 text-[12px] font-medium">demo@email.com</p>
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.25)', border: `2px solid rgba(255,255,255,0.5)` }}>
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="px-4 mt-5 space-y-4">
        {groups.map(({ title, items }) => (
          <div key={title}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: BK }}>{title}</p>
            <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}`, background: BG }}>
              {items.map(({ Icon, label, sub }, idx) => (
                <button key={label}
                  onClick={() => setToastMsg(`Fitur "${label}" akan segera hadir!`)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                  style={{ borderTop: idx > 0 ? `2px solid ${BK}` : 'none' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#FFF0E8')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: PRIMARY, border: `2px solid ${BK}` }}>
                    <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <span className="flex-1 font-bold text-[13.5px]" style={{ color: BK }}>{label}</span>
                  {sub && <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>{sub}</span>}
                  <ChevronRight className="w-3.5 h-3.5 ml-1" style={{ color: BK }} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Data section */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: BK }}>Data</p>
          <motion.button
            whileHover={{ x: -2, y: -2, boxShadow: `5px 5px 0 ${BK}` }}
            whileTap={{ x: 1, y: 1, boxShadow: `2px 2px 0 ${BK}` }}
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[13px] uppercase tracking-wide mb-2"
            style={{ background: '#FEF3C7', border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}`, color: '#92400E' }}>
            <Trash2 className="w-4 h-4" strokeWidth={2} />
            Hapus Semua Data
          </motion.button>
        </div>

        <motion.button
          whileHover={{ x: -2, y: -2, boxShadow: `5px 5px 0 ${BK}` }}
          whileTap={{ x: 1, y: 1, boxShadow: `2px 2px 0 ${BK}` }}
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[14px] uppercase tracking-wide"
          style={{ background: '#FEE2E2', border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}`, color: '#DC2626' }}>
          <LogOut className="w-4 h-4" strokeWidth={2} />
          Keluar dari Akun
        </motion.button>
      </div>
    </div>
  );
}
