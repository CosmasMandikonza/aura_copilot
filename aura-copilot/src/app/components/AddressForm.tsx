'use client'
import { useState } from 'react'
import DemoMenu from './DemoMenu'

function isHexAddress(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s || '')
}

export default function AddressForm({ onAnalyze }:{ onAnalyze:(address:string)=>void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    let input = value.trim()
    if (!input) { setError('Enter a wallet address or ENS'); return }

    setLoading(true)
    try {
      // Try as-is if it’s already a hex address
      if (isHexAddress(input)) {
        onAnalyze(input)
        return
      }
      // Otherwise call our resolver
      const res = await fetch(`/api/resolve?input=${encodeURIComponent(input)}`)
      if (!res.ok) {
        const err = await res.json().catch(()=>({error:'Invalid input'}))
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-transparent"
          placeholder="Paste 0x address or ENS (e.g., vitalik.eth)"
          value={value}
          onChange={e=>setValue(e.target.value)}
        />
        <button className="px-4 py-2 bg-black text-white rounded">Analyze</button>
      </div>

      {loading && <div className="text-sm text-slate-400">Resolving…</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Demo helpers for judges */}
      <div className="flex gap-2 text-xs text-slate-500">
        <DemoMenu onPick={(s)=>setValue(s)} />
      </div>
    </form>
  )
}

