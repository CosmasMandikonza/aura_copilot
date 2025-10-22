'use client'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}


export default function Dashboard({
  tvlUSD,
  networkCount,
}: { tvlUSD?: number; networkCount?: number }) {
  const fmt = (n?: number) =>
    typeof n === 'number' ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : '—'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 border">
        <div className="text-xs text-slate-500">Total Value (est.)</div>
        <div className="text-xl font-semibold">{fmt(tvlUSD)}</div>
      </div>
      <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 border">
        <div className="text-xs text-slate-500">Networks</div>
        <div className="text-xl font-semibold">{networkCount ?? '—'}</div>
      </div>
      <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 border">
        <div className="text-xs text-slate-500">Cache TTL</div>
        <div className="text-xl font-semibold">30m</div>
      </div>
    </div>
  )
}
