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
        ? tvlUSD.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })
        : '—',
      icon: '💰',
    },
    {
      label: 'Networks',
      value: networkCount?.toString() ?? '—',
      icon: '🌐',
    },
    {
      label: 'Analysis Cache',
      value: '30m',
      icon: '⚡',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-3xl">{stat.icon}</div>
          </div>
          <div className="text-sm text-purple-200 mb-1">{stat.label}</div>
          <div className="text-3xl font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

