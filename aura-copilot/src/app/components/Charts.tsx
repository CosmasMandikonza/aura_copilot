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

const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA']

export function RiskDistributionChart({ strategies }: { strategies: any[] }) {
  const riskCounts = (strategies || []).reduce((acc: any, s: any) => {
    const r = s.risk || 'unknown'
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {})
  const data = Object.entries(riskCounts).map(([name, value]) => ({ name, value }))

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <h4 className="font-semibold mb-3 text-center text-white">Risk Distribution</h4>
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
  )
}

export function APYComparisonChart({ strategies }: { strategies: any[] }) {
  const data = (strategies || [])
    .filter((s) => s.actions?.[0]?.apy && !String(s.actions[0].apy).includes('N/A'))
    .slice(0, 6)
    .map((s) => ({
      name: s.name?.substring(0, 20) || 'Strategy',
      apy:
        parseFloat(String(s.actions[0].apy).replace(/[^0-9.-]/g, '').split('-')[0]) || 0,
    }))

  return (
    <div className="glassmorphism rounded-2xl p-4">
      <h4 className="font-semibold mb-3 text-white">APY Comparison (Top 6)</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} stroke="#A3A3A3" />
          <YAxis stroke="#A3A3A3" />
          <Tooltip />
          <Bar dataKey="apy" fill="#A78BFA" />
        </BarChart>
      </ResponsiveContainer>
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
    <div className="glassmorphism rounded-2xl p-4">
      <h4 className="font-semibold mb-3 text-white">Network Distribution</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={networks}>
          <XAxis dataKey="name" stroke="#A3A3A3" />
          <YAxis stroke="#A3A3A3" />
          <Legend />
          <Tooltip />
          <Bar dataKey="tokens" fill="#34D399" name="Token Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


