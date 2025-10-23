'use client'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#fb7185', '#a78bfa']

export function RiskDistributionChart({ strategies }: { strategies: any[] }) {
  const riskCounts = strategies.reduce((acc: any, s: any) => {
    const risk = s.risk || 'unknown'
    acc[risk] = (acc[risk] || 0) + 1
    return acc
  }, {})
  const data = Object.entries(riskCounts).map(([name, value]) => ({ name, value }))

  return (
    <div className="glassmorphism rounded-lg p-4">
      <h4 className="font-semibold text-center text-white mb-3">Risk Distribution</h4>
      <div className="text-slate-200">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} label outerRadius={80} dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function APYComparisonChart({ strategies }: { strategies: any[] }) {
  const data = (strategies || [])
    .filter((s) => s.actions?.[0]?.apy && !String(s.actions[0].apy).includes('N/A'))
    .slice(0, 6)
    .map((s) => ({
      name: s.name?.substring(0, 20) || 'Strategy',
      apy: parseFloat(String(s.actions[0].apy).replace(/[^0-9.-]/g, '').split('-')[0]) || 0,
    }))

  return (
    <div className="glassmorphism rounded-lg p-4">
      <h4 className="font-semibold text-white mb-3">APY Comparison (Top 6)</h4>
      <div className="text-slate-200">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} fontSize={11} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="apy" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function NetworkDistributionChart({ balances }: { balances: any }) {
  const networks =
    balances?.portfolio?.map((p: any) => ({
      name: p.network?.name || 'Unknown',
      tokens: p.tokens?.length || 0,
    })) || []

  return (
    <div className="glassmorphism rounded-lg p-4">
      <h4 className="font-semibold text-white mb-3">Network Distribution</h4>
      <div className="text-slate-200">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={networks}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tokens" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

