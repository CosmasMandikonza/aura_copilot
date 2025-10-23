'use client'

export default function Dashboard({
  tvlUSD,
  networkCount,
}: {
  tvlUSD?: number
  networkCount?: number
}) {
  const stats = [
    {
      label: 'Portfolio Value',
      value: tvlUSD
        ? tvlUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
        : '—',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Networks',
      value: networkCount?.toString() ?? '—',
      icon: '🌐',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Analysis Cache',
      value: '30m',
      icon: '⚡',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s) => (
        <div key={s.label} className="glassmorphism rounded-2xl p-6 group">
          <div className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${s.color} mb-2`}>{s.icon}</div>
          <div className="text-sm text-purple-200">{s.label}</div>
          <div className="text-3xl font-bold text-white">{s.value}</div>
        </div>
      ))}
    </div>
  )
}



