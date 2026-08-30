import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

import { BK, BG, PRIMARY, NAV } from '@/lib/constants';
import type { Screen, MenuKey, Transaction, WalletData } from '@/lib/types';
import { supabase } from '@/lib/supabase';

import { DesktopSidebar } from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/Sidebar';
import HomeHeader from '@/components/layout/HomeHeader';
import BottomNav from '@/components/layout/BottomNav';
import WalletDetailSheet from '@/components/sheets/WalletDetailSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

import LandingScreen from '@/screens/LandingScreen';
import LoginScreen from '@/screens/LoginScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import TransaksiScreen from '@/screens/TransaksiScreen';
import RiwayatScreen from '@/screens/RiwayatScreen';
import DompetScreen from '@/screens/DompetScreen';
import PengaturanScreen from '@/screens/PengaturanScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [activeMenu, setActiveMenu] = useState<MenuKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);

  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [deleteTxId, setDeleteTxId] = useState<number | null>(null);

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setScreen('home');
        fetchData();
      } else {
        setScreen('landing');
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setScreen('home');
        fetchData();
      } else {
        setScreen('landing');
        setWallets([]);
        setTxs([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const [walletsRes, txsRes] = await Promise.all([
        supabase.from('wallets').select('*').order('created_at', { ascending: true }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
      ]);
      if (walletsRes.data) setWallets(walletsRes.data);
      if (txsRes.data) setTxs(txsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setActiveMenu('dashboard');
    setSidebarOpen(false);
  }, []);

  const handleAddTx = useCallback(async (tx: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase.from('transactions').insert([tx]).select().single();
    if (error || !data) {
      console.error(error);
      return;
    }
    setTxs(prev => [data, ...prev]);

    // adjust wallet balances in supabase
    const w = wallets.find(w => w.id === tx.walletId);
    if (w) {
      if (tx.type === 'income') {
        await supabase.from('wallets').update({ balance: w.balance + tx.amount }).eq('id', w.id);
      } else if (tx.type === 'expense') {
        await supabase.from('wallets').update({ balance: w.balance - tx.amount }).eq('id', w.id);
      } else if (tx.type === 'transfer' && tx.toWalletId) {
        await supabase.from('wallets').update({ balance: w.balance - tx.amount }).eq('id', w.id);
        const tw = wallets.find(x => x.id === tx.toWalletId);
        if (tw) {
          await supabase.from('wallets').update({ balance: tw.balance + tx.amount }).eq('id', tw.id);
        }
      }
    }
    fetchData(); // refresh
  }, [wallets]);

  const handleDeleteTx = useCallback((id: number) => {
    setDeleteTxId(id);
  }, []);

  const confirmDeleteTx = useCallback(async () => {
    if (deleteTxId === null) return;
    const tx = txs.find(t => t.id === deleteTxId);
    
    if (tx) {
      // Reverse balance
      const w = wallets.find(w => w.id === tx.walletId);
      if (w) {
        if (tx.type === 'income') {
          await supabase.from('wallets').update({ balance: w.balance - tx.amount }).eq('id', w.id);
        } else if (tx.type === 'expense') {
          await supabase.from('wallets').update({ balance: w.balance + tx.amount }).eq('id', w.id);
        } else if (tx.type === 'transfer' && tx.toWalletId) {
          await supabase.from('wallets').update({ balance: w.balance + tx.amount }).eq('id', w.id);
          const tw = wallets.find(x => x.id === tx.toWalletId);
          if (tw) {
            await supabase.from('wallets').update({ balance: tw.balance - tx.amount }).eq('id', tw.id);
          }
        }
      }
      await supabase.from('transactions').delete().eq('id', deleteTxId);
      fetchData(); // refresh
    }
    setDeleteTxId(null);
  }, [deleteTxId, txs, wallets]);

  const handleAddWallet = useCallback(async (w: Omit<WalletData, 'id'>) => {
    const { data, error } = await supabase.from('wallets').insert([w]).select().single();
    if (error) console.error(error);
    else setWallets(prev => [...prev, data]);
  }, []);

  const handleDeleteWallet = useCallback(async (id: number) => {
    await supabase.from('wallets').delete().eq('id', id);
    setWallets(prev => prev.filter(w => w.id !== id));
  }, []);

  const menuTitle = NAV.find(n => n.key === activeMenu)?.label ?? '';
  const txToDelete = deleteTxId !== null ? txs.find(t => t.id === deleteTxId) : null;

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <div className="w-full h-full flex" style={{ background: BG }}>
      <ConfirmDialog
        open={deleteTxId !== null}
        title="Hapus Transaksi?"
        message={`Transaksi "${txToDelete?.desc ?? ''}" sebesar Rp ${txToDelete ? new Intl.NumberFormat('id-ID').format(txToDelete.amount) : '0'} akan dihapus dan saldo dompet akan disesuaikan.`}
        onConfirm={confirmDeleteTx}
        onCancel={() => setDeleteTxId(null)}
      />

      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col h-full w-full items-center justify-center">
            <div className="w-full h-full sm:max-w-[430px] sm:h-[700px] sm:rounded-[1.5rem] overflow-hidden flex flex-col sm:my-auto"
              style={{ background: BG, border: `3px solid ${BK}`, boxShadow: `8px 8px 0 ${BK}` }}>
              <LandingScreen onContinue={() => setScreen('login')} />
            </div>
          </motion.div>
        )}

        {screen === 'login' && (
          <motion.div key="login"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col h-full w-full items-center justify-center">
            <div className="w-full h-full sm:max-w-[430px] sm:h-[700px] sm:rounded-[1.5rem] overflow-hidden flex flex-col sm:my-auto"
              style={{ background: BG, border: `3px solid ${BK}`, boxShadow: `8px 8px 0 ${BK}` }}>
              <LoginScreen
                onBack={() => setScreen('landing')}
                onLogin={() => {}} // Not needed anymore since onAuthStateChange handles it
              />
            </div>
          </motion.div>
        )}

        {screen === 'home' && (
          <motion.div key="home"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full relative">

            <DesktopSidebar active={activeMenu} onSelect={setActiveMenu} onLogout={handleLogout} />
            <MobileSidebar open={sidebarOpen} active={activeMenu} onClose={() => setSidebarOpen(false)} onSelect={setActiveMenu} onLogout={handleLogout} />

            <div className="flex-1 flex flex-col overflow-hidden relative">
              <AnimatePresence>
                {selectedWalletId !== null && (() => {
                  const w = wallets.find(x => x.id === selectedWalletId);
                  return w ? (
                    <WalletDetailSheet wallet={w} txs={txs} wallets={wallets} onClose={() => setSelectedWalletId(null)} />
                  ) : null;
                })()}
              </AnimatePresence>

              <HomeHeader title={menuTitle} onMenu={() => setSidebarOpen(true)} />

              <AnimatePresence mode="wait">
                <motion.div key={activeMenu}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col overflow-hidden">
                  {activeMenu === 'dashboard'  && (
                    <DashboardScreen txs={txs} wallets={wallets} onNav={setActiveMenu}
                      onWalletClick={setSelectedWalletId} onDeleteTx={handleDeleteTx} />
                  )}
                  {activeMenu === 'transaksi'  && (
                    <TransaksiScreen wallets={wallets} onAdd={handleAddTx} />
                  )}
                  {activeMenu === 'riwayat'    && (
                    <RiwayatScreen txs={txs} wallets={wallets} onDelete={handleDeleteTx} />
                  )}
                  {activeMenu === 'dompet'     && (
                    <DompetScreen wallets={wallets} onAdd={handleAddWallet}
                      onDelete={handleDeleteWallet} onSelectWallet={setSelectedWalletId} />
                  )}
                  {activeMenu === 'pengaturan' && <PengaturanScreen onLogout={handleLogout} />}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {activeMenu === 'dashboard' && (
                  <motion.button key="fab"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ x: -3, y: -3, boxShadow: `8px 8px 0 ${BK}` }}
                    whileTap={{ x: 2, y: 2, boxShadow: `2px 2px 0 ${BK}` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    onClick={() => setActiveMenu('transaksi')}
                    className="absolute bottom-20 right-5 w-14 h-14 rounded-xl flex items-center justify-center z-10 md:bottom-5"
                    style={{ background: PRIMARY, border: `2px solid ${BK}`, boxShadow: `5px 5px 0 ${BK}` }}>
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{ scale: [1, 1.5, 1.5], opacity: [0.4, 0, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      style={{ background: PRIMARY }}
                    />
                    <Plus className="w-6 h-6 relative z-10" style={{ color: BK }} strokeWidth={3} />
                  </motion.button>
                )}
              </AnimatePresence>

              <BottomNav active={activeMenu} onSelect={setActiveMenu} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
