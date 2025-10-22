'use client'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8b5cf6', '#10b981']

export function RiskDistributionChart({ strategies }: { strategies: any[] }) {
  const map: Record<string, number> = {}
  strategies.forEach(s => {
    const k = (s.risk || 'unknown').toLowerCase()
    map[k] = (map[k] ?? 0) + 1
  })
  const data = Object.entries(map).map(([name, value]) => ({ name, value }))

  return (
    <div className="border rounded p-4 bg-white">
      <h4 className="font-semibold mb-3 text-center">Risk Distribution</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function APYComparisonChart({ strategies }: { strategies: any[] }) {
  const data = strategies
    .flatMap(s => (s.actions || []))
    .map(a => (a?.apy || '').toString())
    .map(t => t.replace(/[^0-9.\-–]/g, ''))
    .map(t => {
      const first = (t.split(/-|–/)[0] || '').trim()
      return Number(first || 0)
    })
    .filter(n => Number.isFinite(n) && n > 0)
    .slice(0, 8)
    .map((n, i) => ({ name: `Str ${i+1}`, apy: n }))

  return (
    <div className="border rounded p-4 bg-white">
      <h4 className="font-semibold mb-3">APY Comparison</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="name" fontSize={12} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="apy" fill="#8b5cf6" name="APY %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function NetworkDistributionChart({ balances }: { balances: any }) {
  const data = (balances?.portfolio || []).map((p: any) => ({
    name: p?.network?.name || 'Unknown',
    tokens: (p?.tokens || []).length,
  }))

  return (
    <div className="border rounded p-4 bg-white">
      <h4 className="font-semibold mb-3">Network Distribution</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="name" fontSize={12} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tokens" fill="#10b981" name="Token Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
