'use client'

import useSWR from 'swr'
import StrategyCard from '../components/StrategyCard'

export default function BookmarksPage() {
  const fetcher = (u: string) => fetch(u).then((r) => r.json())
  const { data, isLoading, error } = useSWR('/api/bookmarks', fetcher)

  return (
    <main className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Watchlist</h1>

      {isLoading && <div className="text-slate-300">Loading…</div>}
      {error && <div className="text-red-300">Failed to load watchlist.</div>}
      {!isLoading && !error && Array.isArray(data) && data.length === 0 && (
        <div className="text-slate-300">No bookmarks yet.</div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data || []).map((b: any) => (
          <StrategyCard
            key={b.id}
            item={b.payload}
            address={b.address}
            // onSave omitted deliberately for watchlist
          />
        ))}
      </div>
    </main>
  )
}
