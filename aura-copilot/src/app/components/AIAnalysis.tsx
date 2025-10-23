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
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20"></div>
      <section className="relative glassmorphism rounded-3xl p-6 border-2 border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Portfolio Analysis</h3>
              <p className="text-sm text-purple-200">
                Real-time intelligence from your on-chain activity
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded((x) => !x)}
            className="px-3 py-1.5 glassmorphism rounded-lg text-purple-300 hover:text-white transition-colors text-sm font-medium"
          >
            {expanded ? '📉 Collapse' : '📈 Expand'}
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            AI analyzing your portfolio…
          </div>
        )}

        {error && (
          <div className="glassmorphism rounded-xl p-4 border-red-500/40">
            <p className="text-rose-300 text-sm">
              ⚠️ AI analysis temporarily unavailable. Strategy data still available
              below.
            </p>
          </div>
        )}

        {data?.analysis && (
          <div className={`mt-2 ${!expanded ? 'line-clamp-3' : ''}`}>
            <div className="whitespace-pre-wrap text-sm text-slate-200 bg-slate-900/40 rounded-xl p-4 border border-white/10">
              {data.analysis}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
