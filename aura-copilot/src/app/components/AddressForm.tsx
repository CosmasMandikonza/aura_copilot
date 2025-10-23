'use client'

import { useState } from 'react'
import DemoMenu from './DemoMenu'

function isHexAddress(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s || '')
}

export default function AddressForm({
  onAnalyze,
}: {
  onAnalyze: (address: string) => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    let input = value.trim()
    if (!input) {
      setError('Enter a wallet address or ENS')
      return
    }

    setLoading(true)
    try {
      if (isHexAddress(input)) {
        onAnalyze(input)
        return
      }
      const res = await fetch(`/api/resolve?input=${encodeURIComponent(input)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Invalid input' }))
        setError(err.error || 'Invalid input')
        return
      }
      const data = await res.json()
      onAnalyze(data.address)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative group max-w-3xl mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex gap-3 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
          <input
            className="flex-1 border border-white/20 rounded px-3 py-2 bg-white/5 placeholder-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="Enter wallet address or ENS (e.g., vitalik.eth)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Analyzing…' : '🔮 Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto glassmorphism rounded-xl p-3 border-red-500/40">
          <p className="text-rose-300 text-sm">⚠️ {error}</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <DemoMenu onPick={(s) => setValue(s)} />
      </div>
    </form>
  )
}

