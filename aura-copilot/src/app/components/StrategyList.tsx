'use client'
import useSWR from 'swr'
import Dashboard from './Dashboard'
import { CardSkeleton } from './Skeleton'
import AIAnalysis from './AIAnalysis'
import { RiskDistributionChart, APYComparisonChart, NetworkDistributionChart } from './Charts'
import StrategyCard from './StrategyCard'

const isHex = (s:string)=> /^0x[a-fA-F0-9]{40}$/.test(s || '')
const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function StrategyList({ address }:{ address:string }) {
  if (!address) return null

  const ok = isHex(address)
  const { data: insights, isLoading, error } = useSWR(
    ok ? `/api/insights?address=${address}` : null, fetcher
  )
  const { data: balances } = useSWR(
    ok ? `/api/aura/balances?address=${address}` : null, fetcher
  )

  if (!ok) return <div className="mt-6 text-sm text-red-500">Invalid address. Use a 0x… address (ENS is resolved in the field above).</div>
  if (error) return <div className="mt-6 text-sm text-red-500">Failed to load insights.</div>
  if (isLoading) return (
    <div className="mt-6 space-y-3">
      <CardSkeleton /><CardSkeleton /><CardSkeleton />
    </div>
  )

  const { tvlUSD=0, networkCount=0, sections } = insights || {}
  const allStrategies = [
    ...(sections?.airdrop || []),
    ...(sections?.doubledip || []),
    ...(sections?.other || []),
  ]

  async function save(address:string, title:string, payload:any) {
    const res = await fetch('/api/bookmarks', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ address, title, payload })
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(`Failed to save: ${j.error || res.statusText}`)
      return
    }
    alert('Saved!')
  }

  return (
    <div className="mt-6 space-y-8">
      <Dashboard tvlUSD={tvlUSD} networkCount={networkCount} />

      {/* AI panel */}
      <AIAnalysis address={address} />

      {/* charts */}
      <div className="grid md:grid-cols-3 gap-4">
        <RiskDistributionChart strategies={allStrategies} />
        <APYComparisonChart strategies={allStrategies} />
        <NetworkDistributionChart balances={balances} />
      </div>

      {/* sections */}
      <Section title="Unclaimed / Airdrops" items={sections?.airdrop || []} address={address} onSave={save} />
      <Section title="Double-Dip / Stacked Yield" items={sections?.doubledip || []} address={address} onSave={save} />
      <Section title="Other Strategies" items={sections?.other || []} address={address} onSave={save} />
    </div>
  )
}

function Section({
  title, items, address, onSave
}:{ title:string; items:any[]; address:string; onSave:(addr:string, title:string, payload:any)=>void }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      {items.length === 0 ? <div className="text-sm text-slate-500">No items found.</div> : null}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i)=> (
          <StrategyCard key={i} item={it} address={address} onSave={(title, payload)=>onSave(address, title, payload)} />
        ))}
      </div>
    </div>
  )
}
