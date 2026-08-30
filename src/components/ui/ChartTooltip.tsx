import { fmt, fmtK } from '@/lib/helpers';

export default function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const income  = payload.find((p: any) => p.dataKey === 'income')?.value  ?? 0;
  const expense = payload.find((p: any) => p.dataKey === 'expense')?.value ?? 0;
  const balance = payload.find((p: any) => p.dataKey === 'balance')?.value ?? 0;
  return (
    <div className="rounded-xl px-3 py-2.5 text-[11.5px] shadow-lg"
      style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)', minWidth: '130px' }}>
      <p className="text-gray-400 mb-1.5 font-medium">{label}</p>
      {income > 0 && <p className="text-emerald-400 font-semibold">▲ {fmtK(income)}</p>}
      {expense > 0 && <p className="text-orange-400 font-semibold">▼ {fmtK(expense)}</p>}
      <p className="text-white font-bold mt-1 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {fmt(balance)}
      </p>
    </div>
  );
}
