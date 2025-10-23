'use client'

import useSWR from 'swr'
import StrategyCard from '../components/StrategyCard'

type BookmarksResponse = { items: Array<{ id: string; payload: any; address?: string | null }> }

export default function BookmarksPage() {
  const fetcher = (u: string) => fetch(u).then((r) => r.json() as Promise<BookmarksResponse>)
  const { data, isLoading, error } = useSWR<BookmarksResponse>('/api/bookmarks', fetcher)

  const items = data?.items ?? []

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Watchlist</h1>

      {isLoading && <div className="text-slate-300">Loading…</div>}
      {error && <div className="text-red-300">Failed to load watchlist.</div>}
      {!isLoading && !error && items.length === 0 && (
        <div className="text-slate-300">No bookmarks yet.</div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((b) => (
          <StrategyCard key={b.id} item={b.payload} address={b.address ?? undefined} />
        ))}
      </div>
    </main>
  )
}


