'use client'
import useSWR from 'swr'
import { useState } from 'react'

export default function AIAnalysis({ address }: { address: string }) {
  const [expanded, setExpanded] = useState(false)
  const { data, isLoading, error } = useSWR(
    address ? `/api/ai-analysis?address=${address}` : null,
    (u)=>fetch(u).then(r=>r.json())
  )

  if (!address) return null

  return (
    <section className="border-2 border-purple-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="font-bold text-lg">AI Portfolio Analysis</h3>
        </div>
        <button onClick={()=>setExpanded(x=>!x)} className="text-sm text-purple-600 underline">
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full" />
          AI analyzing your portfolio...
        </div>
      )}

      {error && <div className="text-sm text-red-500">AI analysis failed.</div>}

      {data?.analysis && (
        <div className={`prose prose-sm max-w-none ${!expanded ? 'line-clamp-5' : ''}`}>
          <div className="whitespace-pre-wrap text-sm text-slate-800">{data.analysis}</div>
        </div>
      )}
    </section>
  )
}
