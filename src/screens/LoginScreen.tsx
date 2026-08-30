import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { PRIMARY, BK, BG } from '@/lib/constants';
import TopoBg from '@/components/ui/TopoBg';
import Wave from '@/components/ui/Wave';
import { supabase } from '@/lib/supabase';

export default function LoginScreen({
  onBack, onLogin,
}: { onBack: () => void; onLogin: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Depending on Supabase settings, email confirmation might be required
        // But for now, let's assume it logs them in or asks them to verify.
        // We can just show a success message or login.
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      onLogin();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 'clamp(190px, 34svh, 252px)', background: PRIMARY }}>
        <TopoBg />
        <button onClick={onBack}
          className="absolute top-5 left-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.22)' }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.32)')}
          onMouseOut={e  => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}>
          <ArrowRight className="w-4 h-4 text-white rotate-180" />
        </button>
      </div>
      <Wave />
      <div className="flex-1 px-8 pt-0 pb-5 flex flex-col overflow-y-auto" style={{ marginTop: '-1px', background: BG }}>
        <h1 className="font-display text-[2.1rem] font-black leading-tight mb-4 shrink-0" style={{ color: BK }}>
          {isSignUp ? 'Sign up' : 'Sign in'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col shrink-0 pb-4">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: BK }}>Email</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              style={{ border: `2px solid ${BK}`, background: BG, boxShadow: `3px 3px 0 ${BK}` }}>
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: PRIMARY }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="demo@email.com"
                className="flex-1 text-[15px] font-medium placeholder:font-normal outline-none bg-transparent"
                style={{ color: BK }} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: BK }}>Password</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              style={{ border: `2px solid ${BK}`, background: BG, boxShadow: `3px 3px 0 ${BK}` }}>
              <Lock className="w-4 h-4 flex-shrink-0" style={{ color: PRIMARY }} />
              <input type={showPw ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)} placeholder="enter your password"
                className="flex-1 text-[15px] font-medium placeholder:font-normal outline-none bg-transparent"
                style={{ color: BK }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="flex-shrink-0 transition-colors"
                style={{ color: BK }}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {errorMsg && (
            <div className="text-red-500 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[13px] font-bold" style={{ color: '#6B7280' }}>Ingat saya</span>
              <a href="#" className="text-[13px] font-black uppercase tracking-wide hover:opacity-80" style={{ color: PRIMARY }}>
                Lupa Password?
              </a>
            </div>
          )}
          <div className="flex-1" />
          <motion.button
            whileHover={{ x: -2, y: -2, boxShadow: `6px 6px 0 ${BK}` }}
            whileTap={{ x: 2, y: 2, boxShadow: `2px 2px 0 ${BK}` }}
            type="submit" disabled={loading || !email || !password}
            className="w-full py-4 rounded-xl font-black text-[15px] uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: PRIMARY, color: BK, border: `2px solid ${BK}`, boxShadow: `4px 4px 0 ${BK}` }}>
            {loading
              ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto" />
              : (isSignUp ? 'Daftar' : 'Login')}
          </motion.button>
          
          <div className="text-center text-[13px] font-medium pb-1" style={{ color: '#6B7280' }}>
            {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }} className="font-black" style={{ color: PRIMARY }}>
              {isSignUp ? 'Login' : 'Daftar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
