'use client'
import useSWR from 'swr'
import { useState } from 'react'

export default function AIAnalysis({ address }: { address: string }) {
  const [expanded, setExpanded] = useState(true)
  const { data, isLoading, error } = useSWR(
    address ? `/api/ai-analysis?address=${address}` : null,
    (u) => fetch(u).then((r) => r.json())
  )

  if (!address) return null

  return (
    <section className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20"></div>
      <div className="relative glassmorphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">AI Portfolio Analysis</h3>
              <p className="text-xs text-purple-200">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded((x) => !x)}
            className="px-3 py-1.5 rounded bg-white/10 text-purple-300 text-sm hover:bg-white/20"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="animate-spin h-4 w-4 border-2 border-purple-500/50 border-t-transparent rounded-full" />
            AI analyzing your portfolio…
          </div>
        )}

        {error && (
          <div className="text-sm text-red-300">
            AI analysis temporarily unavailable. Strategy data still available below.
          </div>
        )}

        {data?.analysis && (
          <div className={`${!expanded ? 'line-clamp-4' : ''}`}>
            <div className="whitespace-pre-wrap text-sm text-slate-200">{data.analysis}</div>
          </div>
        )}
      </div>
    </section>
  )
}

