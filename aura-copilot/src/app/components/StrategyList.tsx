'use client'
import useSWR from 'swr'
import StrategyCard from './StrategyCard'
import Dashboard from './Dashboard'
import { CardSkeleton } from './Skeleton'

const isHex = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s || '')

export default function StrategyList({ address }: { address: string }) {
  const fetcher = (u: string) => fetch(u).then((r) => r.json())
  const ok = isHex(address)
  const { data, isLoading, error } = useSWR(
    ok ? `/api/insights?address=${address}` : null,
    fetcher
  )

  if (!address) return null
  if (!ok) return <div className="mt-6 text-sm text-red-300">Invalid address. Use 0x… or ENS.</div>
  if (error) return <div className="mt-6 text-sm text-red-300">Failed to load insights.</div>
  if (isLoading)
    return (
      <div className="mt-6 space-y-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )

  const { tvlUSD, networkCount, sections } = data || {}
  const allStrategies = [
    ...(sections?.airdrop || []),
    ...(sections?.doubledip || []),
    ...(sections?.other || []),
  ]

  return (
    <div className="mt-6 space-y-8">
      <Dashboard tvlUSD={tvlUSD} networkCount={networkCount} />

      <h3 className="font-semibold mb-3 text-white">Unclaimed / Airdrops</h3>
      <Section items={sections?.airdrop || []} address={address} />

      <h3 className="font-semibold mb-3 text-white">Double-Dip / Stacked Yield</h3>
      <Section items={sections?.doubledip || []} address={address} />

      <h3 className="font-semibold mb-3 text-white">Other Strategies</h3>
      <Section items={sections?.other || []} address={address} />
    </div>
  )
}

function Section({ items, address }: { items: any[]; address: string }) {
  async function save(title: string, payload: any) {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, title, payload }),
    })
    alert('Saved!')
  }

  if (!items?.length) {
    return <div className="text-sm text-slate-400 mb-6">No items found.</div>
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((it, i) => (
        <StrategyCard key={i} item={it} address={address} onSave={save} />
      ))}
    </div>
  )
}
