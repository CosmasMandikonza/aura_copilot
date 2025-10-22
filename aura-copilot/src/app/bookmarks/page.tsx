'use client'
import useSWR from 'swr'

export default function BookmarksPage() {
  const { data, error } = useSWR('/api/bookmarks', (u)=>fetch(u).then(r=>r.json()))
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading…</div>

  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Watchlist</h1>
      {data.length === 0 && <div>No bookmarks yet.</div>}
      <div className="space-y-4">
        {data.map((b:any)=>(
          <div key={b.id} className="border rounded p-3">
            <div className="text-sm text-slate-500">{b.address}</div>
            <div className="font-semibold">{b.title}</div>
            <pre className="text-xs mt-2 overflow-auto bg-slate-50 p-2 rounded">
              {JSON.stringify(b.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </main>
  )
}
