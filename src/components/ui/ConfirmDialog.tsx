import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { BK, BG, PRIMARY } from '@/lib/constants';

export default function ConfirmDialog({
  open, title, message, confirmLabel, confirmColor, onConfirm, onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="confirm-bd"
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            key="confirm-dialog"
            className="fixed z-[101] left-1/2 top-1/2 w-[min(340px,90vw)] rounded-xl p-5"
            style={{
              background: BG,
              border: `3px solid ${BK}`,
              boxShadow: `6px 6px 0 ${BK}`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#FEF3C7', border: `2px solid ${BK}` }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: '#D97706' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[15px] mb-1" style={{ color: BK }}>{title}</h3>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: '#6B7280' }}>{message}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ x: -1, y: -1, boxShadow: `4px 4px 0 ${BK}` }}
                whileTap={{ x: 1, y: 1, boxShadow: `1px 1px 0 ${BK}` }}
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl font-black text-[13px] uppercase tracking-wide"
                style={{ background: BG, border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}`, color: BK }}
              >
                Batal
              </motion.button>
              <motion.button
                whileHover={{ x: -1, y: -1, boxShadow: `4px 4px 0 ${BK}` }}
                whileTap={{ x: 1, y: 1, boxShadow: `1px 1px 0 ${BK}` }}
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl font-black text-[13px] uppercase tracking-wide text-white"
                style={{ background: confirmColor ?? '#DC2626', border: `2px solid ${BK}`, boxShadow: `3px 3px 0 ${BK}` }}
              >
                {confirmLabel ?? 'Hapus'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
