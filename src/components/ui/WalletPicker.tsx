import { BK, BG } from '@/lib/constants';
import { fmtK } from '@/lib/helpers';
import type { WalletData } from '@/lib/types';

export default function WalletPicker({
  wallets, selected, onSelect, label,
}: { wallets: WalletData[]; selected: number | null; onSelect: (id: number) => void; label: string }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest mb-2 ml-0.5" style={{ color: BK }}>{label}</p>
      <div className="flex gap-2 flex-wrap">
        {wallets.map(w => {
          const active = selected === w.id;
          return (
            <button key={w.id} type="button" onClick={() => onSelect(w.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-bold transition-all"
              style={{
                background: active ? w.color : BG,
                border: `2px solid ${BK}`,
                color: active ? 'white' : BK,
                boxShadow: active ? `3px 3px 0 ${BK}` : `2px 2px 0 ${BK}`,
              }}>
              <span>{w.emoji}</span>
              <span>{w.name}</span>
              <span className="text-[11px] font-medium opacity-80">{fmtK(w.balance)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
