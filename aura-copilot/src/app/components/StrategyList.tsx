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
  if (!ok)
    return (
      <div className="mt-6 text-sm text-red-400">
        Invalid address. Use 0x… or ENS in the field above.
      </div>
    )
  if (error)
    return (
      <div className="mt-6 text-sm text-red-400">Failed to load insights.</div>
    )
  if (isLoading)
    return (
      <div className="mt-6 space-y-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )

  const { tvlUSD, networkCount, sections } = data || {}
  return (
    <div className="mt-6 space-y-8">
      <Dashboard tvlUSD={tvlUSD} networkCount={networkCount} />

      <Section title="Unclaimed / Airdrops" items={sections?.airdrop || []} address={address} />
      <Section title="Double-Dip / Stacked Yield" items={sections?.doubledip || []} address={address} />
      <Section title="Other Strategies" items={sections?.other || []} address={address} />
    </div>
  )
}

function Section({
  title,
  items,
  address,
}: {
  title: string
  items: any[]
  address: string
}) {
  async function save(title: string, payload: any) {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, title, payload }),
    })
    alert('Saved!')
  }

  return (
    <div>
      <h3 className="font-semibold text-white mb-3">{title}</h3>
      {items.length === 0 ? (
        <div className="text-sm text-slate-400">No items found.</div>
      ) : null}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <StrategyCard
            key={i}
            item={it}
            address={address}
            onSave={(t, p) => save(t, p)}
          />
        ))}
      </div>
    </div>
  )
}
