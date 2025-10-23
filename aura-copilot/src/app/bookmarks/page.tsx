'use client'

import useSWR from 'swr'
import StrategyCard from '../components/StrategyCard'

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export default function BookmarksPage() {
  const { data } = useSWR('/api/bookmarks', fetcher, { refreshInterval: 0 })
  const items: any[] = Array.isArray(data) ? data : []

  return (
    <main className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Watchlist</h1>
      {items.length === 0 && (
        <div className="text-slate-300">No bookmarks yet.</div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((b: any) => (
          <StrategyCard
            key={b.id || b.title}
            item={b.payload || b}
            address={b.address}
          />
        ))}
      </div>
    </main>
  )
}

